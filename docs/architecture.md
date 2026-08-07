# アーキテクチャ

技術構成の決定事項と根拠。載せるコンテンツの話は [`content-plan.md`](content-plan.md) を参照。

ドメインは **shio.studio**(Cloudflare で管理済み。Workers のルーティングも DNS も同一プラットフォームで完結)。

## 全体構成

```
[訪問者]                        [Cursor / Claude などの MCP クライアント]
    │                                │ OAuth 2.1 + PKCE(パスキーでログイン)
    ▼                                ▼
[website Worker]                [mcp Worker]
 shio.studio                     mcp.shio.studio
 TanStack Start SSR               ├ /mcp     MCP サーバー(@modelcontextprotocol/server)
    │                             └ /auth/*  認可サーバー(Better Auth: passkey + MCP プラグイン)
    │ 読み取り                        │ 書き込み(型付きツール)
    ▼                                ▼
[Turso (libSQL)]  ←── Drizzle + @libsql/client/web(packages/db を共有)
```

## コンテンツ更新: DB + 自作 MCP サーバー

更新頻度の高いコンテンツ(プレイリスト・メイク手順)の要件「commit しない・管理画面を作らない・インターフェースは LLM」を満たす方式。

- **データは DB に置く**。サイトはリクエスト時に読むので、コミットもビルドも不要で即反映
- **MCP サーバーが唯一の書き込み口**。ツール定義の入力スキーマ(Valibot)と Drizzle スキーマを共有すれば、LLM がどんな雑な指示を受けてもデータの形は崩れない
- Drizzle を最初から入れる理由がこれ

### なぜ MCP か(検討した代替案)

| 案 | 評価 |
| --- | --- |
| **自作 MCP サーバー(採用)** | 更新体験がチャットそのもの。スキーマで守れる。既存スタック(Bun/Drizzle)と完全に一致。「LLMで更新できるポートフォリオ」自体が作品性を持つ |
| Notion を CMS にして既存 Notion MCP で更新 | 実装ゼロで今日から使えるのが強み。ただしスキーマが緩く、サイト側が Notion API のレイテンシ・レート制限・仕様変更に依存する。つなぎとしてはアリ |
| REST API + LLM に HTTP を叩かせる | MCP の下位互換。ツール定義の標準化・クライアント側サポートの恩恵がない |
| YAML + LLM に auto-commit させる | 「更新のためだけに commit したくない」に反するので却下 |

### 発展形

- **Spotify API 連携**: 「いま聴いてる曲」「最近のヘビロテ」を自動取得(design-direction の「実世界との連動」演出と直結)。手動更新の MCP と共存できる
- MCP ツールに読み取り系(`playlist_list` など)も持たせておくと、LLM に「最近何聴いてたっけ」と聞ける自分用データベースにもなる

## バリデーション(決定: Valibot)

- MCP TypeScript SDK v2 はツールスキーマが **Standard Schema 対応**になり、Valibot を公式サポート。`@valibot/to-json-schema` の `toStandardJsonSchema` で包んで `inputSchema` に渡す: <https://ts.sdk.modelcontextprotocol.io/v2/advanced/schema-libraries>
- SDK のデフォルト JSON Schema バリデータは workerd 上では `@cfworker/json-schema` が自動選択される(Workers が一級ランタイム)
- Drizzle スキーマからの導出は `drizzle-valibot`。Better Auth も含め、リポジトリ内のバリデーションは Valibot に統一

## デプロイ単位(決定: すべて Cloudflare Workers、website と mcp の 2 Worker)

MCP SDK v2 も Better Auth(fetch ベース + WebCrypto)も workerd で動くため、コンテナは不要。**Docker / distroless イメージ / Elysia はスタックから外れる**。Bun は開発ランタイム・パッケージマネージャー・テストランナーとして残る(本番はすべて workerd)。

