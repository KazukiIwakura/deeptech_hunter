# セキュリティ強化提案

## 現在の懸念点

### 1. APIキーの露出リスク
- **問題**: ブラウザのlocalStorageに平文でAPIキーが保存されている
- **リスク**: 開発者ツールから簡単に確認可能、XSS攻撃で盗取される可能性
- **影響**: 不正利用による高額請求、APIキーの悪用

### 2. APIキー検証の不備
- **問題**: 無効なAPIキーでも保存できる
- **リスク**: ユーザーが気づかずに無効なキーを使用し続ける可能性

### 3. レート制限・コスト管理の不備
- **問題**: APIコール数やコストの制限がない
- **リスク**: 意図しない大量リクエストによる高額請求

## 推奨改善策

### 短期対応（すぐに実装可能）

#### 1. APIキーの暗号化保存
```typescript
// utils/encryption.ts
const ENCRYPTION_KEY = 'your-app-specific-key'; // 実際は環境変数から

export const encryptApiKey = (apiKey: string): string => {
  // 簡易暗号化（本格的にはcrypto-jsなどを使用）
  return btoa(apiKey + ENCRYPTION_KEY);
};

export const decryptApiKey = (encryptedKey: string): string => {
  try {
    return atob(encryptedKey).replace(ENCRYPTION_KEY, '');
  } catch {
    return '';
  }
};
```

#### 2. APIキー検証機能
```typescript
// services/apiKeyValidator.ts
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // 軽量なAPIコールでキーの有効性を確認
    const response = await fetch('/api/validate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    return response.ok;
  } catch {
    return false;
  }
};
```

#### 3. 使用量監視とアラート
```typescript
// hooks/useApiUsageMonitor.ts
export const useApiUsageMonitor = () => {
  const [dailyUsage, setDailyUsage] = useState(0);
  const DAILY_LIMIT = 100; // 1日のリクエスト制限

  const trackApiCall = useCallback(() => {
    const today = new Date().toDateString();
    const usage = JSON.parse(localStorage.getItem(`usage_${today}`) || '0');
    const newUsage = usage + 1;
    
    if (newUsage > DAILY_LIMIT) {
      alert('1日のAPI使用制限に達しました。明日まで待つか、制限を見直してください。');
      return false;
    }
    
    localStorage.setItem(`usage_${today}`, JSON.stringify(newUsage));
    setDailyUsage(newUsage);
    return true;
  }, []);

  return { dailyUsage, trackApiCall, isLimitReached: dailyUsage >= DAILY_LIMIT };
};
```

### 中期対応（バックエンド実装が必要）

#### 1. プロキシAPI実装
```typescript
// api/proxy/gemini.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // サーバーサイドでAPIキーを管理
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // ユーザー認証とレート制限
  const userId = await authenticateUser(req);
  const canProceed = await checkRateLimit(userId);
  
  if (!canProceed) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  // Gemini APIへのプロキシ
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GEMINI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.json(data);
}
```

#### 2. ユーザー認証システム
- Firebase Auth、Auth0、またはカスタム認証の実装
- APIキーをユーザーアカウントに紐付け
- セッション管理とトークンベース認証

#### 3. 使用量ダッシュボード
- リアルタイムの使用量表示
- コスト予測とアラート
- 使用履歴とパターン分析

### 長期対応（本格運用向け）

#### 1. 企業向けAPI管理
- 組織単位でのAPIキー管理
- 部門別使用量制限
- 請求書統合

#### 2. セキュリティ監査
- 定期的なセキュリティスキャン
- 脆弱性診断
- ペネトレーションテスト

#### 3. コンプライアンス対応
- GDPR、個人情報保護法への対応
- データ保持ポリシー
- 監査ログの実装

## 実装優先度

### 🔴 高優先度（即座に対応）
1. APIキーの暗号化保存
2. 基本的な使用量制限
3. APIキー検証

### 🟡 中優先度（1-2週間以内）
1. プロキシAPI実装
2. ユーザー認証システム
3. 使用量ダッシュボード

### 🟢 低優先度（長期計画）
1. 企業向け機能
2. 高度なセキュリティ機能
3. コンプライアンス対応

## 注意事項

- **段階的実装**: 一度にすべてを変更せず、段階的に改善
- **ユーザビリティ**: セキュリティ強化がユーザー体験を損なわないよう配慮
- **テスト**: 各改善策は十分にテストしてから本番適用
- **ドキュメント**: セキュリティポリシーとベストプラクティスの文書化