import * as z from "zod";

export const accountsSchema = z.object({
  id: z.string(),
  access_token: z.string(),
  expires_at: z.number().int(),
  id_token: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  scope: z.string(),
  token_type: z.string(),
  type: z.string(),
  userId: z.string(),
});
