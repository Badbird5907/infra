import { createSubjects } from "@openauthjs/openauth/subject"
import { z } from "zod"

export const subjects = createSubjects({
  user: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    admin: z.boolean(),
  }),
})
export type Subject = z.infer<typeof subjects.user>