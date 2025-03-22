import { redirect } from "next/navigation";
import { SignUpForm } from "./components/sign-up-form";
import { getServerUser } from "@/hooks/getServerUser";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const SignUpPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const user = await getServerUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm searchParams={params} />
      </div>
    </div>
  );
};

export default SignUpPage;
