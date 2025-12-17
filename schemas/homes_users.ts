import * as z from "zod";

import {
  Completehomes,
  Completeusers,
  RelatedhomesSchema,
  RelatedusersSchema,
} from "./index";

export const homes_usersSchema = z.object({
  id: z.string(),
  userId: z.string(),
  homeId: z.string(),
});

export interface Completehomes_users extends z.infer<typeof homes_usersSchema> {
  user: Completeusers;
  home: Completehomes;
}

/**
 * Relatedhomes_usersSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relatedhomes_usersSchema: z.ZodSchema<Completehomes_users> =
  z.lazy(() =>
    homes_usersSchema.extend({
      user: RelatedusersSchema,
      home: RelatedhomesSchema,
    }),
  );
