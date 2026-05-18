-- CreateEnum
CREATE TYPE "ProductApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "sellerReputation" INTEGER NOT NULL DEFAULT 50;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "approvalStatus" "ProductApprovalStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Product" ADD COLUMN "rejectionReason" TEXT;
ALTER TABLE "Product" ADD COLUMN "reviewedAt" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN "reviewedById" TEXT;

-- Existing listings were live before moderation — mark them approved
UPDATE "Product" SET "approvalStatus" = 'APPROVED' WHERE "approvalStatus" = 'PENDING';

-- AlterTable (default isPublished false for new rows; keep live catalog visible)
ALTER TABLE "Product" ALTER COLUMN "isPublished" SET DEFAULT false;
UPDATE "Product" SET "isPublished" = true WHERE "approvalStatus" = 'APPROVED';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Product_approvalStatus_idx" ON "Product"("approvalStatus");
