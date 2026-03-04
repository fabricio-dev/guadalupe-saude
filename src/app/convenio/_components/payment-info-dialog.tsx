"use client";

import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentInfoDialog({
  open,
  onOpenChange,
}: PaymentInfoDialogProps) {
  const handleWhatsAppClick = () => {
    const phoneNumber =
      process.env.NEXT_PUBLIC_TELEFONE_PRINCIPAL_EMPRESA || ""; // Número com código do país
    const message =
      "Olá! Gostaria de enviar o comprovante de pagamento do convênio.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_CHAVE_PIX_PRINCIPAL_EMPRESA || "",
      );
      toast.success("Chave PIX copiada!");
    } catch {
      toast.error("Erro ao copiar chave PIX");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        //onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-sky-900">
            Informações de Pagamento PIX
          </DialogTitle>
          <DialogDescription className="text-center">
            Escaneie o QR Code ou use a chave PIX para realizar o pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {/* QR Code PIX */}
          <div className="flex justify-center">
            <Image
              src="/QR-pix.svg"
              alt="QR Code PIX"
              width={256}
              height={256}
              className="h-56 w-56"
            />
          </div>

          {/* Chave PIX */}
          <div className="rounded-lg bg-gray-50 p-0 text-center">
            <p className="p-2 text-sm font-medium text-gray-700">
              Chave PIX (CPF/CNPJ):
              {process.env.NEXT_PUBLIC_CHAVE_PIX_PRINCIPAL_EMPRESA}
              <Button
                onClick={handleCopyPixKey}
                variant="outline"
                size="sm"
                className="ml-1 h-6 w-36 p-0"
              >
                📋 Copiar
              </Button>
            </p>
          </div>

          {/* Instruções */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Realize o pagamento, envie o comprovante pelo WhatsApp:
            </p>

            {/* Botão WhatsApp */}
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              <span className="mr-2">📱</span>
              Enviar Comprovante para :{" "}
              {process.env.NEXT_PUBLIC_TELEFONE_PRINCIPAL_EMPRESA || ""}
            </Button>

            <p className="text-xs text-gray-500">
              Após o envio do comprovante, agurde a confirmação do cadastro.
            </p>
          </div>

          {/* Botão Fechar */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
