"use client";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Patient {
  id: string;
  name: string;
  cpfNumber: string | null;
  phoneNumber: string;
  city: string | null;
  cardType: "enterprise" | "personal";
  numberCards: number | null;
  expirationDate: Date | null;
  birthDate: Date | null;
  rgNumber: string | null;
  address: string | null;
  homeNumber: string | null;
  state: string | null;
  Enterprise: string | null;
  dependents1: string | null;
  dependents2: string | null;
  dependents3: string | null;
  dependents4: string | null;
  dependents5: string | null;
  dependents6: string | null;
  observation: string | null;
  statusAgreement: "expired" | "pending" | null;
  createdAt: Date;
  updatedAt: Date | null;
  sellerId: string | null;
  clinicId: string | null;
  activeAt: Date | null;
  reactivatedAt: Date | null;
  seller?: { name: string } | null;
  clinic?: { name: string } | null;
  isActive: boolean;
}

interface ContratoComponentProps {
  patient: Patient;
  numeroContrato?: string;
}

interface PrintableContratoProps {
  patient: Patient;
  numeroContrato?: string;
  onPrintComplete?: () => void;
}

// Funções de formatação
const formatDate = (date: Date | string) => {
  if (!date) return "";

  // Converter para o fuso horário de São Paulo e formatar
  const dayjsDate = dayjs(date).tz("America/Sao_Paulo");
  return dayjsDate.format("DD/MM/YYYY");
};

const formatPhone = (phone: string) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const formatCpf = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatRg = (rg: string) => {
  return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
};

