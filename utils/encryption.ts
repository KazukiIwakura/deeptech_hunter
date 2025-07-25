// utils/encryption.ts
// 強固な暗号化ユーティリティ（crypto-js使用）

import CryptoJS from 'crypto-js';

// セキュアな暗号化キー生成
const getEncryptionKey = (): string => {
  // 本番環境では環境変数から取得
  if (typeof process !== 'undefined' && process.env.ENCRYPTION_KEY) {
    return process.env.ENCRYPTION_KEY;
  }
  
  // 開発環境用の警告
  console.warn('⚠️ 開発環境用の暗号化キーを使用中。本番環境では環境変数ENCRYPTION_KEYを設定してください。');
  
  // ブラウザ環境での一時的なキー生成
  let sessionKey = sessionStorage.getItem('temp_encryption_key');
  if (!sessionKey) {
    sessionKey = CryptoJS.lib.WordArray.random(256/8).toString();
    sessionStorage.setItem('temp_encryption_key', sessionKey);
  }
  return sessionKey;
};

const ENCRYPTION_KEY = getEncryptionKey();

/**
 * APIキーをAES暗号化してlocalStorageに安全に保存
 */
export const encryptApiKey = (apiKey: string): string => {
  try {
    // タイムスタンプを追加してリプレイ攻撃を防ぐ
    const dataToEncrypt = {
      apiKey,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    // AES暗号化
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt), 
      ENCRYPTION_KEY
    ).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * AES暗号化されたAPIキーを復号化
 */
export const decryptApiKey = (encryptedKey: string): string => {
  try {
    // AES復号化
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('復号化に失敗しました');
    }
    
    const data = JSON.parse(decryptedText);
    
    // データの整合性チェック
    if (!data.apiKey || !data.timestamp || !data.version) {
      throw new Error('無効なデータ形式です');
    }
    
    // タイムスタンプチェック（30日以上古い場合は無効）
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (data.timestamp < thirtyDaysAgo) {
      throw new Error('APIキーの有効期限が切れています');
    }
    
    return data.apiKey;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

/**
 * APIキーの基本的な形式チェック
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  // Gemini APIキーの基本的な形式チェック
  return /^AIza[0-9A-Za-z-_]{35}$/.test(apiKey.trim());
};/**
 
* APIキーのハッシュ値を生成（ログ記録用）
 */
export const hashApiKey = (apiKey: string): string => {
  try {
    return CryptoJS.SHA256(apiKey).toString();
  } catch (error) {
    console.error('Hashing failed:', error);
    return '';
  }
};

/**
 * セキュアな乱数生成
 */
export const generateSecureToken = (): string => {
  try {
    const randomBytes = CryptoJS.lib.WordArray.random(32);
    return randomBytes.toString();
  } catch (error) {
    console.error('Token generation failed:', error);
    return Math.random().toString(36);
  }
};

/**
 * データの整合性検証用ハッシュ生成
 */
export const generateIntegrityHash = (data: string): string => {
  try {
    return CryptoJS.HmacSHA256(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Integrity hash generation failed:', error);
    return '';
  }
};

/**
 * 古い暗号化形式からの移行サポート
 */
export const migrateOldEncryption = (oldEncryptedKey: string): string => {
  try {
    // 旧形式の復号化を試行
    const decrypted = oldEncryptedKey.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ 'deeptech-hunter-2025'.charCodeAt(i % 'deeptech-hunter-2025'.length))
    ).join('');
    
    const decoded = atob(decrypted);
    const [apiKey] = decoded.split('|');
    
    if (apiKey && validateApiKeyFormat(apiKey)) {
      // 新形式で再暗号化
      return encryptApiKey(apiKey);
    }
    
    return '';
  } catch (error) {
    console.error('Migration failed:', error);
    return '';
  }
};