"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertClinic } from "@/actions/upsert-clinic";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { clinicsTable } from "@/db/schema";

const formSchema = z.object({
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

interface UpsertClinicFormProps {
  clinic?: typeof clinicsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertClinicForm = ({ clinic, onSuccess }: UpsertClinicFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clinic?.name ?? "",
      // Formulário em reais; banco em centavos.
      individualActivationPriceInCents:
        (clinic?.individualActivationPriceInCents ?? 0) / 100,
      individualRenovationPriceInCents:
        (clinic?.individualRenovationPriceInCents ?? 0) / 100,
      enterpriseActivationPriceInCents:
        (clinic?.enterpriseActivationPriceInCents ?? 0) / 100,
      enterpriseRenovationPriceInCents:
        (clinic?.enterpriseRenovationPriceInCents ?? 0) / 100,
    },
  });
  const isEditing = Boolean(clinic);

  const upsertClinicAction = useAction(upsertClinic, {
    onSuccess: () => {
      toast.success(
        clinic
          ? "Unidade atualizada com sucesso"
          : "Unidade adicionada com sucesso",
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar unidade");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertClinicAction.execute({
      ...values,
      id: clinic?.id,
      individualActivationPriceInCents: Math.round(
        values.individualActivationPriceInCents * 100,
      ),
      individualRenovationPriceInCents: Math.round(
        values.individualRenovationPriceInCents * 100,
      ),
      enterpriseActivationPriceInCents: Math.round(
        values.enterpriseActivationPriceInCents * 100,
      ),
      enterpriseRenovationPriceInCents: Math.round(
        values.enterpriseRenovationPriceInCents * 100,
      ),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{clinic ? clinic.name : "Adicionar Unidade"}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          {clinic
            ? "Edite as informações da unidade"
            : "Adicione uma nova unidade para gerenciar pacientes e convênios."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sky-900">Nome da Unidade</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da unidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          <div>
            <h3 className="text-lg font-semibold text-sky-700">
              Preços do Cartão Individual
            </h3>
          </div>
          <div className="text-muted-foreground text-sm">
            <p>
              <span className="font-bold">Observação:</span>
              <br />
              <span>
                O preço do cartão individual: Adicione o preço de ativação e de
                renovação. Caso os preços sejam iguais, adicione o mesmo preço
                para ambos.
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="individualActivationPriceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativação</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.floatValue ?? 0);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      getInputRef={field.ref}
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      thousandSeparator="."
                      customInput={Input}
                      prefix="R$"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="individualRenovationPriceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renovação</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.floatValue ?? 0);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      getInputRef={field.ref}
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      thousandSeparator="."
                      customInput={Input}
                      prefix="R$"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold text-sky-700">
              Preços do Cartão Empresarial
            </h3>
          </div>
          <div className="text-muted-foreground text-sm">
            <p>
              <span className="font-bold">Observação:</span>
              <br />
              <span>
                O preço do cartão empresarial: Adicione o preço de ativação e de
                renovação. Caso os preços sejam iguais, adicione o mesmo preço
                para ambos.
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="enterpriseActivationPriceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativação</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.floatValue ?? 0);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      getInputRef={field.ref}
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      thousandSeparator="."
                      customInput={Input}
                      prefix="R$"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enterpriseRenovationPriceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renovação</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.floatValue ?? 0);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      getInputRef={field.ref}
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      thousandSeparator="."
                      customInput={Input}
                      prefix="R$"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                upsertClinicAction.isExecuting ||
                (isEditing && !form.formState.isDirty)
              }
              className="bg-sky-600/90 hover:bg-sky-700"
            >
              {upsertClinicAction.isExecuting
                ? "Salvando..."
                : clinic
                  ? "Atualizar"
                  : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertClinicForm;
