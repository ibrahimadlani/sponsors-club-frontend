/**
 * Payments API
 * 
 * Functions for interacting with payment and subscription endpoints.
 */

import { get, post, del } from "./client";

/**
 * Get all available plans
 */
export async function getPlans() {
  return get("/payments/plans/");
}

/**
 * Get current user's subscription
 */
export async function getMySubscription() {
  return get("/payments/subscriptions/me/");
}

/**
 * Create a subscription
 */
export async function createSubscription(data) {
  return post("/payments/subscriptions/", data);
}

/**
 * Cancel current user's subscription
 */
export async function cancelMySubscription() {
  return del("/payments/subscriptions/me/");
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(planId) {
  return post("/payments/stripe/checkout-session/", { plan_id: planId });
}

/**
 * Handle Stripe webhook (internal use)
 */
export async function handleStripeWebhook(payload) {
  return post("/payments/stripe/webhook/", payload);
}
