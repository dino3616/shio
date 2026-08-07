/**
 * mcp.shio.studio — MCP サーバー + 認可サーバー(Better Auth)のスケルトン。
 * 実装は docs/architecture.md の「コンテンツ更新」「認証」を参照。
 * TODO: @modelcontextprotocol/server (streamable HTTP) と Better Auth をマウントする。
 */
const fetchHandler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return Response.json({ ok: true });
  }

  return Response.json(
    { error: "not implemented yet", see: "https://github.com/dino3616/shio" },
    { status: 501 },
  );
};

const worker = {
  fetch: fetchHandler,
};

export default worker;
