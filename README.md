# shio — Portfolio Site

Haruto Shiohata / 塩畑 晴人 / shio🧂 のポートフォリオサイト。

エンジニア兼デザイナーとして、仕事の実績だけでなく「自分はこういう人間です」を伝えるためのサイト。

> **Status: 実装フェーズ**。モノレポのスキャフォールド済み(`apps/website` はビルド可能、`apps/mcp` はスケルトン)。

## セットアップ

```bash
bun install     # 依存のインストール(Bun 1.3.14 — .bun-version 参照)
bun run dev     # website の開発サーバー(localhost:3000)
bun run build   # website のプロダクションビルド
```

## ドキュメント

- [`docs/design-direction.md`](docs/design-direction.md) — デザインディレクション。Pinterest発のムードボード(Figma)30枚の分析から抽出したコンセプトキーワード・カラーパレット・モチーフ・演出方針
- [`docs/content-plan.md`](docs/content-plan.md) — サイト構成と載せるコンテンツの整理(名前表記・Works・About素材・更新頻度の高いコンテンツの要件)
- [`docs/architecture.md`](docs/architecture.md) — 技術構成の決定事項と根拠(2 Worker構成・MCP・認証・DB・キャッシュ)
- [`docs/design-research.md`](docs/design-research.md) — 類似コンセプトのサイト調査レポート。参考サイトカタログと差別化ポイントの分析

## 技術方針

| 項目 | 選定 | 備考 |
|---|---|---|
| ランタイム | 開発 = **Bun** / 本番 = **workerd**(Cloudflare Workers) | Node 非依存 |
| ツールチェーン | **Vite+**(`vp` CLI) | ビルド・テスト・リントを統合した Vite ベースのツールチェーン |
| フレームワーク | **TanStack Start** | SSR + ファイルベースルーティング(website Worker) |
| スタイリング | **Tailwind CSS** + **Motion** | 21st.dev 等の shadcn 形式レジストリと互換にするため。詳細は `docs/design-direction.md` の制作フロー |
| バリデーション | **Valibot** | MCP SDK v2 の Standard Schema 対応で公式サポート。`drizzle-valibot` で DB スキーマと共有 |
| DB / ORM | **Drizzle ORM + Turso**(libSQL) | 更新頻度の高いコンテンツの置き場。詳細は `docs/architecture.md` |
| コンテンツ更新 | **自作 MCP サーバー**(`@modelcontextprotocol/server`) | LLM を介してプレイリスト等を更新。詳細は `docs/architecture.md` |
| 認証 | **Better Auth**(passkey + MCP プラグイン) | パスキーのみ。パスワードも外部 IdP も持たない |
| ホスティング | **Cloudflare Workers(website / mcp の 2 Worker)** | **shio.studio** = サイト、**mcp.shio.studio** = MCP+認可(Cloudflare 管理)。Bun workspaces のモノレポ(`apps/website`, `apps/mcp`, `packages/db`) |

## 参照

- ムードボード: [Figma](https://www.figma.com/design/sdp2RPY3x1ysSxQd6LtWra?node-id=158-17)(「ムードボード」セクション、image 1〜30)
- デザインモック: [Figma「🛸 Website Mock」ページ](https://www.figma.com/design/sdp2RPY3x1ysSxQd6LtWra?node-id=226-3)(トップページ全6セクション)
