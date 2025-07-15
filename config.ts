// config.ts

/**
 * 体験モードを使用するかのデフォルト値。
 * この設定はUIから動的に上書き可能です。
 * true: `services/mockData.ts`のローカルデータを使用します (APIコールなし)。
 * false: 実際のGemini APIに接続します (APIキーが必要)。
 */
export const USE_DEMO_DATA = true;