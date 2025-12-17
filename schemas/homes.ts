import * as z from "zod";

import { Completehomes_users, Relatedhomes_usersSchema } from "./index";

export const homesSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export interface Completehomes extends z.infer<typeof homesSchema> {
  homesUsers: Completehomes_users[];
}

/**
 * RelatedhomesSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedhomesSchema: z.ZodSchema<Completehomes> = z.lazy(() =>
  homesSchema.extend({
    homesUsers: Relatedhomes_usersSchema.array(),
  }),
);
