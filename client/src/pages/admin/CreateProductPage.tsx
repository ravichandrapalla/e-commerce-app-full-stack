import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProduct } from "../../features/product/product.hooks";
import { useCategories } from "../../features/category/category.hooks";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number(),
  stock: z.coerce.number(),
  categoryId: z.string(),
  image: z.any(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateProductPage() {
  const createMutation = useCreateProduct();

  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
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

      toast.success("Product created");

      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* TITLE */}
        <div>
          <input
            {...register("title")}
            placeholder="Product title"
            className="w-full border rounded-lg px-4 py-3"
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border rounded-lg px-4 py-3 h-32"
          />
        </div>

        {/* PRICE */}
        <div>
          <input
            type="number"
            {...register("price")}
            placeholder="Price"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* STOCK */}
        <div>
          <input
            type="number"
            {...register("stock")}
            placeholder="Stock"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <select
            {...register("categoryId")}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="">Select Category</option>

            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE */}
        <div>
          <input type="file" accept="image/*" {...register("image")} />
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-5 py-3 rounded-lg bg-black text-white"
        >
          {createMutation.isPending ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
