import { SignInForm } from "./components/sign-in-form";
import { redirect } from "next/navigation";
import { getServerUser } from "@/hooks/getServerUser";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const SignInPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const user = await getServerUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignInForm searchParams={params} />
      </div>
    </div>
  );
};

export default SignInPage;
