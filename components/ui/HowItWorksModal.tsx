
import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { XCircleIcon } from '../icons/XCircleIcon';
import { UserIcon } from '../icons/UserIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { LightbulbIcon } from '../icons/LightbulbIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { MicroscopeIcon } from '../icons/MicroscopeIcon';
import { BrainIcon } from '../icons/BrainIcon';
import { ChatIcon } from '../icons/ChatIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { CodeIcon } from '../icons/CodeIcon';
import { TerminalIcon } from '../icons/TerminalIcon';
import { CpuChipIcon } from '../icons/CpuChipIcon';
import { HelpCircleIcon } from '../icons/HelpCircleIcon';

import { ZoomInIcon } from '../icons/ZoomInIcon';
import { BalanceIcon } from '../icons/BalanceIcon';
import { KeyIcon } from '../icons/KeyIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { Button } from '../common/Button';
import {
  getHuntSystemInstruction,
  getTechExplanationSystemInstruction,
  getOverseasStartupsSystemInstruction,
  getDeepDiveSystemInstruction,
  getChatSystemInstruction,
} from '../../services/prompts';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

type ModalTab = 'flow' | 'model' | 'api_key';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ModalTab;
}

interface DetailInfo {
  api: string;
  prompt: string;
  output: string;
}

interface FlowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isAi?: boolean;
  details?: DetailInfo;
  children?: React.ReactNode;
}

const TechnicalDetails: React.FC<{ details: DetailInfo }> = ({ details }) => (
    <div className="mt-4 ml-8 pl-6 border-l-2 border-dashed border-primary-light py-3 space-y-4 animate-fade-in">
        <div className="bg-neutral-100 p-3 rounded-lg">
            <h5 className={cn('text-base leading-snug font-bold text-main', "flex items-center text-main mb-1")}>
                <CpuChipIcon className="w-4 h-4 mr-2 text-primary"/>API機能
            </h5>
            <p className={cn('text-sm text-main-light leading-normal', "text-main-light font-mono")}>{details.api}</p>
        </div>
        <div className="bg-neutral-100 p-3 rounded-lg">
            <h5 className={cn('text-base leading-snug font-bold text-main', "flex items-center text-main mb-2")}>
                <TerminalIcon className="w-4 h-4 mr-2 text-primary"/>使用プロンプト (システム命令)
            </h5>
            <pre className={cn('text-sm text-main-light leading-normal', "text-main-light whitespace-pre-wrap font-sans bg-white p-2 rounded-md border border-neutral-200 mt-1 overflow-auto max-h-48")}>
              <code>{details.prompt.trim()}</code>
            </pre>
        </div>
        <div className="bg-neutral-100 p-3 rounded-lg">
            <h5 className={cn('text-base leading-snug font-bold text-main', "flex items-center text-main mb-1")}>
                <CodeIcon className="w-4 h-4 mr-2 text-primary"/>期待する出力形式
            </h5>
            <pre className={cn('text-sm text-main-light leading-normal', "text-white bg-main p-2 rounded mt-1 overflow-x-auto")}>
              <code>{details.output.trim()}</code>
            </pre>
        </div>
    </div>
);


const FlowStep: React.FC<FlowStepProps> = ({ icon, title, description, isAi, details, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("p-4 rounded-2xl", isAi ? 'bg-primary-lighter/80 border border-primary-light/80' : 'bg-neutral-50/80 border border-neutral-200/80')}>
            <div className="flex items-start space-x-4">
                <div className={cn("flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg", isAi ? 'bg-primary-light text-primary' : 'bg-neutral-200 text-main-light')}>
                    {icon}
                </div>
                <div className="flex-grow pt-1">
                    <h4 className={cn('text-base leading-snug font-bold text-main', "text-main")}>{title}</h4>
                    <p className={cn('text-sm text-main-light leading-normal', "text-main-light mt-0.5")}>{description}</p>
                </div>
                {details && (
                    <Button
                        onClick={() => setIsOpen(!isOpen)}
                        variant="ghost"
                        size="small"
                        className="flex-shrink-0 font-bold text-primary hover:text-primary-hover p-1 mt-1 ml-1"
                        aria-expanded={isOpen}
                    >
                        詳細
                        <ChevronDownIcon className={cn("w-4 h-4 ml-1 transition-transform duration-200", isOpen && 'rotate-180')} />
                    </Button>
                )}
            </div>
            {children}
            {isOpen && details && <TechnicalDetails details={details} />}
        </div>
    );
};


