"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { generateStripeRenewalLink } from "@/actions/generate-stripe-renewal-link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  patientId: string;
  isAllowed: boolean; // (isExpired || isPending)
  trigger: React.ReactNode;
};

export function RenewalLinkDialog({ patientId, isAllowed, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>("");

  const action = useAction(generateStripeRenewalLink, {
    onSuccess: ({ data }) => {
      if (!data) {
        return toast.error("Erro ao gerar link de renovação.");
      }

      if ("error" in data && data.error) {
        return toast.error(data.error);
      }

      if (!("url" in data) || !data.url) {
        return toast.error("Stripe não retornou o link.");
      }

      setUrl(data.url);
      setOpen(true);
    },
    onError: (e) =>
      toast.error(e.error.serverError || "Erro inesperado ao gerar link"),
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não consegui copiar. Copie manualmente.");
    }
  }

  if (!isAllowed) return null;

  return (
    <>
      <span
        onClick={() => action.execute({ patientId })}
        role="button"
        tabIndex={0}
      >
        {trigger}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link de pagamento</DialogTitle>
            <DialogDescription>
              Envie este link para o cliente pagar no Stripe. Quando pagar, o
              convênio será validado automaticamente.
            </DialogDescription>
          </DialogHeader>

          <Input readOnly value={url} />

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button onClick={copy} disabled={!url}>
              Copiar link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
