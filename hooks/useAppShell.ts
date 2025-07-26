
import { useState, useCallback, useEffect, useRef } from 'react';
import { getDiscoverySuggestions } from '../services/geminiService';
import { USE_DEMO_DATA } from '@/config';
import { encryptApiKey, decryptApiKey, validateApiKeyFormat } from '@/utils/encryption';
import { useApiUsageMonitor } from '@/hooks/useApiUsageMonitor';

export const useAppShell = () => {
    // --- Usage Monitoring ---
    const { usage, limits, trackApiCall, resetUsage, isLimitReached } = useApiUsageMonitor();
    // --- API Key Management ---
    const [userApiKey, _setUserApiKey] = useState<string | null>(() => {
        try {
            const encryptedKey = localStorage.getItem('userApiKey');
            if (!encryptedKey) return null;
            
            // 新形式での復号化を試行
            let decryptedKey = decryptApiKey(encryptedKey);
            
            // 復号化に失敗した場合、旧形式からの移行を試行
            if (!decryptedKey) {
                const { migrateOldEncryption } = require('@/utils/encryption');
                const migratedKey = migrateOldEncryption(encryptedKey);
                if (migratedKey) {
                    localStorage.setItem('userApiKey', migratedKey);
                    decryptedKey = decryptApiKey(migratedKey);
                }
            }
            
            return decryptedKey;
        } catch (e) {
            console.error("Could not access localStorage:", e);
            return null;
        }
    });
    
    // The app now relies exclusively on user-provided API keys.
    // `process.env.API_KEY` is no longer used.
    const effectiveApiKey = userApiKey || null;
    const isApiKeyConfigured = !!effectiveApiKey;

    const setUserApiKey = useCallback((key: string) => {
        if (key && key.trim()) {
            const trimmedKey = key.trim();
            
            // APIキー形式の検証
            if (!validateApiKeyFormat(trimmedKey)) {
                alert('無効なAPIキー形式です。Gemini APIキーは "AIza" で始まる39文字の文字列である必要があります。');
                return false;
            }
            
            // 暗号化して保存
            const encryptedKey = encryptApiKey(trimmedKey);
            localStorage.setItem('userApiKey', encryptedKey);
            _setUserApiKey(trimmedKey);
            return true;
        }
        return false;
    }, []);

    const clearUserApiKey = useCallback(() => {
        localStorage.removeItem('userApiKey');
        _setUserApiKey(null);
    }, []);

    // --- 体験モード管理 ---
    const [useDemoData, setUseDemoData] = useState<boolean>(() => {
        if (!isApiKeyConfigured) {
            return true;
        }
        const saved = localStorage.getItem('useDemoData');
        return saved !== null ? JSON.parse(saved) : USE_DEMO_DATA;
    });
    
    // --- Sidebar and Modal State ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
    const [initialModalTab, setInitialModalTab] = useState<'flow' | 'model' | 'api_key'>('flow');

    // --- Discovery Suggestions State ---
    const [discoverySuggestions, setDiscoverySuggestions] = useState<string[]>([]);
    const [isDiscoveryLoading, setIsDiscoveryLoading] = useState<boolean>(true);
    const [discoveryError, setDiscoveryError] = useState<string | null>(null);

    // --- Callbacks and Effects ---
    const onToggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleMediaQueryChange = () => setIsSidebarOpen(mediaQuery.matches);
        handleMediaQueryChange();
        mediaQuery.addEventListener('change', handleMediaQueryChange);
        return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }, []);
    
    const fetchDiscoverySuggestions = useCallback(async (isLive?: boolean) => {
        setIsDiscoveryLoading(true);
        setDiscoveryError(null);
        
        const demoMode = isLive !== undefined ? !isLive : useDemoData;
        
        const tempApiKey = effectiveApiKey;
        if(!tempApiKey && !demoMode) {
            setDiscoveryError('APIキーが設定されていないため、提案を取得できません。');
            setIsDiscoveryLoading(false);
            return;
        }

        try {
          // 使用量制限チェック（デモモードでない場合のみ）
          if (!demoMode && !trackApiCall()) {
            setDiscoveryError('API使用制限に達しています。');
            setIsDiscoveryLoading(false);
            return;
          }

          const suggestions = await getDiscoverySuggestions(tempApiKey, demoMode);
          if (suggestions.length === 0) setDiscoveryError("AIから有効な提案を取得できませんでした。");
          setDiscoverySuggestions(suggestions);
        } catch (err) {
          setDiscoveryError(err instanceof Error ? err.message : '提案の読み込み中にエラーが発生しました。');
          setDiscoverySuggestions([]);
        } finally {
          setIsDiscoveryLoading(false);
        }
    }, [useDemoData, effectiveApiKey]);

    // When API key is set or removed, manage the demo mode state.
    const prevUserApiKeyRef = useRef(userApiKey);
    useEffect(() => {
        const prevKey = prevUserApiKeyRef.current;
        const currentKey = userApiKey;

        // Key ADDED: from null/empty to having a value
        if (!prevKey && currentKey) {
            if (useDemoData) { // only switch if it's currently in demo mode
                setUseDemoData(false);
                localStorage.setItem('useDemoData', JSON.stringify(false));
                // Force fetch with isLive=true, as state update is not immediate
                fetchDiscoverySuggestions(true);
            }
        }

        // Key REMOVED: from having a value to null/empty
        if (prevKey && !currentKey) {
            if (!useDemoData) { // only switch if it's currently in live mode
                setUseDemoData(true);
                localStorage.setItem('useDemoData', JSON.stringify(true));
                fetchDiscoverySuggestions(false); // fetch demo data
            }
        }

        prevUserApiKeyRef.current = userApiKey;
    }, [userApiKey, useDemoData, fetchDiscoverySuggestions]);

    useEffect(() => { 
        if (isApiKeyConfigured || useDemoData) {
            fetchDiscoverySuggestions(); 
        }
    // This effect should only run on initial load when dependencies are stable.
    // fetchDiscoverySuggestions changes when mode changes, so it correctly triggers a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isApiKeyConfigured, useDemoData]);

    const onToggleDemoData = useCallback(() => {
        if (!isApiKeyConfigured) {
            return;
        }
        setUseDemoData(prev => {
            const newState = !prev;
            localStorage.setItem('useDemoData', JSON.stringify(newState));
            // Trigger a refetch with the new mode
            fetchDiscoverySuggestions(!newState);
            return newState;
        });
    }, [isApiKeyConfigured, fetchDiscoverySuggestions]);
    
    const handleOpenHowItWorksModal = useCallback((tab: 'flow' | 'model' | 'api_key' = 'flow') => {
        setInitialModalTab(tab);
        setIsHowItWorksModalOpen(true);
    }, []);

    const handleCloseHowItWorksModal = useCallback(() => setIsHowItWorksModalOpen(false), []);

    return {
        useDemoData,
        isApiKeyConfigured,
        userApiKey,
        effectiveApiKey,
        isSidebarOpen,
        isHowItWorksModalOpen,
        initialModalTab,
        discoverySuggestions,
        // 使用量監視関連
        usage,
        limits,
        isLimitReached,
        resetUsage,
        isDiscoveryLoading,
        discoveryError,
        setUserApiKey,
        clearUserApiKey,
        onToggleDemoData,
        onToggleSidebar,
        handleOpenHowItWorksModal,
        handleCloseHowItWorksModal,
        fetchDiscoverySuggestions,
    };
};
