# Deep Tech Hunter 🔬

日本の大学・研究機関の最先端ディープテクノロジーを発見・分析するAI搭載リサーチプラットフォーム

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 🌟 主な機能

- **🔍 発見**: 投資ポテンシャルの高い新興ディープテック分野をAIが提案
- **📊 研究**: 日本の大学研究プロジェクトの自動検索・分析
- **🎯 詳細分析**: 潜在的インパクト、市場リスク、技術リスクを総合評価するVC式スコアリング
- **🌐 グローバル比較**: 類似技術分野の海外スタートアップとの比較分析
- **💬 対話型チャット**: 投資機会をより深く探求するAI搭載ディスカッション機能

## 🎯 対象ユーザー

- ベンチャーキャピタリスト・投資専門家
- テクノロジースカウト・イノベーション担当者
- ディープテック分野の研究者・アナリスト

## 🚀 クイックスタート

### 必要な環境

- **Node.js** (v18以上)
- **Google Gemini APIキー** ([こちらから取得](https://makersuite.google.com/app/apikey))

### 🔒 APIキーのセキュリティについて

**ご安心ください！あなたのAPIキーは完全に安全です：**

- ✅ **ローカル実行**: アプリケーションは完全にあなたのPC上で動作し、APIキーは外部サーバーに送信されません
- ✅ **直接通信**: Google Gemini APIとの通信は、あなたのブラウザから直接行われます
- ✅ **データ保存なし**: APIキーやリクエスト内容は一切保存・記録されません
- ✅ **オープンソース**: 全てのコードが公開されており、セキュリティを確認できます
- ✅ **Git除外設定**: `.env.local`ファイルは`.gitignore`で除外され、誤ってコミットされることはありません

### インストール手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/your-username/deep-tech-hunter.git
   cd deep-tech-hunter
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **環境変数を設定**
   ```bash
   cp .env.local.example .env.local
   ```
   
   `.env.local`ファイルを編集してGemini APIキーを追加：
   ```env
   GEMINI_API_KEY=あなたのgemini_api_keyをここに入力
   ```
   
   > 💡 **重要**: `.env.local`ファイルはGitで管理されず、あなたのPC内にのみ保存されます

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

5. **ブラウザでアクセス**
   
   `http://localhost:5173` にアクセスして探索を開始！

## 🛠️ 技術スタック

- **フロントエンド**: React 19.1.0 + TypeScript
- **ビルドシステム**: Vite 6.2.0
- **AI統合**: Google Gemini AI (@google/genai)
- **バリデーション**: Zod（スキーマ検証）
- **スタイリング**: Tailwind CSS

## 📁 プロジェクト構成

```
├── components/          # 再利用可能なUIコンポーネント
│   ├── chat/           # チャットインターフェース
│   ├── common/         # 共通コンポーネント（Button、Cardなど）
│   ├── deepdive/       # 詳細分析コンポーネント
│   ├── search/         # 検索・結果表示コンポーネント
│   └── ui/             # UI専用コンポーネント
├── pages/              # トップレベルページコンポーネント
├── contexts/           # React Contextプロバイダー
├── hooks/              # カスタムReactフック
├── services/           # 外部API統合
│   └── gemini/         # Gemini AIサービスモジュール
├── types/              # TypeScript型定義
└── utils/              # ユーティリティ関数
```

## 🔧 利用可能なスクリプト

```bash
npm run dev          # 開発サーバーを起動
npm run build        # 本番用ビルド
npm run preview      # 本番ビルドをプレビュー
npm run lint         # ESLintを実行
npm run type-check   # TypeScript型チェックを実行
```

## 🎮 デモモード

**APIキーなしでも試せます！** モックデータを使ったデモモードが利用可能：

1. `config.ts`で`USE_DEMO_DATA: true`に設定
2. 開発サーバーを再起動
3. サンプルデータでインターフェースを探索

> 💡 APIキーの取得前に、まずデモモードで機能を確認することをお勧めします

## 🔐 プライバシー・セキュリティ

### データの取り扱い

- **個人情報**: 一切収集・保存しません
- **検索履歴**: ローカルブラウザのみに保存され、外部送信されません
- **API通信**: あなたのブラウザ ↔ Google Gemini API の直接通信のみ
- **ログ**: サーバーログやアクセスログは存在しません（ローカル実行のため）

### APIキーの安全な管理

```bash
# ✅ 正しい設定場所
.env.local              # ローカル環境変数（Git除外済み）

# ❌ 絶対に避けるべき場所
src/config.ts           # ソースコードに直接記述
README.md               # ドキュメントに記述
.env                    # 通常の環境変数ファイル
```

### セキュリティ機能

- **自動Git除外**: `.gitignore`で`.env.local`を除外設定済み
- **型安全性**: TypeScriptによる実行時エラー防止
- **依存関係監査**: 定期的なセキュリティ脆弱性チェック
- **オープンソース**: 全コードが検証可能

詳細は[セキュリティポリシー](SECURITY.md)をご覧ください。

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は[コントリビューションガイドライン](CONTRIBUTING.md)をご覧ください。

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/素晴らしい機能`)
3. 変更をコミット (`git commit -m '素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/素晴らしい機能`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 🙏 謝辞

- [Google Gemini AI](https://ai.google.dev/)で構築
- [React](https://reactjs.org/)と[Vite](https://vitejs.dev/)で動作
- アイコンは[Lucide React](https://lucide.dev/)を使用

## 📞 サポート

ご質問やサポートが必要な場合：

- 📧 [Issue](https://github.com/your-username/deep-tech-hunter/issues)を作成
- 💬 [Discussion](https://github.com/your-username/deep-tech-hunter/discussions)を開始
- 📖 [ドキュメント](docs/)をチェック

---

**ディープテック投資コミュニティのために ❤️ で作成**
