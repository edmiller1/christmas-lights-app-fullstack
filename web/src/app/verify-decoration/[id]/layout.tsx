import { ReactNode } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { MobileNavbar } from "@/components/navbar/mobile-navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface Props {
  children: ReactNode;
}

const Layout = async ({ children }: Props) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-up");
  }

  return (
    <>
      <Navbar />
      {children}
      <MobileNavbar className="md:hidden" />
    </>
  );
};

export default Layout;
