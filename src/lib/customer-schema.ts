import { z } from "zod";

const statusEnum = z.enum(["Open", "Inactive", "Paid", "Due"]);

export const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: statusEnum,
  rate: z.coerce.number(),
  balance: z.coerce.number(),
  deposit: z.coerce.number(),
});

export type CustomerFormSchema = z.infer<typeof customerFormSchema>;
