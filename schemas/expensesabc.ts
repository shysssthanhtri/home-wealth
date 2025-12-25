import * as z from "zod"
import * as imports from "../prisma/null"
import { ExpenseType } from "../generated/prisma"
import { Completeusers, RelatedusersSchema, Completehomes, RelatedhomesSchema } from "./index"

export const expensesabcSchema = z.object({
  id: z.string(),
  userId: z.string(),
  homeId: z.string(),
  type: z.nativeEnum(ExpenseType),
  amount: z.number().int(),
  description: z.string().nullish(),
  date: z.date(),
})

export interface Completeexpensesabc extends z.infer<typeof expensesabcSchema> {
  user: Completeusers
  home: Completehomes
}

/**
 * RelatedexpensesabcSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedexpensesabcSchema: z.ZodSchema<Completeexpensesabc> = z.lazy(() => expensesabcSchema.extend({
  user: RelatedusersSchema,
  home: RelatedhomesSchema,
}))
