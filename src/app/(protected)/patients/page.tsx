import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  and,
  between,
  gte,
  ilike,
  isNotNull,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Configurar plugins do dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddPatientButton from "./_components/add-patient-button";
import FiltersBar from "./_components/filters-bar";
import PatientsTable from "./_components/patients-table";
import SearchPatients from "./_components/search-patients";

interface PatientsPageProps {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

const PatientsPage = async ({ searchParams }: PatientsPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }
  if (session.user.role !== "admin") {
    redirect("/vendedor/dashboard-seller");
  }

  // Aguardar searchParams antes de usar
  const { search, filter, dateFrom, dateTo } = await searchParams;
  const isShowingExpired = filter === "expired";

  // Construir as condições de busca
  const searchTerm = search?.trim();

  let whereCondition: SQL<unknown> = sql`true`;

  // Aplicar filtro de vencidos se necessário
  if (isShowingExpired) {
    whereCondition = and(
      whereCondition,
      isNotNull(patientsTable.expirationDate),
      lte(patientsTable.expirationDate, new Date()),
    )!;
  }

  // Aplicar filtro por período de data de vencimento
  // Interpreta as datas como horário de São Paulo e converte para UTC
  // O DatePicker já envia as datas com horas (formato: YYYY-MM-DD HH:mm:ss)
  if (dateFrom && dateTo) {
    const fromDate = dayjs.tz(dateFrom, "America/Sao_Paulo").utc().toDate();
    const toDate = dayjs.tz(dateTo, "America/Sao_Paulo").utc().toDate();

    whereCondition = and(
      whereCondition,
      isNotNull(patientsTable.expirationDate),
      between(patientsTable.expirationDate, fromDate, toDate),
    )!;
  } else if (dateFrom) {
    const fromDate = dayjs.tz(dateFrom, "America/Sao_Paulo").utc().toDate();
    whereCondition = and(
      whereCondition,
      isNotNull(patientsTable.expirationDate),
      gte(patientsTable.expirationDate, fromDate),
    )!;
  } else if (dateTo) {
    const toDate = dayjs.tz(dateTo, "America/Sao_Paulo").utc().toDate();
    whereCondition = and(
      whereCondition,
      isNotNull(patientsTable.expirationDate),
      lte(patientsTable.expirationDate, toDate),
    )!;
  }

  // Aplicar filtro de busca por texto
  if (searchTerm) {
    // Normalizar termo de busca removendo acentos e espaços extras
    const normalizedSearchTerm = searchTerm
      .trim()
      .replace(/\s+/g, " ") // Normalizar espaços múltiplos para um único espaço
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // Também criar versão com espaços normalizados mas com acentos
    const spacesNormalizedTerm = searchTerm.trim().replace(/\s+/g, " ");

    const searchConditions = or(
      // Busca normal (com acentos)
      ilike(patientsTable.name, `%${searchTerm}%`),
      ilike(patientsTable.cpfNumber, `%${searchTerm}%`),
      ilike(patientsTable.rgNumber, `%${searchTerm}%`),
      ilike(patientsTable.phoneNumber, `%${searchTerm}%`),
      ilike(patientsTable.city, `%${searchTerm}%`),
      // Busca com espaços normalizados
      ilike(patientsTable.name, `%${spacesNormalizedTerm}%`),
      ilike(patientsTable.city, `%${spacesNormalizedTerm}%`),
      // Busca sem acentos usando translate (compatível com PostgreSQL)
      sql`lower(translate(regexp_replace(${patientsTable.name}, '\\s+', ' ', 'g'), 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ', 'AAAAAAaaaaaaOOOOOOooooooEEEEeeeeeCcIIIIiiiiUUUUuuuuyNn')) ilike '%' || lower(${normalizedSearchTerm}) || '%'`,
      sql`lower(translate(regexp_replace(${patientsTable.city}, '\\s+', ' ', 'g'), 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ', 'AAAAAAaaaaaaOOOOOOooooooEEEEeeeeeCcIIIIiiiiUUUUuuuuyNn')) ilike '%' || lower(${normalizedSearchTerm}) || '%'`,
    )!;

    whereCondition = and(whereCondition, searchConditions)!;
  }

  // Buscar todos os pacientes das clínicas do usuário admin
  const patients = await db.query.patientsTable.findMany({
    where: whereCondition,
    with: {
      seller: true,
      clinic: true,
    },
    orderBy: (patients, { desc }) => [
      isShowingExpired
        ? desc(patients.expirationDate)
        : desc(patients.updatedAt),
    ],
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>
            {isShowingExpired ? "Pacientes Vencidos" : "Pacientes"}
          </PageTitle>
          <PageDescription>
            {isShowingExpired
              ? "Pacientes com data de expiração vencida"
              : "Gerencie todos os pacientes"}
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <div className="flex items-center gap-4">
            <Suspense fallback={<div>Carregando...</div>}>
              <FiltersBar />
            </Suspense>
            <AddPatientButton />
          </div>
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<div>Carregando...</div>}>
              <SearchPatients />
            </Suspense>
          </div>

          <div className="w-full">
            <PatientsTable
              patients={patients.map((patient) => ({
                ...patient,
                birthDate: patient.birthDate ? new Date(patient.birthDate) : null,
                // expirationDate: patient.expirationDate, nao sei quando foi inserido isso
              }))}
            />
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

// Wrapper para suporte ao Suspense com searchParams
const PatientsPageWrapper = (props: PatientsPageProps) => {
  return (
    <Suspense fallback={<div>Carregando pacientes...</div>}>
      <PatientsPage {...props} />
    </Suspense>
  );
};

export default PatientsPageWrapper;
