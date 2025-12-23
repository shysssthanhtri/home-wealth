import * as z from "zod"
import * as imports from "../prisma/null"
import { Completehomes_users, Relatedhomes_usersSchema, Completeexpenses, RelatedexpensesSchema } from "./index"

export const homesSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export interface Completehomes extends z.infer<typeof homesSchema> {
  homesUsers: Completehomes_users[]
  expenses: Completeexpenses[]
}

/**
 * RelatedhomesSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedhomesSchema: z.ZodSchema<Completehomes> = z.lazy(() => homesSchema.extend({
  homesUsers: Relatedhomes_usersSchema.array(),
  expenses: RelatedexpensesSchema.array(),
}))