経緯: 当初 Cloudflare Containers(`oven/bun` distroless)を検討したが、コンテナのディスクはエフェメラル(スリープ復帰・再デプロイでリセット)なのでコンテナ内 SQLite は不可と判明( <https://developers.cloudflare.com/containers/faq/> )。DB を Turso に外出しした上で、MCP+認可も workerd で動くと確認できたため Workers に一本化した。

その上で、サイトと MCP+認可は **別 Worker として分離する**:

- **website Worker**(`shio.studio`): TanStack Start のサイト。公開トラフィック用で、バンドルを軽く保てる
- **mcp Worker**(`mcp.shio.studio`): MCP サーバー + 認可サーバー(Better Auth)。自分専用で、認証まわりの依存をサイトから隔離できる
- 分離の利点: デプロイが独立(サイトの見た目をいじっても認証系に触れない)、障害・脆弱性の影響範囲が分かれる、バンドルサイズの心配が消える
- MCP+認可のペアは強結合のまま(Better Auth はアプリにマウントするライブラリで、トークン検証もプロセス内で完結)
- **パスキーの RP ID は親ドメイン `shio.studio`** にする。認可サーバーは `mcp.shio.studio` にいるが、RP ID を親にしておけばサブドメイン間で有効
- スリープやエフェメラルディスクの心配はない(Workers はステートレス前提で、状態は最初から Turso にある)

## DB(決定: Turso)

Workers はステートレスなので DB は外部必須。D1 でなく Turso なのは、ローカル開発や将来の移設が libSQL で素直なため。

## 開発環境

- **Docker は使わない**。本番は Workers(コンテナ不在)、ローカルは `@cloudflare/vite-plugin` が workerd を直接動かすので、開発にもコンテナが要らない。DB のローカル開発は Turso のローカルモード(libSQL ファイル)
- **Nix は入れない**。ランタイムが Bun 単体でネイティブ依存もゼロのため、Nix が解決する問題がない(将来ネイティブ依存や Linux 開発機が増えたら再検討)
- **ツールバージョンの単一情報源はリポジトリ直下の `.bun-version`**。特定のバージョンマネージャーに依存しない、ただのバージョン文字列ファイル
  - proto: エコシステムファイル検出で `.bun-version` を読む(デフォルトの `detect-strategy = "first-available"` のままで動く。`.prototools` は置かない)
  - mise: idiomatic バージョンファイルとして対応。マシンごとに一度だけ `mise settings add idiomatic_version_file_enable_tools bun` で有効化(2025.10 からデフォルト無効のため)
  - CI: GitHub Actions の `oven-sh/setup-bun` も `.bun-version` を読める
  - `.prototools` / `mise.toml` はリポジトリに置かない(二重管理によるドリフト防止)

## リポジトリ構成

Bun workspaces のモノレポ:

```
apps/
  website/  → shio.studio(TanStack Start)
  mcp/      → mcp.shio.studio(Better Auth + MCP)
packages/
  db/       → Drizzle スキーマ + Valibot(両 Worker から import)
```

命名メモ: アプリ名は **`website`**(本人の決定)。

## 配信キャッシュ(ISR 相当)

TanStack Start に Next.js 式の ISR 機構はないが、**Workers Cache** で同じ挙動を作る(公式ガイドも HTTP キャッシュ方式: <https://tanstack.com/start/latest/docs/framework/react/guide/isr> )。

- 注意: Worker は CDN キャッシュの「前」で実行されるため、`Cache-Control` ヘッダーだけでは何もキャッシュされない(既知の罠: <https://github.com/TanStack/router/issues/7527> )
- 解決: `wrangler.jsonc` に `"cache": { "enabled": true }` を設定して Worker の前にキャッシュ層を付け、ルートごとに `Cache-Control: public, s-maxage=…, stale-while-revalidate=…` を返す
- ガード: デフォルトは `private, no-store` とし、キャッシュしたいルートだけ明示的に opt-in する(認証系ページの誤キャッシュを防ぐ)
- **更新即時反映**: 書き込み口は MCP サーバーだけなので、MCP ツールの書き込み直後に該当 URL のキャッシュをパージする。TTL を長めにしてヒット率を稼ぎつつ、更新は数秒で反映される(時限式 ISR より良い性質)

## 認証(決定: パスキー)

MCP の認可仕様(2025-11-25 改訂以降)で、**公開 URL を持つ MCP サーバーは OAuth 2.1 + PKCE が必須**。静的な Bearer トークンはローカル限定で、リモートでは非準拠。現行仕様: <https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization>

本人確認は **パスキー(WebAuthn)**。Google / GitHub 等の外部 IdP も使わない(Google Cloud Console などの GUI 作業が不要になる)。

構成:

```
[MCP クライアント (Cursor / Claude)]
        │ 401 → メタデータ発見 → OAuth 2.1 + PKCE フロー(ブラウザが開く)
        ▼
[認可サーバー]  Better Auth (MCP + passkey プラグイン) を mcp Worker のルートにマウント
        │ ログイン画面 = パスキー(Touch ID / 生体認証)のみ。ユーザーは自分 1 人
        ▼
[MCP サーバー]  リソースサーバーとしてトークンの audience / 有効期限を検証
```

方針:

- **パスワード認証は作らない**。パスキーはフィッシング耐性のある所持+生体の 2 要素で、単体で MFA 相当
- **パスキーは 3 つ登録する**(1 アカウントに複数登録できる)
  - iCloud キーチェーン A: Mac1 + iPad(同じ Apple ID、同期で共有)
  - iCloud キーチェーン B: Mac2(別 Apple ID なので独立)
  - Google パスワードマネージャー: Xiaomi 13T
  - 3 箇所に分散するので、どれかを失ってもログイン手段が残る。全滅時は DB を直接触って再ブートストラップ
  - 代替案: 1Password / Bitwarden 等のクロスプラットフォームなパスワードマネージャーを全デバイスに入れているなら、パスキー 1 つで全台カバーも可
- 認可サーバーに「ログイン済み状態で新デバイスのパスキーを追加」できる極小の管理ページを 1 枚持たせる。Mac2 と Xiaomi の初回だけ QR のクロスデバイス認証(iPad 等で承認)で入り、その場で本体のパスキーを登録
- 初回ブートストラップ: 「ユーザーが 0 人のときだけ登録を開放」方式(以降は追加登録のみ)
- セッション/トークンの保存先は Drizzle(サイトと同じ DB)
- **パスキーはドメイン(RP ID)に紐づく**。RP ID は `shio.studio`。localhost で登録したものは本番で使えない点に注意(開発時は開発用の登録で回す)
