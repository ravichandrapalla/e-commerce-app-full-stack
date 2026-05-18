import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import AuthFormCard from "../components/ui/AuthFormCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useResendVerification } from "../features/auth/auth.hooks";
import { copy } from "../constants/copy";

export default function VerifyEmailPendingPage() {
  const location = useLocation();
  const initialEmail =
    (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);
  const resend = useResendVerification();
  const labels = copy.auth.verifyPending;

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }

    try {
      await resend.mutateAsync(email.trim());
      toast.success(labels.resendSuccess);
    } catch {
      /* axios interceptor */
    }
  };

  return (
    <AuthFormCard
      title={labels.title}
      description={labels.description}
      footer={
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {labels.backToSignIn}
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>
        <Button
          type="button"
          className="w-full"
          disabled={resend.isPending}
          onClick={handleResend}
        >
          {resend.isPending ? labels.sending : labels.resend}
        </Button>
      </div>
    </AuthFormCard>
  );
}
