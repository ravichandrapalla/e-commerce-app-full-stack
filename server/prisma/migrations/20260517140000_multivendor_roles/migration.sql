-- Multivendor marketplace: ADMIN, SELLER, BUYER + product seller ownership

CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'SELLER', 'BUYER');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User"
ALTER COLUMN "role" TYPE "Role_new"
USING (
  CASE "role"::text
    WHEN 'CUSTOMER' THEN 'BUYER'::"Role_new"
    WHEN 'ADMIN' THEN 'ADMIN'::"Role_new"
    ELSE 'BUYER'::"Role_new"
  END
);

DROP TYPE "Role";

ALTER TYPE "Role_new" RENAME TO "Role";

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'BUYER';

ALTER TABLE "Product" ADD COLUMN "sellerId" TEXT;

UPDATE "Product"
SET "sellerId" = (
  SELECT "id" FROM "User"
  WHERE "role" = 'ADMIN'
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "sellerId" IS NULL;

UPDATE "Product"
SET "sellerId" = (
  SELECT "id" FROM "User"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
WHERE "sellerId" IS NULL;

ALTER TABLE "Product" ALTER COLUMN "sellerId" SET NOT NULL;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "Product_sellerId_idx" ON "Product"("sellerId");
