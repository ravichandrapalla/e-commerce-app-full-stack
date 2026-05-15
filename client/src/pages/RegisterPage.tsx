import { useForm } from "react-hook-form";
import { Input } from "../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type registrationType,
} from "../features/auth/auth.schema";
import { Button } from "../components/ui/button";
import { useRegister } from "../features/auth/auth.hooks";

export default function RegisterPage() {
  const formMethods = useForm({
    resolver: zodResolver(registerSchema),
  });
  const { register, handleSubmit } = formMethods;

  const registrationMutation = useRegister();
  const onSubmit = async (data: registrationType) => {
    const res = await registrationMutation.mutateAsync(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
      <Input {...register("name")} placeholder="Name" />
      <Input {...register("email")} placeholder="Email" />
      <Input {...register("password")} type="password" placeholder="Password" />
      <Button type="submit">Register</Button>
    </form>
  );
}
