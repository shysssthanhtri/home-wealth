import * as z from "zod";

import { Completehomes_users, Relatedhomes_usersSchema } from "./index";

export const usersSchema = z.object({
  id: z.string(),
  email: z.string(),
  emailVerified: z.boolean().nullish(),
  image: z.string(),
  name: z.string(),
});

export interface Completeusers extends z.infer<typeof usersSchema> {
  homesUsers: Completehomes_users[];
}

/**
 * RelatedusersSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedusersSchema: z.ZodSchema<Completeusers> = z.lazy(() =>
  usersSchema.extend({
    homesUsers: Relatedhomes_usersSchema.array(),
  }),
);
