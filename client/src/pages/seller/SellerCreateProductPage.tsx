import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useCreateProduct } from "../../features/product/product.hooks";
import { useCategories } from "../../features/category/category.hooks";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  categoryId: z.string(),
  image: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof schema>;
type FormInputValues = z.input<typeof schema>;

export default function SellerCreateProductPage() {
  const createMutation = useCreateProduct();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("categoryId", data.categoryId);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    await createMutation.mutateAsync(formData);
    toast.success("Product listed on the marketplace");
    reset();
  };

  return (
    <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
      <Link to="/seller/products" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to products
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Add product</h1>
      <p className="mt-1 text-sm text-slate-600">
        New listings appear in the public catalog once published.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <input
            {...register("title")}
            placeholder="Product title"
            className="w-full rounded-lg border px-4 py-3"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <textarea
          {...register("description")}
          placeholder="Description"
          className="h-32 w-full rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          {...register("price")}
          placeholder="Price (INR)"
          className="w-full rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          {...register("stock")}
          placeholder="Stock quantity"
          className="w-full rounded-lg border px-4 py-3"
        />

        <select {...register("categoryId")} className="w-full rounded-lg border px-4 py-3">
          <option value="">Select category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" {...register("image")} />

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-emerald-700 px-5 py-3 text-white disabled:opacity-60"
        >
          {createMutation.isPending ? "Publishing…" : "Publish product"}
        </button>
      </form>
    </div>
  );
}