const Arrow: React.FC = () => (
    <div className="h-10 flex items-center justify-center">
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-4-4l4 4 4-4" />
        </svg>
    </div>
);

const SubStep: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md bg-primary-light/80 text-primary mt-0.5">
            {icon}
        </div>
        <div>
            <h5 className={cn('text-base leading-snug font-bold text-main', "text-main")}>{title}</h5>
            <p className={cn('text-sm text-main-light leading-normal', "text-main-light")}>{description}</p>
        </div>
    </div>
);

const ApiKeyManager: React.FC = () => {
    const { appShell } = useApp();
    const { userApiKey, setUserApiKey, clearUserApiKey } = appShell;
    const [localKey, setLocalKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        if (localKey.trim()) {
            const success = setUserApiKey(localKey.trim());
            if (success) {
                setLocalKey('');
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        }
    };
    
    const handleDelete = () => {
        clearUserApiKey();
    };

    const maskedKey = userApiKey ? `${userApiKey.slice(0, 4)}...${userApiKey.slice(-4)}` : '';

    const StatusDisplay: React.FC = () => {
        if (userApiKey) {
            return (
                <div className="flex items-center gap-2 p-3 bg-success-light border border-success-border rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-success-text" />
                    <span className="text-sm font-semibold text-success-text-dark">APIキーはブラウザに保存済みです: <code className="font-mono bg-success-light-hover px-1 py-0.5 rounded">{maskedKey}</code></span>
                </div>
            )
        }
        return (
             <div className="flex items-center gap-2 p-3 bg-neutral-100 border border-neutral-200 rounded-lg">
                <HelpCircleIcon className="w-5 h-5 text-main-light" />
                <span className="text-sm font-semibold text-main">APIキーが設定されていません。</span>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <h3 className={cn('text-[22px] leading-snug font-bold text-main', "text-main flex items-center")}>
                <KeyIcon className="w-6 h-6 mr-3 text-primary" />
                APIキーの設定
            </h3>

            <StatusDisplay />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="api-key-input" className="font-bold text-main-light text-sm">Google Gemini APIキー</label>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>AES暗号化保護</span>
                    </div>
                </div>
                <div className="relative">
                     <input
                        id="api-key-input"
                        type={showKey ? 'text' : 'password'}
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder={userApiKey ? '新しいキーを入力して上書き' : 'AIza で始まる39文字のキーを入力'}
                        className="w-full pl-3 pr-10 py-2 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-main placeholder:text-neutral-500 bg-neutral-50 focus:bg-white transition-colors duration-200"
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-500 hover:text-main"
                        aria-label={showKey ? "APIキーを隠す" : "APIキーを表示する"}
                    >
                        {showKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSave}
                        disabled={!localKey.trim()}
                        variant="primary"
                        size="small"
                        className="flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        暗号化して保存
                    </Button>
                    {userApiKey && (
                        <Button onClick={handleDelete} variant="secondary" size="small">
                            保存したキーを削除
                        </Button>
                    )}
                     {showSuccess && <span className="text-success-text font-semibold animate-fade-in text-sm">保存しました！</span>}
                </div>
            </div>
             {/* リアルタイム使用量表示 */}
            {userApiKey && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="text-indigo-800 mb-3 flex items-center font-bold text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        リアルタイム使用状況
                    </h4>
                    <div className="space-y-3">
                        {/* 今日の使用量 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-indigo-700">今日の使用量</span>
                                <span className="font-mono text-indigo-800">{appShell.usage.dailyUsage}/{appShell.limits.daily}</span>
                            </div>
                            <div className="w-full bg-indigo-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        appShell.usage.dailyUsage / appShell.limits.daily > 0.8 
                                            ? 'bg-red-500' 
                                            : appShell.usage.dailyUsage / appShell.limits.daily > 0.6 
                                                ? 'bg-yellow-500' 
                                                : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min((appShell.usage.dailyUsage / appShell.limits.daily) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* 今週の使用量 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-indigo-700">今週の使用量</span>
                                <span className="font-mono text-indigo-800">{appShell.usage.weeklyUsage}/{appShell.limits.weekly}</span>
                            </div>
                            <div className="w-full bg-indigo-200 rounded-full h-1.5">
                                <div 
                                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((appShell.usage.weeklyUsage / appShell.limits.weekly) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* 今月の使用量 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-indigo-700">今月の使用量</span>
                                <span className="font-mono text-indigo-800">{appShell.usage.monthlyUsage}/{appShell.limits.monthly}</span>
                            </div>
                            <div className="w-full bg-indigo-200 rounded-full h-1.5">
                                <div 
                                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((appShell.usage.monthlyUsage / appShell.limits.monthly) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* 制限到達時の警告 */}
                        {appShell.isLimitReached && (
                            <div className="bg-red-100 border border-red-300 rounded-lg p-2 mt-3">
                                <div className="flex items-center text-red-700 text-xs">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold">使用制限に達しています</span>
                                </div>
                                <p className="text-xs text-red-600 mt-1 ml-6">
                                    制限は自動的にリセットされます。緊急時やテスト用に手動リセットも可能です。
                                </p>
                            </div>
                        )}

                        {/* 使用量80%警告 */}
                        {!appShell.isLimitReached && appShell.usage.dailyUsage / appShell.limits.daily > 0.8 && (
                            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 mt-3">
                                <div className="flex items-center text-yellow-700 text-xs">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold">使用量が80%に達しました</span>
                                </div>
                                <p className="text-xs text-yellow-600 mt-1 ml-6">
                                    残り使用量にご注意ください。
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-indigo-200">
                            <span className="text-xs text-indigo-600">
                                制限は毎日午前0時に自動リセット
                            </span>
                            <button 
                                onClick={appShell.resetUsage}
                                className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                                title="緊急時やテスト用に手動でリセット可能です"
                            >
                                手動リセット
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* セキュリティ機能の説明 */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-green-800 mb-2 flex items-center font-bold text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    セキュリティ機能
                </h4>
                <div className="space-y-2 text-xs text-green-700 pl-6">
                    <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>AES暗号化保存</strong>: APIキーは軍事レベルの暗号化で保護されます</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>使用量制限</strong>: 意図しない大量利用を防ぐ自動制限機能</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>形式検証</strong>: 無効なAPIキーの保存を事前に防止</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span><strong>自動期限管理</strong>: 30日以上古いキーは自動的に無効化</span>
                    </div>
                </div>
            </div>

            {/* 使用量制限の詳細説明 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-blue-800 mb-2 flex items-center font-bold text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    使用制限について
                </h4>
                <div className="space-y-3 text-xs text-blue-700 pl-6">
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>1日の制限:</span>
                            <span className="font-mono">{appShell.limits.daily}回</span>
                        </div>
                        <div className="flex justify-between">
                            <span>1週間の制限:</span>
                            <span className="font-mono">{appShell.limits.weekly}回</span>
                        </div>
                        <div className="flex justify-between">
                            <span>1ヶ月の制限:</span>
                            <span className="font-mono">{appShell.limits.monthly}回</span>
                        </div>
                    </div>
                    
                    <div className="bg-blue-100 p-2 rounded text-blue-800">
                        <p className="font-semibold mb-1">なぜ制限があるの？</p>
                        <ul className="space-y-0.5 text-xs">
                            <li>• <strong>コスト管理</strong>: AIの計算処理は高額なため</li>
                            <li>• <strong>予期しない請求防止</strong>: 意図しない大量利用を防ぐ</li>
                            <li>• <strong>システム安定性</strong>: 全ユーザーの快適な利用を保証</li>
                            <li>• <strong>公平性</strong>: リソースの独占を防ぐ</li>
                        </ul>
                    </div>
                    
                    <div className="bg-green-100 p-2 rounded text-green-800">
                        <p className="font-semibold mb-1">手動リセットが可能な理由</p>
                        <ul className="space-y-0.5 text-xs">
                            <li>• <strong>緊急時対応</strong>: 重要な調査が必要な場合</li>
                            <li>• <strong>テスト・開発用</strong>: 機能確認のため</li>
                            <li>• <strong>ユーザー判断</strong>: コストを理解した上での利用</li>
                        </ul>
                        <p className="text-xs mt-1 italic">※ 手動リセット後も制限は再度適用されます</p>
                    </div>
                </div>
            </div>

            {/* 重要な注意事項 */}
            <div className="bg-warning-light p-4 rounded-lg border border-amber-200 text-warning-text">
                <h4 className={cn('text-base leading-snug font-bold text-main', "text-warning-text mb-1 flex items-center font-bold")}>
                    <HelpCircleIcon className="w-5 h-5 mr-2" />
                    重要な注意事項
                </h4>
                <div className="space-y-2 text-sm text-warning-text leading-relaxed pl-7">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠️</span>
                        <span>APIキーは暗号化されてブラウザに保存され、外部サーバーには送信されません</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠️</span>
                        <span>共有PCや他人がアクセス可能な環境では設定しないでください</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠️</span>
                        <span>APIキーは <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-amber-700">Google AI Studio</a> から取得できます</span>
                    </div>
                </div>
            </div>

            {/* 今後の改善予定 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-gray-800 mb-2 flex items-center font-bold text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    今後の改善予定
                </h4>
                <div className="space-y-1 text-xs text-gray-600 pl-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">🔄</span>
                        <span>サーバーサイドでのAPIキー管理（完全なセキュリティ）</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">👤</span>
                        <span>ユーザーアカウント機能とティア別制限</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">📊</span>
                        <span>詳細な使用量分析とコスト予測</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, initialTab = 'flow' }) => {
  const [selectedTab, setSelectedTab] = useState<ModalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setSelectedTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn('bg-white rounded-4xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col', "animate-fade-in")}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className={cn('text-[22px] leading-snug font-bold text-main', "text-main flex items-center")}>
            <SparklesIcon className="w-6 h-6 mr-3 text-primary" />
            このAIの仕組み
          </h2>
          <Button onClick={onClose} variant="ghost" size="medium" isIconOnly aria-label="閉じる">
            <XCircleIcon className="w-6 h-6" />
          </Button>
        </header>

        <div className="border-b border-neutral-200 px-4">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <button
              className={cn(
                'px-1 py-3 border-b-2 whitespace-nowrap',
                'text-sm text-main-light leading-normal', 'font-bold',
                selectedTab === 'flow'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-main-lighter hover:text-main hover:border-neutral-300'
              )}
              onClick={() => setSelectedTab('flow')}
            >
              主な処理フロー
            </button>
            <button
              className={cn(
                'px-1 py-3 border-b-2 whitespace-nowrap',
                'text-sm text-main-light leading-normal', 'font-bold',
                selectedTab === 'model'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-main-lighter hover:text-main hover:border-neutral-300'
              )}
              onClick={() => setSelectedTab('model')}
            >
              思考モデルについて
            </button>
            <button
              className={cn(
                'px-1 py-3 border-b-2 whitespace-nowrap',
                'text-sm text-main-light leading-normal', 'font-bold',
                selectedTab === 'api_key'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-main-lighter hover:text-main hover:border-neutral-300'
              )}
              onClick={() => setSelectedTab('api_key')}
            >
              APIキー設定
            </button>
          </nav>
        </div>

        <main className="flex-1 overflow-y-auto">
          {selectedTab === 'flow' && (
            <div className="p-6 md:p-8 space-y-5">
              <FlowStep
                icon={<UserIcon className="w-6 h-6" />}
                title="1. ユーザーによるキーワード入力"
                description="ユーザーは探したい技術のキーワード（例：全固体電池）を入力するか、AIが提案したトレンド分野から選択します。"
              />
              <Arrow />
              <FlowStep
                icon={<BrainIcon className="w-6 h-6" />}
                title="2. 3つのAIによる並列調査実行"
                description="キーワードに基づき、3つの専門AIエージェントが同時に調査を開始します。それぞれがGoogle検索ツールなどを駆使して情報を収集・分析します。"
                isAi
              >
                  <div className="mt-4 ml-8 pl-6 border-l-2 border-dashed border-primary-light py-3 space-y-4">
                      <FlowStep
                          icon={<LightbulbIcon className="w-5 h-5" />}
                          title="解説AI"
                          description="技術の概要を分かりやすく解説します。"
                          isAi
                          details={{ api: 'ai.models.generateContent', prompt: getTechExplanationSystemInstruction(), output: 'JSON Object' }}
                      />
                      <FlowStep
                          icon={<SparklesIcon className="w-5 h-5" />}
                          title="国内探索AI"
                          description="日本の大学から技術シーズを発掘します。"
                          isAi
                          details={{ api: 'ai.models.generateContent', prompt: getHuntSystemInstruction(), output: 'JSON in Markdown' }}
                      >
                        <div className="mt-4 ml-8 pl-6 border-l-2 border-dashed border-primary-light py-3 space-y-4">
                          <SubStep icon={<BrainIcon className="w-4 h-4" />} title="1. キーワード再定義" description="ユーザー入力を専門用語に変換し、調査の精度を高めます。" />
                          <SubStep icon={<ZoomInIcon className="w-4 h-4" />} title="2. 体系的な情報収集" description="大学DBや公的機関を優先的にGoogle検索で調査します。" />
                          <SubStep icon={<BalanceIcon className="w-4 h-4" />} title="3. VC的評価と選別" description="インパクト・市場リスク・技術リスクの3軸で評価します。" />
                          <SubStep icon={<CodeIcon className="w-4 h-4" />} title="4. 構造化レポート生成" description="評価の高い技術シーズをJSON形式で出力します。" />
                        </div>
                      </FlowStep>
                      <FlowStep
                          icon={<BriefcaseIcon className="w-5 h-5" />}
                          title="海外調査AI"
                          description="海外注目スタートアップを調査します。"
                          isAi
                          details={{ api: 'ai.models.generateContent', prompt: getOverseasStartupsSystemInstruction(), output: 'JSON in Markdown' }}
                      />
                  </div>
              </FlowStep>
              <Arrow />
              <FlowStep
                icon={<MicroscopeIcon className="w-6 h-6" />}
                title="3. 詳細分析 (Deep Dive)"
                description="ユーザーが特定の技術を選択すると、VC（ベンチャーキャピタリスト）の視点で詳細なビジネス評価レポートを生成します。"
                isAi
                details={{
                    api: 'ai.models.generateContentStream',
                    prompt: getDeepDiveSystemInstruction(),
                    output: 'JSON Object Stream',
                }}
              />
              <Arrow />
               <FlowStep
                icon={<ChatIcon className="w-6 h-6" />}
                title="4. 対話による深掘り"
                description="生成されたレポートを元に、ユーザーはAIと対話を開始。AIは鋭い質問を提案し、さらなる分析や議論をサポートします。"
                isAi
                 details={{
                    api: 'ai.chats.create / chat.sendMessageStream',
                    prompt: getChatSystemInstruction(),
                    output: 'テキストストリーム',
                }}
              />
            </div>
          )}
          {selectedTab === 'model' && (
             <div className="p-6 md:p-8 text-main-light animate-fade-in space-y-6">
                <h3 className={cn('text-[22px] leading-snug font-bold text-main', "text-main flex items-center")}><BrainIcon className="w-6 h-6 mr-3 text-primary" />このAIの思考モデル: ReAct</h3>
                <p className="text-base text-main-light/90 leading-relaxed">
                  このアプリケーションの中核をなすAIは、単に質問に答えるだけではありません。それは、<strong>ReAct (Reasoning and Acting)</strong> という高度な思考フレームワークに基づいて動作しています。これは、AIが人間のように「思考」と「行動」を繰り返すことで、複雑なタスクを解決するアプローチです。
                </p>
                <div className="bg-neutral-100 p-4 rounded-lg border border-neutral-200">
                    <h4 className={cn('text-base leading-snug font-bold text-main', "text-main mb-2")}>ReActのサイクル</h4>
                    <ol className={cn('text-sm text-main-light leading-normal', "list-decimal list-inside space-y-2")}>
                        <li><strong>Reason (思考):</strong> 次に何をすべきか、どのような情報が必要かを計画します。例えば、「国内の技術を調べる」「海外の先行事例を探す」といった戦略を立てます。</li>
                        <li><strong>Act (行動):</strong> 立てた計画を実行するために、<strong>ツール</strong>を使用します。このアプリでは、主に「Google検索」がそのツールにあたります。</li>
                        <li><strong>Observation (観察):</strong> ツールの実行結果（検索結果など）を取得し、分析します。</li>
                        <li>このサイクルを繰り返し、最終的な結論やレポートを生成します。</li>
                    </ol>
                </div>
                <p className="text-base text-main-light/90 leading-relaxed">
                  このReActモデルにより、AIはまるで優秀なリサーチアナリストのチームのように、自律的に計画を立て、情報を収集・分析し、ユーザーに価値ある洞察を提供することができるのです。
                </p>

                <h3 className={cn('text-[22px] leading-snug font-bold text-main', "text-main flex items-center pt-4 border-t border-neutral-200 mt-8")}><HelpCircleIcon className="w-6 h-6 mr-3 text-primary" />Perplexityなどの検索AIとの違い</h3>
                <p className="text-base text-main-light/90 leading-relaxed">
                  Perplexityのような対話型検索エンジンも非常に強力ですが、このアプリケーションは少し異なるアプローチを取っています。
                </p>
                <p className="text-base text-main-light/90 leading-relaxed">
                  多くの検索AIが「ユーザーの質問に対してウェブを検索して要約する」という単一のタスクに特化しているのに対し、ディープテックハンターのAIは、<strong>複数の異なるタスクを組み合わせた、より大きなワークフロー</strong>を実行します。
                </p>
                <ul className={cn('text-sm text-main-light leading-normal', "list-disc list-inside space-y-2 pl-2")}>
                  <li><strong>並列タスク実行:</strong> 「国内技術の探索」「海外スタートアップ調査」「技術用語の解説」といった複数の調査を同時に並行して実行し、時間を節約します。</li>
                  <li><strong>ネイティブなツール連携:</strong> 外部の検索サービスを呼び出すのではなく、Geminiに組み込まれたGoogle検索ツールを直接、自律的に使用します。これにより、AIの「思考」と「情報収集」がシームレスに連携し、より文脈に沿った質の高いアウトプットが期待できます。</li>
                  <li><strong>目的特化:</strong> 全てのプロセスは「ディープテックを発掘・評価する」という明確な目的に特化して設計されています。</li>
                </ul>
                <p className={cn('text-base text-main-light/90 leading-relaxed', "mt-4")}>
                  つまり、単なる「検索して答える」AIではなく、<strong>「特定の目的を達成するために、自ら計画し、ツールを使いこなす専門家AI」</strong>であることが、このアプリケーションの最大の特徴です。
                </p>
              </div>
          )}
          {selectedTab === 'api_key' && (
            <div className="p-6 md:p-8 text-main-light animate-fade-in space-y-6">
              <ApiKeyManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
