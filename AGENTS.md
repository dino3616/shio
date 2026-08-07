# コーディング規約

- **依存バージョンは完全固定**。`^` や `~` は使わない(`workspace:*` と `catalog:` は例外)
- **`function` 宣言は使わない**。常にアロー関数(`const fn = () => {}`)
- **無名の `export default` をしない**。`const` で命名してからエクスポートする。フレームワークがデフォルトエクスポートを要求する場合(Workers エントリ、vite.config)も `const x = ...; export default x;` の形にする
- フォーマット・リント・型チェックは `vp check --fix`(pre-commit で自動実行)
- ドキュメントは `docs/` を参照: 設計判断は `architecture.md`、デザインは `design-direction.md`、コンテンツは `content-plan.md`
