import dayjs from "dayjs";
import { and, eq, isNull, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";

export const runtime = "nodejs"; // importante para Stripe SDK no serverless

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY not set" },
      { status: 500 },
    );
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not set" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  // Stripe exige corpo "raw" para validar assinatura :contentReference[oaicite:2]{index=2}
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Confere se realmente está pago
        // (para Checkout "payment" isso é o caso típico)
        // você também pode checar session.payment_status === "paid"
        const patientId = session.metadata?.patientId;

        if (!patientId) {
          return NextResponse.json(
            { error: "Missing metadata.patientId" },
            { status: 400 },
          );
        }

        const paidAt = new Date(event.created * 1000);

        // sua regra: ativou quando pagou, vence +1 ano (ajuste se sua regra for outra)
        const newExpirationDate = dayjs(paidAt).add(1, "year").toDate();

        // Idempotência simples: só ativa se ainda não está PAID
        // e também confirma que a Session bate com o registro (se você salvou session.id)
        await db
          .update(patientsTable)
          .set({
            paymentStatus: "PAID",
            paidAt,
            isActive: true,
            activeAt: paidAt,
            expirationDate: newExpirationDate,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          })
          .where(
            and(
              eq(patientsTable.id, patientId),
              ne(patientsTable.paymentStatus, "PAID"),
            ),
          );

        break;
      }

      // opcional: se quiser marcar falha/cancelamento quando expirar
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const patientId = session.metadata?.patientId;
        if (patientId) {
          await db
            .update(patientsTable)
            .set({ paymentStatus: "CANCELED" })
            .where(
              and(
                eq(patientsTable.id, patientId),
                eq(patientsTable.stripeCheckoutSessionId, session.id),
                ne(patientsTable.paymentStatus, "PAID"),
              ),
            );
        }
        break;
      }

      default:
        // ignore eventos não usados
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook handler error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
