import { z } from "zod";

export const upsertClinicSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Nome da clínica é obrigatório" }),
  individualActivationPriceInCents: z
    .number()
    .min(1, { message: "Preço é obrigatório" }),
  individualRenovationPriceInCents: z
    .number()
    .min(1, { message: "Preço é obrigatório" }),
  enterpriseActivationPriceInCents: z
    .number()
    .min(1, { message: "Preço é obrigatório" }),
  enterpriseRenovationPriceInCents: z
    .number()
    .min(1, { message: "Preço é obrigatório" }),
});

export type UpsertClinicSchema = z.infer<typeof upsertClinicSchema>;
