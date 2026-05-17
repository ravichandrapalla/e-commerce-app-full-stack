import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";
import PageContainer from "./PageContainer";
import { PageHeader } from "./typography";
import { STORE_NAME } from "../../constants/brand";

type AuthFormCardProps = PropsWithChildren<{
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export default function AuthFormCard({
  title,
  description,
  footer,
  children,
}: AuthFormCardProps) {
  return (
    <PageContainer className="flex min-h-[calc(100vh-4rem)] items-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
          {STORE_NAME}
        </p>
        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <PageHeader
            title={title}
            description={description}
            className="mb-6 sm:mb-8"
            titleAs="h1"
          />
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </div>
    </PageContainer>
  );
}

export function AuthFooterLink({
  label,
  linkText,
  to,
}: {
  label: string;
  linkText: string;
  to: string;
}) {
  return (
    <>
      {label}{" "}
      <Link
        to={to}
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {linkText}
      </Link>
    </>
  );
}
