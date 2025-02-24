"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getDatabaseSyncStatus } from "@/api/auth";

const FormSchema = z.object({
  pin: z
    .string()
    .length(6, { message: "Code must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "Code must contain only numbers" }),
});

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const OTPForm = ({ searchParams }: Props) => {
  const supabase = createClient();
  const router = useRouter();

  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setOtpLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email: searchParams.email as string,
      token: values.pin,
      type: "email",
    });

    if (error) {
      toast.error(
        "Something went wrong. Please check your code and try again."
      );
      setOtpLoading(false);
    } else {
      const response = await getDatabaseSyncStatus(
        session?.access_token as string
      );

      setOtpLoading(false);

      if (response.isSynced) {
        router.push(`${response.redirectUrl}`);
      }
    }
  }

  const requestNewCode = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: searchParams.email as string,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      toast.error("Failed to get new code. Please try again.");
    }
  };

  return (
    <>
      {otpLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 text-black dark:text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p>Verifying...</p>
        </div>
      ) : (
        <>
          <p>
            Enter the 6-digit sent to{" "}
            <span className="font-bold text-black dark:text-white">
              {searchParams.email}
            </span>
            .
          </p>
          <p>
            Didn&apos;t get a code?{" "}
            <span
              onClick={requestNewCode}
              role="button"
              className="text-primary font-semibold hover:underline"
            >
              Request a new code
            </span>
          </p>
          <p className="text-sm mt-5">
            Note: You can only request a code once every 60 seconds. Codes are
            only valid for 1 hour.
          </p>
          <div className="flex items-center justify-center mt-10">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSeparator />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <div className="flex items-start mt-6">
                <Button onClick={() => form.reset()}>Clear</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
