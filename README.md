# shio — Portfolio Site

Haruto Shiohata / 塩畑 晴人 / shio🧂 のポートフォリオサイト。

エンジニア兼デザイナーとして、仕事の実績だけでなく「自分はこういう人間です」を伝えるためのサイト。

> **Status: 設計フェーズ**(実装未着手)。現時点ではドキュメントのみ。

## ドキュメント

- [`docs/design-direction.md`](docs/design-direction.md) — デザインディレクション。Pinterest発のムードボード(Figma)30枚の分析から抽出したコンセプトキーワード・カラーパレット・モチーフ・演出方針
- [`docs/content-plan.md`](docs/content-plan.md) — サイト構成と載せるコンテンツの整理。頻繁に更新するコンテンツ(プレイリスト・メイク)の管理方法を含む

## 技術方針

| 項目 | 選定 | 備考 |
|---|---|---|
| ランタイム | **Bun** | Node 非依存で統一する |
| ツールチェーン | **Vite+**(`vp` CLI) | ビルド・テスト・リントを統合した Vite ベースのツールチェーン |
| フレームワーク | **TanStack Start** | SSR + ファイルベースルーティング |
| サーバー | Elysia.js | 必要になったら導入(Bun ネイティブ) |
| DB / ORM | Drizzle ORM + SQLite(libSQL/Turso 想定) | 更新頻度の高いコンテンツの置き場(下記) |
| コンテンツ更新 | **自作 MCP サーバー** | LLM を介してプレイリスト等を更新。詳細は `docs/content-plan.md` |
| 認証 | **Better Auth**(passkey + MCP プラグイン) | パスキーのみ。パスワードも外部 IdP も持たない |

## 参照

- ムードボード: [Figma](https://www.figma.com/design/sdp2RPY3x1ysSxQd6LtWra?node-id=158-17)(「ムードボード」セクション、image 1〜30)
