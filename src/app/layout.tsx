import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { BrowserCompatibilityProvider } from "@/components/browser-compatibility-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guadalupe Saúde",
  description: "Sistema de Gestão de convênios Guadalupe Saúde",
  keywords: [
    // Marca
    "Guadalupe Saúde",
    "Sistema Guadalupe Saúde",
    "Plataforma Guadalupe Saúde",

    // Intenção principal (gestão / clínica / convênios)
    "gestão de convênios",
    "gestão de clínica",
    "sistema para clínica",
    "software para clínica",
    "sistema de gestão de saúde",
    "sistema de gestão clínica",
    "gestão de pacientes",
    "cadastro de pacientes",
    "agendamento de consultas",
    "prontuário eletrônico",
    "faturamento médico",
    "contas médicas",
    "auditoria de convênios",

    // Operação / processos (o que seu sistema faz)
    "autorizações",
    "guias TISS",
    "TISS",
    "glosas",
    "recursos de glosa",
    "controle de atendimentos",
    "controle de procedimentos",
    "controle de exames",
    "controle de repasses",
    "relatórios de convênios",
    "painel de indicadores",
    "dashboards de saúde",

    // Termos populares no Brasil
    "gestão hospitalar",
    "gestão de clínica e consultório",
    "sistema para consultório",
    "software de consultório",
    "gestão de receitas e despesas clínica",
    "financeiro da clínica",
    "controle de agenda médica",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Polyfill para CSS Variables em navegadores antigos */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detecção rápida de suporte a CSS Variables
              if (!window.CSS || !CSS.supports || !CSS.supports('color', 'var(--fake-var)')) {
                document.documentElement.className += ' no-css-variables';
              }
              
              // Detecção de Windows 7
              if (/Windows NT 6\\.1/.test(navigator.userAgent)) {
                document.documentElement.className += ' windows-7';
              }
              
              // Detecção de Internet Explorer
              if (/MSIE|Trident/.test(navigator.userAgent)) {
                document.documentElement.className += ' internet-explorer';
              }
            `,
          }}
        />
      </head>
      <body className={`${manrope.variable} antialiased`}>
        <BrowserCompatibilityProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster position="bottom-center" richColors />
        </BrowserCompatibilityProvider>
      </body>
    </html>
  );
}