// Componente wrapper que abre a impressão automaticamente
export function PrintableContrato({
  patient,
  numeroContrato,
  onPrintComplete,
}: PrintableContratoProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Contrato - ${patient.name}`,
    onAfterPrint: onPrintComplete,
  });

  useEffect(() => {
    // Aguardar um pouco para o conteúdo renderizar e depois imprimir
    const timer = setTimeout(() => {
      handlePrint();
    }, 500);

    return () => clearTimeout(timer);
  }, [handlePrint]);

  return (
    <div style={{ position: "absolute", left: "-9999px" }}>
      <div ref={printRef}>
        <ContratoComponent patient={patient} numeroContrato={numeroContrato} />
      </div>
    </div>
  );
}

export default function ContratoComponent({
  patient,
  numeroContrato,
}: ContratoComponentProps) {
  return (
    <div className="mx-auto max-w-4xl bg-white p-4 text-sm text-black">
      {/* Cabeçalho */}
      <div className="relative mb-2 flex items-start justify-between">
        <div className="flex-1 p-0 text-lg font-bold text-sky-900">
          CARTÃO MAIS SAÚDE
        </div>

        <div className="text-right">
          <div className="absolute top-0 right-0">
            <img
              src="/lab.png"
              alt="Logo Guadalupe Saúde"
              className="h-20 w-auto object-contain print:h-16"
              style={
                {
                  imageRendering: "auto" as const,
                  maxWidth: "100%",
                  height: "50px",
                } as React.CSSProperties
              }
            />
          </div>
          <div className="mt-13 text-sm">
            <div className="font-bold">
              NÚMERO: {numeroContrato || "6441.52"}
            </div>
            <div className="text-lg font-bold"></div>
          </div>
        </div>
      </div>

      {/* Título */}
      <div className="mb-1 text-center">
        <h1 className="text-md font-bold">
          TERMO DE CONVÊNIO - CARTÃO MAIS SAÚDE GUADALUPE
        </h1>
      </div>

      {/* Texto introdutório */}
      <div
        className="mb-2 text-justify leading-relaxed"
        style={{ fontSize: "12px" }}
      >
        <p>
          Pelo presente instrumento particular, as partes acima identificadas
          formalizam a adesão ao Cartão Mais Saúde Guadalupe, a partir da data
          abaixo indicada, obrigando-se ao cumprimento das cláusulas e condições
          a seguir:
        </p>
        {/* <p className="mt-1">
          Solicitamos observar as seguintes disposições sobre o cartão:
        </p> */}
      </div>

      {/* Termos */}
      <div
        className="mb-2 text-justify leading-relaxed"
        style={{ fontSize: "12px" }}
      >
        <div className="mb-0">
          <strong>CLÁUSULA 1 – DA ADESÃO E FORMA DE PAGAMENTO</strong>
          <br></br>O usuário pagará uma taxa de adesão/manutenção para aquisição
          do cartão, com validade anual, podendo o pagamento ser realizado à
          vista (parcela única) ou parcelado em até 12 (doze) vezes, conforme
          condições comerciais vigentes no ato da contratação.
        </div>
        <div className="mb-0">
          <strong>CLÁUSULA 2 – DO OBJETO</strong> <br></br>O presente termo tem
          como objeto a concessão de descontos na realização de exames
          laboratoriais, densitometria óssea, ultrassonografia, exames
          oftalmológicos, eletrocardiograma, mamografia, bem como consultas com
          clínico geral e diversas especialidades médicas, sendo os atendimentos
          realizados na Clínica Guadalupe.
        </div>
        <div className="mb-0">
          <strong>CLÁUSULA 3 – DA NATUREZA DOS SERVIÇOS</strong>
          <br></br> O Cartão Mais Saúde Guadalupe não se caracteriza como plano
          de saúde, seguro-saúde ou qualquer modalidade de assistência médica
          continuada, consistindo exclusivamente em um programa de benefícios.
        </div>
        <div className="mb-0">
          <strong>CLÁUSULA 4 – DOS VALORES E PAGAMENTOS DOS SERVIÇOS</strong>
          <br></br>
          Os serviços utilizados serão pagos diretamente pelo usuário ao
          prestador, com aplicação de descontos previamente estabelecidos.
        </div>
        <div className="mb-0">
          <strong>CLÁUSULA 5 – DOS SERVIÇOS ADICIONAIS E PARCERIAS</strong>
          <br></br>A contratada poderá disponibilizar serviços adicionais de
          apoio aos beneficiários, podendo tais benefícios ser alterados ou
          suspensos a qualquer tempo.
        </div>

        <div className="mb-0">
          <strong>CLÁUSULA 6 – DA UTILIZAÇÃO DO CARTÃO</strong>
          <br></br>O acesso aos benefícios estará condicionado à apresentação do
          cartão.
        </div>
        <div className="mb-0">
          <strong>CLÁUSULA 8 – DO PRAZO DE ENTREGA</strong>
          <br></br>O cartão será disponibilizado em até 30 (trinta) dias.
        </div>
        <div className="mb-0">
          <strong>CLÁUSULA 9 – DO CANCELAMENTO</strong>
          <br></br>O cancelamento poderá ser solicitado a qualquer tempo, sem
          devolução de valores.
        </div>
      </div>

      {/* Concordância */}
      <div className="mb-2 text-justify font-bold" style={{ fontSize: "12px" }}>
        DE ACORDO COM TODOS OS TERMOS ACIMA CITADOS, PREENCHO OS DADOS ABAIXO E
        ASSINO:
      </div>

      {/* Dados do Titular */}
      <div className="mb-2">
        <div className="mb-2 font-bold" style={{ fontSize: "12px" }}>
          NOME TITULAR: {patient.name.toUpperCase()}
        </div>

        {/* Dependentes */}
        {(() => {
          const dependents = [
            patient.dependents1,
            patient.dependents2,
            patient.dependents3,
            patient.dependents4,
            patient.dependents5,
            patient.dependents6,
          ].filter(Boolean);

          return dependents.length > 0 ? (
            <div className="mb-2 rounded border border-gray-400 p-2">
              <div className="space-y-1 text-[12px]">
                {dependents.map((dependent, index) => (
                  <div key={index}>
                    <strong>DEPENDENTE {index + 1}:</strong>{" "}
                    {dependent?.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}
      </div>

      {/* Dados pessoais em tabela */}
      <div className="rounded border border-gray-400 p-2">
        <div className="grid grid-cols-2 text-[10px]">
          <div className="pb-1 pl-2">
            <strong>DATA DE NASCIMENTO:</strong>{" "}
            {patient.birthDate
              ? dayjs.utc(patient.birthDate).format("DD/MM/YYYY")
              : ""}
          </div>
          <div className="pb-1 pl-2">
            <strong>RG:</strong>{" "}
            {patient.rgNumber ? formatRg(patient.rgNumber) : ""}
          </div>
        </div>
        <div className="grid grid-cols-2 text-[10px]">
          <div className="pt-1 pb-1 pl-2">
            <strong>TELEFONE:</strong> {formatPhone(patient.phoneNumber)}
          </div>
          <div className="pt-1 pb-1 pl-2">
            <strong>CPF:</strong>{" "}
            {patient.cpfNumber ? formatCpf(patient.cpfNumber) : ""}
          </div>
        </div>
        <div className="pt-1 pb-1 pl-2 text-[10px]">
          <strong>ENDEREÇO:</strong>{" "}
          {patient.address ? patient.address.toUpperCase() : ""}
        </div>
        <div className="grid grid-cols-2 text-[10px]">
          <div className="pt-1 pb-1 pl-2">
            <strong>BAIRRO:</strong>{" "}
            {patient.homeNumber ? patient.homeNumber.toUpperCase() : ""}
          </div>
          <div className="pt-1 pb-1 pl-2">
            <strong>CIDADE:</strong>{" "}
            {patient.city ? patient.city.toUpperCase() : ""}{" "}
            {patient.state || ""}
          </div>
        </div>
      </div>

      {/* Dados do contrato */}
      <div className="mb-2 ml-2">
        <div className="grid grid-cols-2 text-[10px]">
          <div className="p-1">
            <strong>DATA DE VENCIMENTO:</strong>{" "}
            {patient.expirationDate
              ? formatDate(patient.expirationDate)
              : "___/___/______"}
          </div>
          <div className="p-1">
            <strong>UNIDADE DO CONTRATO:</strong>{" "}
            {patient.clinic?.name.toUpperCase() || "N/A"}
          </div>
        </div>
        <div className="grid grid-cols-2 text-[10px]">
          <div className="p-1">
            <strong>TIPO DE CARTÃO:</strong>{" "}
            {patient.cardType === "enterprise" ? "EMPRESA" : "INDIVIDUAL"}
          </div>
          <div className="p-1">
            <strong>DATA DO CONTRATO:</strong>{" "}
            {formatDate(
              patient.reactivatedAt
                ? patient.reactivatedAt
                : patient.activeAt
                  ? patient.activeAt
                  : new Date(),
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 text-[10px]">
          <div className="p-1">
            <strong>EMPRESA:</strong> {patient.Enterprise?.toUpperCase() || ""}
          </div>
          <div className="p-1">
            <strong>NÚMERO CARTÕES EXTRAS:</strong>{" "}
            {patient.numberCards && patient.numberCards > 1
              ? patient.numberCards - 1
              : 0}
          </div>
        </div>
        <div className="grid grid-cols-2 text-[10px]">
          <div className="p-1">
            <strong>VENDEDOR:</strong>{" "}
            {patient.seller?.name.toUpperCase() || ""}
          </div>
        </div>
      </div>

      {/* Assinatura */}
      <div className="mt-1 text-center">
        <div className="mx-auto w-80 border-b border-black pb-1">
          <div className="h-4"></div>
        </div>
        <div className="mt-1 text-[10px] font-bold">ASSINATURA DO TITULAR</div>
      </div>

      {/* Estilos para impressão */}
      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-size: 8px;
            line-height: 1.1;
          }
          .container {
            box-shadow: none;
            margin: 0;
            padding: 10px;
            max-width: 100%;
          }
          @page {
            size: A4;
            margin: 0.8cm;
          }
          * {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          h1 {
            font-size: 14px !important;
            margin: 8px 0 !important;
          }
          .text-xs {
            font-size: 7px !important;
          }
          .text-sm {
            font-size: 8px !important;
          }
          img {
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: -moz-crisp-edges !important;
            image-rendering: crisp-edges !important;
            image-rendering: high-quality !important;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            max-width: none !important;
            width: auto !important;
            height: auto !important;
            opacity: 1 !important;
            filter: none !important;
            object-fit: contain !important;
          }
          img[src="/mais.png"] {
            height: 50px !important;
            width: auto !important;
          }
          img[src="/lab.png"] {
            height: 50px !important;
            width: auto !important;
            image-rendering: high-quality !important;
          }
        }
      `}</style>
    </div>
  );
}
