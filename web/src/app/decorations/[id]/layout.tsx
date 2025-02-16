import { ReactNode } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { MobileNavbar } from "@/components/navbar/mobile-navbar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar className="hidden md:block" />
      {children}
      <MobileNavbar />
    </>
  );
};

export default Layout;
