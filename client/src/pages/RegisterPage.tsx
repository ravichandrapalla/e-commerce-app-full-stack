import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type registrationType,
} from "../features/auth/auth.schema";
import { Button } from "../components/ui/button";
import { useRegister } from "../features/auth/auth.hooks";
import { useNavigate, Link } from "react-router-dom";
import AuthFormCard from "../components/ui/AuthFormCard";
import { copy } from "../constants/copy";

export default function RegisterPage() {
  const formMethods = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: "buyer" as const,
    },
  });
  const { register, handleSubmit, watch } = formMethods;
  const accountType = watch("accountType");

  const registrationMutation = useRegister();
  const navigate = useNavigate();
  const labels = copy.auth.register;

  const onSubmit = async (data: registrationType) => {
    const res = await registrationMutation.mutateAsync(data);
    if (res.status === 201) {
      navigate("/verify-email-pending", {
        state: { email: data.email },
      });
    }
  };

  return (
    <AuthFormCard
      title={labels.title}
      description={labels.description}
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <Input id="name" autoComplete="name" {...register("name")} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </div>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">Account type</legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-[:checked]:border-slate-950 has-[:checked]:bg-slate-50">
            <input type="radio" value="buyer" className="mt-1" {...register("accountType")} />
            <span className="text-sm font-medium">{labels.buyerLabel}</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-[:checked]:border-emerald-700 has-[:checked]:bg-emerald-50">
            <input type="radio" value="seller" className="mt-1" {...register("accountType")} />
            <span className="text-sm font-medium">{labels.sellerLabel}</span>
          </label>
        </fieldset>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </div>
        {accountType === "seller" && (
          <p className="text-xs text-slate-500">
            Seller accounts manage products and orders in the seller hub — not the shopping cart.
          </p>
        )}
        <Button type="submit" className="w-full" disabled={registrationMutation.isPending}>
          {registrationMutation.isPending ? "Creating account…" : labels.submit}
        </Button>
      </form>
    </AuthFormCard>
  );
}
