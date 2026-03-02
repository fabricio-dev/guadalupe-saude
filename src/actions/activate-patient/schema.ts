import { z } from "zod";

export const activatePatientSchema = z.object({
  patientId: z.string().uuid({ message: "ID do paciente é obrigatório" }),
  paymentType: z.enum(["PIX", "CARD", "DINHEIRO"]).optional(),
});

export type ActivatePatientSchema = z.infer<typeof activatePatientSchema>;
