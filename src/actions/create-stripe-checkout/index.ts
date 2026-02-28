"use server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { z } from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

const schema = z.object({
  patientId: z.string().uuid(),
});

export const createStripeCheckout = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    if (!process.env.STRIPE_GUADALUPE_PRICE_CONVENIO_ID) {
      throw new Error("STRIPE_GUADALUPE_PRICE_CONVENIO_ID is not set");
    }
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("NEXT_PUBLIC_APP_URL is not set");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const patient = await db
      .select({ id: patientsTable.id })
      .from(patientsTable)
      .where(eq(patientsTable.id, parsedInput.patientId))
      .limit(1);

    if (patient.length === 0) {
      throw new Error("Convênio não encontrado");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_GUADALUPE_PRICE_CONVENIO_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/convenio/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/convenio/cancel`,
      metadata: {
        patientId: parsedInput.patientId,
        action: "CREATE_AGREEMENT",
      },
      client_reference_id: parsedInput.patientId,
    });

    await db
      .update(patientsTable)
      .set({
        stripeCheckoutSessionId: session.id,
        // mantém PENDING até o webhook confirmar
        paymentStatus: "PENDING",
        paymentType: "CARD",
      })
      .where(eq(patientsTable.id, parsedInput.patientId));

    return { url: session.url };
  });
