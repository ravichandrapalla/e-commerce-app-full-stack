import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { loginSchema, type LoginFormValues } from "../features/auth/auth.schema";
import { useLogin } from "../features/auth/auth.hooks";
import { setUser } from "../features/auth/auth.slice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import AuthFormCard, { AuthFooterLink } from "../components/ui/AuthFormCard";
import { copy } from "../constants/copy";
import { toAuthUser } from "../types/auth";

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const labels = copy.auth.signIn;
  const redirectTo =
    (location.state as { from?: string } | null)?.from || "/";

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      dispatch(setUser(toAuthUser(res.data.user)));
      navigate(redirectTo, { replace: true });
    } catch (error: unknown) {
      const code =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { data?: { code?: string } } }).response?.data?.code;

      if (code === "EMAIL_NOT_VERIFIED") {
        navigate("/verify-email-pending", {
          replace: true,
          state: { email: data.email },
        });
      }
    }
  };

  return (
    <AuthFormCard
      title={labels.title}
      description={labels.description}
      footer={
        <AuthFooterLink
          label={labels.noAccount}
          linkText={labels.registerLink}
          to="/register"
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="current-password"
            {...register("password")}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Signing in…" : labels.submit}
        </Button>
      </form>
    </AuthFormCard>
  );
}
