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
| ランタイム | 開発 = **Bun** / 本番 = **workerd**(Cloudflare Workers) | Node 非依存 |
| ツールチェーン | **Vite+**(`vp` CLI) | ビルド・テスト・リントを統合した Vite ベースのツールチェーン |
| フレームワーク | **TanStack Start** | SSR + ファイルベースルーティング(website Worker) |
| バリデーション | **Valibot** | MCP SDK v2 の Standard Schema 対応で公式サポート。`drizzle-valibot` で DB スキーマと共有 |
| DB / ORM | **Drizzle ORM + Turso**(libSQL) | 更新頻度の高いコンテンツの置き場(下記) |
| コンテンツ更新 | **自作 MCP サーバー**(`@modelcontextprotocol/server`) | LLM を介してプレイリスト等を更新。詳細は `docs/content-plan.md` |
| 認証 | **Better Auth**(passkey + MCP プラグイン) | パスキーのみ。パスワードも外部 IdP も持たない |
| ホスティング | **Cloudflare Workers(website / mcp の 2 Worker)** | **shio.studio** = サイト、**mcp.shio.studio** = MCP+認可(Cloudflare 管理)。Bun workspaces のモノレポ(`apps/website`, `apps/mcp`, `packages/db`) |

## 参照

- ムードボード: [Figma](https://www.figma.com/design/sdp2RPY3x1ysSxQd6LtWra?node-id=158-17)(「ムードボード」セクション、image 1〜30)
