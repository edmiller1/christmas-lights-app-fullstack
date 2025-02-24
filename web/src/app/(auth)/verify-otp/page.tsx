import { redirect } from "next/navigation";
import { OTPForm } from "./components/otp-form";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyOTPPage = async ({ searchParams }: Props) => {
  if (!searchParams.email) {
    redirect("/sign-in");
  }

  const params = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <h1 className="text-3xl">Enter OTP Code</h1>
      <div className="flex flex-col text-center mt-6">
        <OTPForm searchParams={params} />
      </div>
    </div>
  );
};

export default VerifyOTPPage;
