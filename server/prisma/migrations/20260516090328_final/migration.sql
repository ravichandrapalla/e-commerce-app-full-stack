-- Order.updatedAt is added in 20260516123000_payment_ready_orders.
-- Ensure column exists for shadow DB replay (migrations run in timestamp order).
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
