"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { createPatient } from "@/actions/create-patient";
import { createPatientSchema } from "@/actions/create-patient/schema";
import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import ContratoDialog from "@/app/contrato/_components/contrato-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PublicPageContainer } from "@/components/ui/page-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaymentInfoDialog } from "../_components/payment-info-dialog";

// Função para verificar CPF duplicado
const checkCPFExists = async (cpf: string): Promise<boolean> => {
  try {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return false;

    const response = await fetch("/api/check-cpf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf: cleanCPF }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.exists;
    }
    return false;
  } catch {
    return false;
  }
};

// Função para validar CPF
const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const digit1 = remainder >= 10 ? 0 : remainder;

  if (digit1 !== parseInt(cleanCPF.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const digit2 = remainder >= 10 ? 0 : remainder;

  return digit2 === parseInt(cleanCPF.charAt(10));
};

const ufs = [
  "PE",
  "CE",
  "BA",
  "PB",
  "PI",
  "RN",
  "SE",
  "TO",
  "MA",
  "AC",
  "AL",
  "AP",
  "AM",
  "DF",
  "ES",
  "GO",
  "MT",
  "MS",
  "MG",
  "PA",
  "PR",
  "RJ",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
];

interface VendedorInfo {
  id: string;
  name: string;
  clinicId: string;
  clinicName: string;
  phoneNumber: string;
  pixKey: string;
  pixKeyType: string;
}

const pixEmpresa = process.env.NEXT_PUBLIC_CHAVE_PIX_PRINCIPAL_EMPRESA || "";

export default function ConvenioVendedorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [checkingCPF, setCheckingCPF] = useState(false);
  const [vendedorInfo, setVendedorInfo] = useState<VendedorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: (result) => {
      const url = result.data?.url;
      if (url) {
        // pequeno delay para o usuário ver o aviso/loader antes de sair da página
        setTimeout(() => {
          window.location.href = url;
        }, 3000);
      } else {
        toast.error("Não foi possível abrir a página de pagamento.");
        setIsRedirectingToCheckout(false);
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao realizar pagamento");
      setIsRedirectingToCheckout(false);
    },
  });
  const vendedorId = params.vendedorId as string;
  const clinicId =
    searchParams.get("clinicId") || process.env.NEXT_PUBLIC_DEFAULT_CLINIC_ID; // ID da clínica padrão NAO TENHO CERTEZA SE EH USADO

  // Buscar informações do vendedor
  useEffect(() => {
    const fetchVendedorInfo = async () => {
      try {
        const response = await fetch(`/api/sellers/${vendedorId}`);
        if (response.ok) {
          const data = await response.json();
          setVendedorInfo(data);
        } else {
          toast.error("Vendedor não encontrado");
          router.push("/convenio");
        }
      } catch (error) {
        console.error("Erro ao buscar vendedor:", error);
        toast.error("Erro ao carregar informações do vendedor");
        router.push("/convenio");
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId) {
      fetchVendedorInfo();
    }
  }, [vendedorId, router]);

  const form = useForm<z.infer<typeof createPatientSchema>>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      name: "",
      birthDate: "2007-09-01",
      phoneNumber: "",
      rgNumber: "",
      cpfNumber: "",
      address: "",
      homeNumber: "",
      city: "",
      state: "",
      cardType: "personal",
      Enterprise: "",
      numberCards: "1",
      clinicId: vendedorInfo?.clinicId || clinicId,
      sellerId: vendedorId,
      observation: "",
      dependents1: "",
      dependents2: "",
      dependents3: "",
      dependents4: "",
      dependents5: "",
      dependents6: "",
      acceptTerms: false,
      whatsappConsent: true,
      paymentType: "PIX", //undefined as unknown as "PIX" | "CARD",
    },
  });

  // Atualizar os IDs quando as informações do vendedor carregarem
  useEffect(() => {
    if (vendedorInfo) {
      form.setValue("clinicId", vendedorInfo.clinicId);
      form.setValue("sellerId", vendedorInfo.id);
    }
  }, [vendedorInfo, form]);

  const createPatientAction = useAction(createPatient, {
    onSuccess: async ({ data }) => {
      toast.success("Solicitação de convênio enviada com sucesso!");

      const paymentType = form.getValues("paymentType");

      if (!data?.patientId) {
        toast.error("Não foi possível identificar o convênio criado.");
        return;
      }

      if (paymentType === "CARD") {
        toast.message(
          <div className="text-center text-xl font-bold text-emerald-700">
            Redirecionando para pagamento
          </div>,
          {
            description: (
              <div className="text-lg text-emerald-700">
                Aguarde enquanto abrimos a página segura de pagamento com
                cartão.
              </div>
            ),
          },
        );
        setIsRedirectingToCheckout(true);
        await createStripeCheckoutAction.execute({ patientId: data.patientId });
        return; // vai redirecionar
      }

      // PIX
      setShowPaymentDialog(true);

      setTimeout(() => {
        form.reset();
      }, 100);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao enviar solicitação");
    },
  });

  const onSubmit = (values: z.infer<typeof createPatientSchema>) => {
    createPatientAction.execute({
      ...values,
      clinicId: vendedorInfo?.clinicId || clinicId || "",
      sellerId: vendedorId,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-900 via-sky-600 to-sky-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-white" />
          <p className="mt-2 text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-600 to-sky-900">
      {/* Header */}
      <header className="bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo03.svg"
                  alt="Guadalupe Saúde Logo"
                  width={40}
                  height={30}
                  className="h-8 w-auto object-contain"
                />
                <h1 className="text-xl font-bold text-emerald-900">
                  Guadalupe Saúde
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <PublicPageContainer>
        <div className="mx-auto max-w-4xl py-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">
              Seja um Conveniado
            </h1>
            {vendedorInfo && (
              <div className="mb-4 rounded-lg bg-white/95 p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-center text-sky-900">
                    <span className="min-w-[80px] font-semibold">
                      Vendedor:
                    </span>
                    <span className="ml-2">{vendedorInfo.name}</span>
                  </div>

                  <div className="flex items-center justify-center text-sky-900">
                    <span className="min-w-[80px] font-semibold">Unidade:</span>
                    <span className="ml-2">{vendedorInfo.clinicName}</span>
                  </div>

                  <div className="flex items-center justify-center text-sky-900">
                    <span className="min-w-[80px] font-semibold">
                      WhatsApp:
                    </span>
                    <a
                      href={`https://wa.me/55${vendedorInfo.phoneNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sky-900 transition-colors hover:text-sky-800 hover:underline"
                    >
                      {vendedorInfo.phoneNumber}
                    </a>
                  </div>

                  <div className="flex items-center justify-center text-sky-900">
                    <span className="min-w-[80px] font-semibold">PIX:</span>
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                      <button
                        onClick={() => setShowPaymentDialog(true)}
                        className="ml-2 rounded-md p-1.5 text-sky-900 transition-colors hover:bg-green-300 hover:text-sky-900"
                        title="Abrir informações de pagamento"
                      >
                        {pixEmpresa}
                      </button>
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(pixEmpresa);
                          toast.success("Chave PIX copiada!");
                        } catch {
                          toast.error("Erro ao copiar chave PIX");
                        }
                      }}
                      className="ml-2 rounded p-1.5 text-sky-900 transition-colors hover:bg-sky-100 hover:text-sky-800"
                      title="Copiar chave PIX"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <p className="text-white">
              Preencha os dados para solicitar o convênio. Ao escolher pagar com
              cartão, você sera redirecionado para uma página segura de
              pagamento. Apos concluir o pagamento, entre em contato para
              agendar a retirada do cartão. Ao escolher pagar com PIX, você
              receberá um QR Code para pagamento, apos concluir, envie o
              comprovante para o vendedor ou no numero de whatsapp da empresa:{" "}
              {process.env.NEXT_PUBLIC_TELEFONE_PRINCIPAL_EMPRESA || ""}.
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-emerald-950">
                Formulário de Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Dados Pessoais */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-emerald-900">
                      Dados Pessoais
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Nome Titular
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white"
                                placeholder="Digite o nome completo"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Data de Nascimento
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Telefone
                            </FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="(##) #####-####"
                                mask="_"
                                placeholder="(11) 99999-9999"
                                customInput={Input}
                                className="bg-white"
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rgNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              RG
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite apenas números"
                                {...field}
                                className="bg-white"
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cpfNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              CPF{" "}
                              {checkingCPF && (
                                <Loader2 className="ml-2 inline h-4 w-4 animate-spin" />
                              )}
                            </FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="###.###.###-##"
                                mask="_"
                                placeholder="000.000.000-00"
                                customInput={Input}
                                className="bg-white"
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.value);
                                }}
                                onBlur={async () => {
                                  const cpf = field.value;
                                  if (
                                    cpf &&
                                    cpf.length >= 11 &&
                                    isValidCPF(cpf)
                                  ) {
                                    setCheckingCPF(true);
                                    try {
                                      const exists = await checkCPFExists(cpf);
                                      if (exists) {
                                        form.setError("cpfNumber", {
                                          type: "manual",
                                          message:
                                            "Este CPF já está cadastrado no sistema",
                                        });
                                      } else {
                                        form.clearErrors("cpfNumber");
                                      }
                                    } finally {
                                      setCheckingCPF(false);
                                    }
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-emerald-900">
                      Endereço
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Endereço
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Rua, Avenida, número"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="homeNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Bairro
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o nome do bairro"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Cidade
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o nome da cidade"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              UF
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a UF" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ufs.map((uf) => (
                                  <SelectItem key={uf} value={uf}>
                                    {uf}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Informações do Convênio */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-emerald-900">
                      Informações do Convênio
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="cardType"
                        render={({ field }) => (
                          <FormItem hidden={true}>
                            <FormLabel className="text-emerald-950">
                              Tipo de Cartão
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de cartão" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="enterprise">
                                  EMPRESA
                                </SelectItem>
                                <SelectItem value="personal">
                                  INDIVIDUAL
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Enterprise"
                        render={({ field }) => (
                          <FormItem hidden={true}>
                            <FormLabel className="text-emerald-950">
                              Empresa
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome da empresa"
                                disabled={
                                  form.watch("cardType") !== "enterprise"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numberCards"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Quantidade de Cartões
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="6"
                                placeholder="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Dependentes */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-emerald-900">
                      Dependentes (Opcional)
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="dependents1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Dependente 1
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome do dependente (opcional)"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dependents2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Dependente 2
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome do dependente (opcional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dependents3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Dependente 3
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome do dependente (opcional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dependents4"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Dependente 4
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome do dependente (opcional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dependents5"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Dependente 5
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome do dependente (opcional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dependents6"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Dependente 6
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome do dependente (opcional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="observation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-950">
                              Observações
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Observações adicionais (opcional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Observações */}
                  {/* <div></div> */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-sky-700">
                      Forma de Pagamento
                    </h3>

                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sky-700">
                            Escolha como pagar
                          </FormLabel>
                          <Select
                            defaultValue="PIX"
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={true}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione forma de pagamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PIX">PIX (QR Code)</SelectItem>
                              <SelectItem value="CARD">
                                Cartão à vista (Crédito)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Termos de Uso  e consentimento WhatsApp*/}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-sky-700">
                      Termos e Condições
                    </h3>

                    <div className="space-y-4">
                      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                        <p className="mb-3 text-sm text-sky-800">
                          Para prosseguir com sua solicitação de convênio, é
                          necessário aceitar nossos termos de uso e política de
                          privacidade.
                        </p>
                        <div className="mb-3">
                          <ContratoDialog
                            trigger={
                              <button className="inline-flex items-center text-sm font-medium text-emerald-700 underline hover:text-emerald-900">
                                📋 Visualizar Contrato e Termos de Uso
                                <svg
                                  className="ml-1 h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </button>
                            }
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="whatsappConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-2 h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="mt-2 mb-2 text-sm font-medium text-sky-700">
                                  Autorizo o recebimento de mensagens via
                                  WhatsApp sobre avisos, lembretes e
                                  comunicações sobre o meu cartão Guadalupe
                                  Saúde.
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-0.5 h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium text-sky-700">
                                  Li e aceito os termos de uso e política de
                                  privacidade
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Botões de Envio */}

                  <div className="flex flex-col space-y-3 pt-6 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <Button
                      type="submit"
                      disabled={
                        createPatientAction.isExecuting ||
                        isRedirectingToCheckout
                      }
                      className="w-full bg-sky-700/80 hover:bg-sky-700 sm:max-w-md"
                      size="lg"
                    >
                      {createPatientAction.isExecuting
                        ? "Enviando..."
                        : isRedirectingToCheckout ||
                            createStripeCheckoutAction.isExecuting
                          ? "Redirecionando para pagamento..."
                          : "Solicitar Convênio"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </PublicPageContainer>

      {/* Dialog de Informações de Pagamento */}
      <PaymentInfoDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      />
    </div>
  );
}
