export const formatCurrencyInCents = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

// export const formatCurrencyInCents = (
//   individual: number,
//   enterprise: number,
// ) => {
//   const a =
//     (individual - enterprise) *
//     Number(process.env.NEXT_PUBLIC_INDIVIDUAL_VALUE); //subtrai os pacientes que sao de empresas e multiplica pelo valor do convenio pessoal

//   const b = enterprise * Number(process.env.NEXT_PUBLIC_ENTERPRISE_VALUE); //multiplica os pacientes que sao de empresas pelo valor do convenio empresarial

//   return formatCurrency(a + b);
// };
