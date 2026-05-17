CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_stock_idx" ON "Product"("stock");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt");
CREATE INDEX IF NOT EXISTS "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- Enum values from payment_ready_orders must be committed before use (separate migration).
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PAYMENT_PENDING';
ALTER TABLE "Order" ALTER COLUMN "updatedAt" DROP DEFAULT;
