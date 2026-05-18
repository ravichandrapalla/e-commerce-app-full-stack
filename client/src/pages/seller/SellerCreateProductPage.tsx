import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useCreateProduct } from "../../features/product/product.hooks";
import { useCategories } from "../../features/category/category.hooks";
import { toast } from "sonner";
import {
  createProductFormSchema,
  type CreateProductFormInput,
  type CreateProductFormValues,
} from "../../lib/schemas/createProductForm";
import { IMAGE_UPLOAD_ACCEPT, IMAGE_UPLOAD_HINT } from "../../lib/imageUploadValidation";

export default function SellerCreateProductPage() {
  const createMutation = useCreateProduct();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductFormSchema),
  });

  const onSubmit = async (data: CreateProductFormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("categoryId", data.categoryId);
    formData.append("image", data.image[0]);

    await createMutation.mutateAsync(formData);
    toast.success("Product submitted for admin approval");
    reset();
  };

  return (
    <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm">
      <Link to="/seller/products" className="text-sm text-slate-500 hover:text-slate-900">
        Back to products
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

        <div>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="h-32 w-full rounded-lg border px-4 py-3"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            {...register("price")}
            placeholder="Price (INR)"
            className="w-full rounded-lg border px-4 py-3"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            {...register("stock")}
            placeholder="Stock quantity"
            className="w-full rounded-lg border px-4 py-3"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <select {...register("categoryId")} className="w-full rounded-lg border px-4 py-3">
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="product-image" className="mb-1 block text-sm font-medium text-slate-700">
            Product image <span className="text-red-500">*</span>
          </label>
          <input
            id="product-image"
            type="file"
            accept={IMAGE_UPLOAD_ACCEPT}
            {...register("image")}
            className="w-full text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">{IMAGE_UPLOAD_HINT}</p>
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image.message as string}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-emerald-700 px-5 py-3 text-white disabled:opacity-60"
        >
          {createMutation.isPending ? "Publishing..." : "Publish product"}
        </button>
      </form>
    </div>
  );
}
