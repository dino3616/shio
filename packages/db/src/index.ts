import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export * from "./schema";

export const createDb = (url: string, authToken?: string) => {
  const client = createClient(authToken === undefined ? { url } : { url, authToken });
  return drizzle(client, { schema });
};

export type Db = ReturnType<typeof createDb>;
