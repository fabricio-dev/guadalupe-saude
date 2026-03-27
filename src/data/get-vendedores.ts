import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { and, count, eq, inArray, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { patientsTable, sellersTable } from "@/db/schema";

// Configurar plugins do dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

interface GetVendedoresParams {
  from: string;
  to: string;
  clinicId: string;
  vendedorId?: string;
  session: {
    user: {
      id: string;
    };
  };
}

export async function getVendedores({
  from,
  to,
  clinicId,
  vendedorId,
  // session,
}: GetVendedoresParams) {
  try {
    // Validar se clinicId não é "all" - essa função requer uma clínica específica
    if (clinicId === "all") {
      throw new Error("Esta função requer uma clínica específica");
    }

    // Verificar se o usuário tem acesso à clínica especificada
    // const userClinicAccess = await db
    //   .select()
    //   .from(usersToClinicsTable)
    //   .where(
    //     and(
    //       eq(usersToClinicsTable.userId, session.user.id),
    //       eq(usersToClinicsTable.clinicId, clinicId),
    //     ),
    //   );

    // if (userClinicAccess.length === 0) {
    //   throw new Error("Acesso negado à clínica");
    // }

    // Buscar vendedores da clínica
    let vendedorIds: string[] = [];
    const vendedores = await db.query.sellersTable.findMany({
      where: eq(sellersTable.clinicId, clinicId),
      columns: {
        id: true,
        name: true,
        clinicId: true,
      },
    });

    if (vendedorId && vendedorId !== "all") {
      const vendedorExists = vendedores.find((v) => v.id === vendedorId);
      if (!vendedorExists) {
        throw new Error("Vendedor não encontrado");
      }
      vendedorIds = [vendedorId];
    } else {
      vendedorIds = vendedores.map((v) => v.id);
    }

    // Definir datas considerando fuso horário brasileiro
    const fromDate = dayjs
      .tz(`${from} 00:00:00`, "America/Sao_Paulo")
      .utc()
      .toDate();
    const toDate = dayjs
      .tz(`${to} 23:59:59`, "America/Sao_Paulo")
      .utc()
      .toDate();

    // Buscar estatísticas gerais usando a mesma lógica do get-management e get-dashboard
    const [
      [totalPatientsNovos = { total: 0 }],
      [totalPatientsRenovados = { total: 0 }],
      [totalFaturamentoPatients = { total: 0 }],
      [totalFaturamentoPatientsRenovated = { total: 0 }],
      [totalEnterprise = { total: 0 }],
      [totalEnterpriseRenovados = { total: 0 }],
      patientsNovos,
      patientsRenovados,
    ] = await Promise.all([
      // Pacientes novos ativados no período
      db
        .select({
          total: count(),
        })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, vendedorIds),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' <= ${toDate}`,
          ),
        ),

      // Pacientes renovados no período
      db
        .select({
          total: count(),
        })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, vendedorIds),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' <= ${toDate}`,
            sql`${patientsTable.reactivatedAt} IS NOT NULL`,
          ),
        ),
      db
        .select({
          total: sum(patientsTable.priceInCents),
        })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, vendedorIds),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' <= ${toDate}`,
          ),
        ),
      db
        .select({
          total: sum(patientsTable.priceInCentsRenovation),
        })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, vendedorIds),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' <= ${toDate}`,
            sql`${patientsTable.reactivatedAt} IS NOT NULL`,
          ),
        ),
      // Pacientes enterprise novos
      db
        .select({
          total: count(),
        })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, vendedorIds),
            eq(patientsTable.cardType, "enterprise"),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' <= ${toDate}`,
          ),
        ),

      // Pacientes enterprise renovados
      db
        .select({
          total: count(),
        })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, vendedorIds),
            eq(patientsTable.cardType, "enterprise"),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' <= ${toDate}`,
            sql`${patientsTable.reactivatedAt} IS NOT NULL`,
          ),
        ),

      // Buscar pacientes novos ativados no período (detalhes)
      db.query.patientsTable.findMany({
        where: and(
          inArray(patientsTable.sellerId, vendedorIds),
          eq(patientsTable.isActive, true),
          sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
          sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' <= ${toDate}`,
        ),
        with: {
          seller: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // Buscar pacientes renovados no período (detalhes)
      db.query.patientsTable.findMany({
        where: and(
          inArray(patientsTable.sellerId, vendedorIds),
          eq(patientsTable.isActive, true),
          sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' >= ${fromDate}`,
          sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' <= ${toDate}`,
          sql`${patientsTable.reactivatedAt} IS NOT NULL`,
        ),
        with: {
          seller: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    // Calcular totais usando a mesma lógica do get-management
    const totalVendas = totalPatientsNovos.total + totalPatientsRenovados.total;
    const totalEnterpriseTotal =
      totalEnterprise.total + totalEnterpriseRenovados.total;

    // Calcular faturamento usando a mesma lógica do get-management
    const faturamentoTotal =
      Number(totalFaturamentoPatients?.total ?? 0) +
      Number(totalFaturamentoPatientsRenovated?.total ?? 0);

    const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

    // Usar os totais das consultas em vez de filtrar o array
    const empresariais = totalEnterpriseTotal;
    const individuais = totalVendas - totalEnterpriseTotal;

    // Usar os totais das consultas para novos vs renovações
    const renovacoes = totalPatientsRenovados.total;
    const novos = totalPatientsNovos.total;

    // Calcular ranking de vendedores
    const vendedorStats = vendedores.map((vendedor) => {
      // Separar pacientes novos e renovados para este vendedor
      const vendedorPatientsNovos = patientsNovos.filter(
        (p) => p.sellerId === vendedor.id,
      );
      const vendedorPatientsRenovados = patientsRenovados.filter(
        (p) => p.sellerId === vendedor.id,
      );

      // Total de convênios é a soma de novos + renovados
      const novosConvenios = vendedorPatientsNovos.length;
      const renovacoesVendedor = vendedorPatientsRenovados.length;
      const totalConvenios = novosConvenios + renovacoesVendedor;

      // Convênios empresariais (soma de novos e renovados)
      const conveniosEmpresariais =
        vendedorPatientsNovos.filter((p) => p.cardType === "enterprise")
          .length +
        vendedorPatientsRenovados.filter((p) => p.cardType === "enterprise")
          .length;

      // Calcular faturamento igual ao faturamento total
      const faturamento =
        vendedorPatientsNovos.reduce(
          (sum, p) => sum + Number(p.priceInCents ?? 0),
          0,
        ) +
        vendedorPatientsRenovados.reduce(
          (sum, p) => sum + Number(p.priceInCentsRenovation ?? 0),
          0,
        );

      // Meta mockada (pode ser implementada no banco depois)
      const meta = 100000; // Meta padrão
      const percentualMeta = meta > 0 ? (faturamento / meta) * 100 : 0;

      return {
        nome: vendedor.name,
        vendas: totalConvenios,
        faturamento,
        meta,
        percentualMeta,
        totalConvenios,
        conveniosEmpresariais,
        renovacoes: renovacoesVendedor,
        novosConvenios,
      };
    });

    // Ordenar ranking por faturamento
    const rankingVendedores = vendedorStats.sort(
      (a, b) => b.faturamento - a.faturamento,
    );

    const vendedorTop = rankingVendedores[0]?.nome || "";
    const metaAtingida =
      rankingVendedores.length > 0
        ? rankingVendedores.reduce((sum, v) => sum + v.percentualMeta, 0) /
          rankingVendedores.length
        : 0;

    // Comissões mockadas (5% do faturamento)
    const comissoesTotais = faturamentoTotal * 0.05;

    // Gerar faturamento mensal (calculado no banco, igual ao management)
    const faturamentoMensal = await getFaturamentoMensalBySellers({
      sellerIds: vendedorIds,
      from,
      to,
    });

    return {
      totalVendas,
      faturamentoTotal,
      ticketMedio,
      metaAtingida,
      comissoesTotais,
      vendedorTop,
      rankingVendedores,
      distribuicaoVendas: {
        renovacao: renovacoes,
        novo: novos,
      },
      tiposConvenio: {
        empresarial: empresariais,
        individual: individuais,
      },
      faturamentoMensal,
    };
  } catch (error) {
    console.error("Erro ao buscar dados de vendedores:", error);
    throw error;
  }
}

async function getFaturamentoMensalBySellers({
  sellerIds,
  from,
  to,
}: {
  sellerIds: string[];
  from: string;
  to: string;
}): Promise<Array<{ mes: string; faturamento: number }>> {
  if (sellerIds.length === 0) return [];

  const startDate = dayjs(from);
  const endDate = dayjs(to);

  const fromDate = dayjs
    .tz(`${from} 00:00:00`, "America/Sao_Paulo")
    .utc()
    .toDate();
  const toDate = dayjs.tz(`${to} 23:59:59`, "America/Sao_Paulo").utc().toDate();

  const monthsDiff = endDate.diff(startDate, "month") + 1;

  let adjustedStartDate = startDate.startOf("month");
  let adjustedEndDate = endDate.startOf("month");

  if (monthsDiff < 3) {
    adjustedStartDate = startDate.subtract(1, "month").startOf("month");
    adjustedEndDate = endDate.add(1, "month").startOf("month");
  }

  const monthly: Array<{ mes: string; faturamento: number }> = [];
  let currentDate = adjustedStartDate;

  while (
    currentDate.isBefore(adjustedEndDate) ||
    currentDate.isSame(adjustedEndDate, "month")
  ) {
    const monthStart = currentDate.startOf("month").toDate();
    const monthEnd = currentDate.endOf("month").toDate();

    const isWithinOriginalPeriod =
      (currentDate.isAfter(startDate.startOf("month")) ||
        currentDate.isSame(startDate.startOf("month"), "month")) &&
      (currentDate.isBefore(endDate.startOf("month")) ||
        currentDate.isSame(endDate.startOf("month"), "month"));

    const periodStart = isWithinOriginalPeriod
      ? monthStart < fromDate
        ? fromDate
        : monthStart
      : monthStart;

    const periodEnd = isWithinOriginalPeriod
      ? monthEnd > toDate
        ? toDate
        : monthEnd
      : monthEnd;

    const [[novos], [renovados]] = await Promise.all([
      db
        .select({ total: sum(patientsTable.priceInCents) })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, sellerIds),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' >= ${periodStart}`,
            sql`${patientsTable.activeAt} AT TIME ZONE 'UTC' <= ${periodEnd}`,
          ),
        ),
      db
        .select({ total: sum(patientsTable.priceInCentsRenovation) })
        .from(patientsTable)
        .where(
          and(
            inArray(patientsTable.sellerId, sellerIds),
            eq(patientsTable.isActive, true),
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' >= ${periodStart}`,
            sql`${patientsTable.reactivatedAt} AT TIME ZONE 'UTC' <= ${periodEnd}`,
            sql`${patientsTable.reactivatedAt} IS NOT NULL`,
          ),
        ),
    ]);

    const faturamentoMes =
      Number(novos?.total ?? 0) + Number(renovados?.total ?? 0);

    monthly.push({
      mes: currentDate.tz("America/Sao_Paulo").format("MM/YY"),
      faturamento: faturamentoMes,
    });

    currentDate = currentDate.add(1, "month");
  }

  return monthly;
}
