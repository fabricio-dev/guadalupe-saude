"use server";

import Stripe from "stripe";

import { actionClient } from "@/lib/next-safe-action";

export const createStripeCheckout = actionClient.action(async () => {
  //---------------------------------------------------------------------//
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_GUADALUPE_PRICE_CONVENIO_ID!,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/convenio/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/convenio/cancel`,
  });
  return { url: session.url };
});
