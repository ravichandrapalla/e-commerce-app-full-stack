import { useState } from "react";
import {
  useApproveProduct,
  useBulkApproveProducts,
  usePendingApprovals,
  useRejectProduct,
} from "../../features/admin/admin.hooks";
import { resolveProductImageUrl } from "../../lib/productImage";
import { SELLER_REPUTATION_BULK_APPROVE_THRESHOLD } from "../../constants/sellerReputation";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

export default function AdminProductApprovalsPage() {
  const { data, isLoading } = usePendingApprovals();
  const approve = useApproveProduct();
  const reject = useRejectProduct();
  const bulkApprove = useBulkApproveProducts();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pending = data?.products ?? [];
  const trustedSellers = data?.sellersEligibleForBulk ?? [];

  if (isLoading) {
    return <>Loading approval queue…</>;
  }

  const handleReject = async (productId: string) => {
    await reject.mutateAsync({ productId, reason: rejectReason });
    setRejectingId(null);
    setRejectReason("");
  };

  return (
    <>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Seller listing approvals</h1>
            <p className="mt-1 text-sm text-slate-600">
              Review seller submissions. Trusted sellers (reputation ≥
              {SELLER_REPUTATION_BULK_APPROVE_THRESHOLD}) can be bulk-approved.
            </p>
          </div>
          <button
            type="button"
            disabled={bulkApprove.isPending || trustedSellers.length === 0}
            onClick={() => bulkApprove.mutate()}
            className="inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {bulkApprove.isPending
              ? "Approving…"
              : `Bulk approve trusted (${trustedSellers.length} sellers)`}
          </button>
        </header>

        {trustedSellers.length > 0 && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">High-reputation sellers with pending listings</p>
            <ul className="mt-2 space-y-1">
              {trustedSellers.map((seller) => (
                <li key={seller.id}>
                  {seller.name} — reputation {seller.sellerReputation},{" "}
                  {seller._count.products} pending
                </li>
              ))}
            </ul>
          </div>
        )}

        {pending.length === 0 ? (
          <p className="rounded-md border bg-white p-8 text-center text-sm text-slate-500">
            No listings waiting for approval.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-md border bg-white p-4 shadow-sm lg:flex-row"
              >
                <img
                  src={resolveProductImageUrl(product.imageUrl)}
                  alt=""
                  className="h-28 w-28 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{product.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{product.description}</p>
                  <p className="mt-2 text-sm">
                    Seller: <strong>{product.seller.name}</strong> ({product.seller.email}) —
                    reputation {product.seller.sellerReputation}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatCurrency(product.price)} · {product.category?.name} · stock{" "}
                    {product.stock}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                  <button
                    type="button"
                    disabled={approve.isPending}
                    onClick={() => approve.mutate(product.id)}
                    className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingId(product.id);
                      setRejectReason("");
                    }}
                    className="rounded-md border px-4 py-2 text-sm font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Reject listing</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Optional reason for the seller"
              className="mt-3 h-28 w-full rounded-md border px-3 py-2 text-sm"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={reject.isPending}
                onClick={() => void handleReject(rejectingId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Confirm reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}