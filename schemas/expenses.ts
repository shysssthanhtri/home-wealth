import * as z from "zod"
import * as imports from "../prisma/null"
import { ExpenseType } from "../generated/prisma"
import { Completeusers, RelatedusersSchema, Completehomes, RelatedhomesSchema } from "./index"

export const expensesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  homeId: z.string(),
  type: z.nativeEnum(ExpenseType),
  amount: z.number().int(),
  description: z.string().nullish(),
  date: z.date(),
})

export interface Completeexpenses extends z.infer<typeof expensesSchema> {
  user: Completeusers
  home: Completehomes
}

/**
 * RelatedexpensesSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedexpensesSchema: z.ZodSchema<Completeexpenses> = z.lazy(() => expensesSchema.extend({
  user: RelatedusersSchema,
  home: RelatedhomesSchema,
}))
