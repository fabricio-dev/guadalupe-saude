import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ConvenioSuccessPage() {
  const telefonePrincipalRaw =
    process.env.NEXT_PUBLIC_TELEFONE_PRINCIPAL_EMPRESA ?? "5511912345678";
  const telefonePrincipal = telefonePrincipalRaw.replace(/\D/g, "");

  const whatsappUrl = telefonePrincipal
    ? `https://wa.me/${telefonePrincipal}?text=${encodeURIComponent(
        "Olá! Acabei de criar meu convênio e gostaria de suporte.",
      )}`
    : undefined;

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl items-center px-4 py-10">
      <section className="bg-background w-full rounded-2xl border p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm font-medium">
              Cadastro concluído
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Boas-vindas ao seu convênio
            </h1>
            <p className="text-muted-foreground text-sm text-pretty sm:text-base">
              Recebemos seu pedido. Agora o pagamento está{" "}
              <b>em processamento</b>.
            </p>
          </div>

          <div className="bg-muted/30 rounded-xl border p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">O que acontece agora?</p>
              <p className="text-muted-foreground text-sm">
                Assim que a confirmação for concluída, você poderá{" "}
                <b>buscar seu cartão nas unidades</b>. O prazo para retirada é
                de <b>até 30 dias</b>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">
                Se precisar de ajuda, fale com a gente no WhatsApp ou procure a
                unidade mais próxima.
              </p>
              {telefonePrincipal && (
                <p className="text-muted-foreground text-xs">
                  WhatsApp:{" "}
                  <span className="font-medium">{telefonePrincipalRaw}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {whatsappUrl && (
                <Button variant="outline" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild>
                <Link href="/">Voltar para o início</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
