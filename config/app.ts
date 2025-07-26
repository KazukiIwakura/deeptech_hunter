/**
 * アプリケーション設定
 * 環境変数や基本設定を管理
 */

/**
 * 体験モードを使用するかのデフォルト値。
 * この設定はUIから動的に上書き可能です。
 * true: `services/mockData.ts`のローカルデータを使用します (APIコールなし)。
 * false: 実際のGemini APIに接続します (APIキーが必要)。
 */
export const USE_DEMO_DATA = true;

/**
 * AIの最終出力言語設定
 * 'ja': 日本語で出力
 * 'en': 英語で出力
 */
export const OUTPUT_LANGUAGE = 'ja' as const;

/**
 * API使用量制限設定
 */
export const API_LIMITS = {
  DAILY_LIMIT: 100,
  MONTHLY_LIMIT: 1000,
} as const;

/**
 * アプリケーション情報
 */
export const APP_INFO = {
  NAME: 'Deep Tech Hunter',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered research platform for Japanese deep tech discovery',
} as const;