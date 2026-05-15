import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { loginSchema } from "../features/auth/auth.schema";
import { useLogin } from "../features/auth/auth.hooks";
import { setUser } from "../features/auth/auth.slice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    const res = await loginMutation.mutateAsync(data);
    dispatch(setUser(res.data.user));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
      <Input {...register("email")} placeholder="Email" />
      <Input {...register("password")} type="password" placeholder="Password" />
      <Button type="submit">Login</Button>
      <p>
        New User?{" "}
        <Link to="/register" className="underline cursor-pointer">
          Register here
        </Link>
      </p>
    </form>
  );
}
