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
  });
  const { register, handleSubmit } = formMethods;

  const registrationMutation = useRegister();
  const navigate = useNavigate();
  const labels = copy.auth.register;

  const onSubmit = async (data: registrationType) => {
    const res = await registrationMutation.mutateAsync(data);
    if (res.status === 201) {
      navigate("/login");
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
        <Button type="submit" className="w-full" disabled={registrationMutation.isPending}>
          {registrationMutation.isPending ? "Creating account…" : labels.submit}
        </Button>
      </form>
    </AuthFormCard>
  );
}
