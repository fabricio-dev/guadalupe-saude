"use client";

import { FileText, PrinterIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface ContratoDialogProps {
  trigger?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ContratoContent = () => {
  const handlePrint = () => {
    const printWindow = window.open(
      "",
      "_blank",
      "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600",
    );
    if (!printWindow) return;

    const contractHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Termo de Convênio - Guadalupe Saúde </title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #059669;
            padding-bottom: 20px;
          }
          .logo {
            width: 120px;
            height: 80px;
            margin: 0 auto 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #065f46;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 18px;
            font-weight: 600;
            color: #047857;
          }
          .intro {
            background-color: #f0fdfa;
            border: 1px solid #22558a;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .clause {
            border: 1px solid #22558a;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .clause-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          .clause-number {
            background-color: #22558a;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
          }
          .clause-title {
            font-weight: 600;
            color: #22558a;
            font-size: 16px;
          }
          .clause-content {
            text-align: justify;
            line-height: 1.8;
          }
          .footer {
            border-top: 1px solid #22558a;
            padding-top: 20px;
            text-align: center;
            margin-top: 40px;
          }
          strong {
            font-weight: 600;
            color: #22558a;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">TERMO DE CONVÊNIO</div>
          <div class="subtitle">CARTÃO GUADALUPE SAÚDE</div>
        </div>

        <div class="intro">
          <p><strong>Pelo presente instrumento particular, as partes acima identificadas formalizam a adesão ao Cartão Mais Saúde Guadalupe, a partir da data abaixo indicada, obrigando-se ao cumprimento das cláusulas e condições a seguir:</strong></p>
         
        </div>

        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">1</div>
            <div class="clause-title">DA ADESÃO E FORMA DE PAGAMENTO</div>
          </div>
          <div class="clause-content">
            <p> O usuário pagará uma taxa de adesão/manutenção para aquisição do cartão, com validade anual, podendo o pagamento ser realizado à vista (parcela única) ou parcelado em até 12 (doze) vezes, conforme condições comerciais vigentes no ato da contratação.</p>
          </div>
        </div>

        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">2</div>
            <div class="clause-title">DO OBJETO</div>
          </div>
          <div class="clause-content">
            <p>O presente termo tem como objeto a concessão de descontos na realização de exames laboratoriais, densitometria óssea, ultrassonografia, exames oftalmológicos, eletrocardiograma, mamografia, bem como consultas com clínico geral e diversas especialidades médicas, sendo os atendimentos realizados na Clínica Guadalupe.</p>
          </div>
        </div>

        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">3</div>
            <div class="clause-title">DA NATUREZA DOS SERVIÇOS</div>
          </div>
          <div class="clause-content">
            <p> O Cartão Mais Saúde Guadalupe não se caracteriza como plano de saúde, seguro-saúde ou qualquer modalidade de assistência médica continuada, consistindo exclusivamente em um programa de benefícios.</p>
          </div>
        </div>

        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">4</div>
            <div class="clause-title">DOS VALORES E PAGAMENTOS DOS SERVIÇOS</div>
          </div>
          <div class="clause-content">
            <p> Os serviços utilizados serão pagos diretamente pelo usuário ao prestador, com aplicação de descontos previamente estabelecidos.</p>
          </div>
        </div>

        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">5</div>
            <div class="clause-title">DOS SERVIÇOS ADICIONAIS E PARCERIAS</div>
          </div>
          <div class="clause-content">
            <p> A contratada poderá disponibilizar serviços adicionais de apoio aos beneficiários, podendo tais benefícios ser alterados ou suspensos a qualquer tempo.</p>
          </div>
        </div>

        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">6</div>
            <div class="clause-title">DA UTILIZAÇÃO DO CARTÃO</div>
          </div>
          <div class="clause-content">
            <p> O acesso aos benefícios estará condicionado à apresentação do cartão.</p>
          </div>
        </div>
        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">7</div>
            <div class="clause-title">DA VIGÊNCIA</div>
          </div>
        </div>
        <div class="clause-content">
          <p> O presente termo terá validade de 12 (doze) meses a partir da data de sua assinatura.</p>
        </div>
      </div>


        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">7</div>
            <div class="clause-title">DO PRAZO DE ENTREGA</div>
          </div>
          <div class="clause-content">
            <p> O cartão será disponibilizado em até 30 (trinta) dias.</p>
          </div>
        </div>
        <div class="clause">
          <div class="clause-header">
            <div class="clause-number">8</div>
            <div class="clause-title">DO CANCELAMENTO</div>
          </div>
          <div class="clause-content">
            <p> O cancelamento poderá ser solicitado a qualquer tempo, sem devolução de valores.</p>
          </div>
        </div>


        <div class="footer">
          <p><strong>© ${new Date().getFullYear()} Guadalupe Saúde. Todos os direitos reservados.</strong></p>
          <p>Este documento é válido e possui valor legal para fins de adesão ao convênio.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(contractHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-32 items-center justify-center">
            <Image
              src="/logo03.svg"
              alt="Guadalupe Saúde Logo"
              className="h-full w-full rounded-sm object-contain"
              width={100}
              height={100}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-sky-900">
            TERMO DE CONVÊNIO
          </CardTitle>
          <div className="mt-2 text-lg font-semibold text-sky-700">
            CARTÃO GUADALUPE SAÚDE
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-gray-800">
          {/* Introdução */}
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
            <p className="text-justify leading-relaxed">
              Pelo presente instrumento particular, as partes acima
              identificadas formalizam a adesão ao Cartão Mais Saúde Guadalupe,
              a partir da data abaixo indicada, obrigando-se ao cumprimento das
              cláusulas e condições a seguir:
            </p>
          </div>

          {/* Cláusulas */}
          <div className="space-y-6">
            {/* Cláusula 1 */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  1
                </div>
                <h3 className="font-semibold text-sky-900">
                  DA ADESÃO E FORMA DE PAGAMENTO
                </h3>
              </div>
              <p className="text-justify leading-relaxed">
                O usuário pagará uma taxa de adesão/manutenção para aquisição do
                cartão, com validade anual, podendo o pagamento ser realizado à
                vista (parcela única) ou parcelado em até 12 (doze) vezes,
                conforme condições comerciais vigentes no ato da contratação.
              </p>
            </div>

            {/* Cláusula 2 */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  2
                </div>
                <h3 className="font-semibold text-sky-900">DO OBJETO</h3>
              </div>
              <p className="mb-3 text-justify leading-relaxed">
                O presente termo tem como objeto a concessão de descontos na
                realização de exames laboratoriais, densitometria óssea,
                ultrassonografia, exames oftalmológicos, eletrocardiograma,
                mamografia, bem como consultas com clínico geral e diversas
                especialidades médicas, sendo os atendimentos realizados na
                Clínica Guadalupe.
              </p>
            </div>

            {/* Cláusula 3 */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  3
                </div>
                <h3 className="font-semibold text-sky-900">
                  DA NATUREZA DOS SERVIÇOS
                </h3>
              </div>
              <p className="text-justify leading-relaxed">
                O Cartão Mais Saúde Guadalupe não se caracteriza como plano de
                saúde, seguro-saúde ou qualquer modalidade de assistência médica
                continuada, consistindo exclusivamente em um programa de
                benefícios.
              </p>
            </div>

            {/* Cláusula 4 */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  4
                </div>
                <h3 className="font-semibold text-sky-900">
                  DOS VALORES E PAGAMENTOS DOS SERVIÇOS
                </h3>
              </div>
              <p className="text-justify leading-relaxed">
                Os serviços utilizados serão pagos diretamente pelo usuário ao
                prestador, com aplicação de descontos previamente estabelecidos.
              </p>
            </div>

            {/* Cláusula 5 */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  5
                </div>
                <h3 className="font-semibold text-sky-900">
                  DOS SERVIÇOS ADICIONAIS E PARCERIAS
                </h3>
              </div>
              <p className="text-justify leading-relaxed">
                A contratada poderá disponibilizar serviços adicionais de apoio
                aos beneficiários, podendo tais benefícios ser alterados ou
                suspensos a qualquer tempo.
              </p>
            </div>

            {/* Cláusula 6 */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  6
                </div>
                <h3 className="font-semibold text-sky-900">
                  DA UTILIZAÇÃO DO CARTÃO
                </h3>
              </div>
              <p className="text-justify leading-relaxed">
                O acesso aos benefícios estará condicionado à apresentação do
                cartão.
              </p>
            </div>
          </div>
          {/* Cláusula 7 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                7
              </div>
            </div>
            <h3 className="font-semibold text-sky-900">DA VIGÊNCIA</h3>
            <div className="text-justify leading-relaxed">
              O presente termo terá validade de 12 (doze) meses a partir da data
              de sua assinatura.
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                8
              </div>
              <h3 className="font-semibold text-sky-900">
                DO PRAZO DE ENTREGA
              </h3>
            </div>
            <div className="text-justify leading-relaxed">
              O cartão será disponibilizado em até 30 (trinta) dias.
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                9
              </div>
              <h3 className="font-semibold text-sky-900">DO CANCELAMENTO</h3>
            </div>
            <div className="text-justify leading-relaxed">
              O cancelamento poderá ser solicitado a qualquer tempo, sem
              devolução de valores.
            </div>
          </div>

          {/* Rodapé */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <div className="mb-4">
              <FileText className="mx-auto h-8 w-8 text-sky-600" />
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Guadalupe Saúde. Todos os direitos
              reservados.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Este documento é válido e possui valor legal para fins de adesão
              ao convênio.
            </p>
          </div>

          {/* Botão de Imprimir */}
          <div className="flex justify-center print:hidden">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <PrinterIcon className="h-4 w-4" />
              Imprimir Contrato
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ContratoDialog({
  trigger,
  variant = "outline",
  size = "sm",
  className = "",
}: ContratoDialogProps) {
  const defaultTrigger = (
    <Button variant={variant} size={size} className={className}>
      <FileText className="h-4 w-4" />
      {size !== "icon" && <span className="ml-1">Ver Contrato</span>}
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-5xl">
        <DialogHeader>
          <DialogTitle className="p-2 text-center font-bold text-sky-900">
            Termo de Convênio - Cartão Guadalupe Saúde
          </DialogTitle>
        </DialogHeader>
        <ContratoContent />
      </DialogContent>
    </Dialog>
  );
}
