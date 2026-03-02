"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db";
import { patientsTable, sellersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const schema = z.object({
  patientId: z.string().uuid(),
});

export const generateStripeRenewalLink = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession?.user) {
      throw new Error("Unauthorized");
    }
    // if (authSession.user.role !== "admin") {
    //   throw new Error("Você não tem permissão para gerar um link de renovação");
    // } tirei restricao para teste

    if (!process.env.STRIPE_SECRET_KEY)
      throw new Error("STRIPE_SECRET_KEY is not set");
    if (!process.env.STRIPE_GUADALUPE_PRICE_CONVENIO_ID)
      throw new Error("STRIPE_GUADALUPE_PRICE_CONVENIO_ID is not set");
    if (!process.env.NEXT_PUBLIC_APP_URL)
      throw new Error("NEXT_PUBLIC_APP_URL is not set");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const [patient] = await db
      .select({
        id: patientsTable.id,
        expirationDate: patientsTable.expirationDate,
        isActive: patientsTable.isActive, // reactivatedAt
        activeAt: patientsTable.activeAt,
        reactivatedAt: patientsTable.reactivatedAt,
        sellerId: patientsTable.sellerId,
        clinicId: patientsTable.clinicId,
      })
      .from(patientsTable)
      .where(eq(patientsTable.id, parsedInput.patientId))
      .limit(1);

    if (!patient) throw new Error("Convênio não encontrado");

    const seller = await db
      .select()
      .from(sellersTable)
      .where(eq(sellersTable.email, authSession.user.email))
      .limit(1);

    // se nao for admin e o vendedor do convenio nao for o mesmo do usuario logado, retorna erro e nao gera link
    // if (
    //   authSession.user.role !== "admin" &&
    //   seller[0].id !== patient.sellerId
    // ) {
    //   return {
    //     error:
    //       "Você não tem permissão para gerar um link de renovação para este convênio, pois ele pertence a outro vendedor",
    //   };
    // }
    if (
      authSession.user.role !== "admin" &&
      authSession.user.role !== "gestor"
    ) {
      if (patient.sellerId !== seller[0].id) {
        return {
          error:
            "Você não tem permissão para gerar um link de renovação para este convênio, pois ele pertence a outro vendedor",
        };
      }
    } else if (seller[0].clinicId !== patient.clinicId) {
      return {
        error:
          "Você não tem permissão para gerar um link de renovação para este convênio, pois ele pertence a outra unidade",
      };
    }

    //________________________________________________________________

    const isExpired =
      !patient.expirationDate ||
      dayjs(patient.expirationDate).isBefore(dayjs(), "minute");
    const isPending =
      !patient.activeAt &&
      !patient.reactivatedAt &&
      isExpired &&
      patient.isActive == false;

    // regra do seu pedido: só gera link se estiver vencido
    if (!isExpired && !isPending) {
      throw new Error(
        "Este convênio ainda não está vencido ou pendente de renovação.",
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        { price: process.env.STRIPE_GUADALUPE_PRICE_CONVENIO_ID, quantity: 1 },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/convenio/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/convenio/cancel`,
      metadata: {
        patientId: patient.id,
        action: "RENEW",
      },
      client_reference_id: patient.id,
    });

    await db
      .update(patientsTable)
      .set({
        paymentType: "CARD",
        paymentStatus: "PENDING",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: null,
        // editedBy: authSession.user.id,
        // editedAt: new Date(),
      })
      .where(eq(patientsTable.id, patient.id));

    if (!session.url) {
      throw new Error("Stripe não retornou URL de checkout");
    }

    return { url: session.url };
  });
