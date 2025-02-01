import { redirect } from "next/navigation";
import { OTPForm } from "./components/otp-form";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyOTPPage = async ({ searchParams }: Props) => {
  const supabase = await createClient();

  if (!searchParams.email) {
    redirect("/sign-in");
  }

  const params = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <h1 className="text-3xl">Enter OTP Code</h1>
      <div className="flex flex-col text-center mt-6 text-muted-foreground">
        <OTPForm searchParams={params} />
      </div>
    </div>
  );
};

export default VerifyOTPPage;
