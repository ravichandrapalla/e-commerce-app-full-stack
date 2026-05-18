import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../features/auth/auth.hooks";
import AuthFormCard from "../components/ui/AuthFormCard";
import { Button } from "../components/ui/button";
import { copy } from "../constants/copy";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const verifyEmail = useVerifyEmail();
  const labels = copy.auth.verifyEmail;
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;

    verifyEmail.mutate(token, {
      onSuccess: () => setDone(true),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per token in URL
  }, [token]);

  const errorMessage =
    verifyEmail.error && "response" in verifyEmail.error
      ? (verifyEmail.error as { response?: { data?: { message?: string } } }).response
          ?.data?.message
      : null;

  return (
    <AuthFormCard
      title={done ? labels.successTitle : labels.title}
      description={
        done
          ? labels.successDescription
          : token
            ? labels.verifying
            : labels.missingToken
      }
      footer={
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {labels.backToSignIn}
        </Link>
      }
    >
      {!token && (
        <Button asChild className="w-full">
          <Link to="/verify-email-pending">{labels.resendCta}</Link>
        </Button>
      )}

      {verifyEmail.isPending && (
        <p className="text-center text-sm text-muted-foreground">{labels.verifying}</p>
      )}

      {verifyEmail.isError && (
        <div className="space-y-4">
          <p className="text-sm text-red-600">{errorMessage || labels.error}</p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/verify-email-pending">{labels.resendCta}</Link>
          </Button>
        </div>
      )}

      {done && (
        <Button asChild className="w-full">
          <Link to="/login">{labels.signInCta}</Link>
        </Button>
      )}
    </AuthFormCard>
  );
}
