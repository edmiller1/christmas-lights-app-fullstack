import { ReactNode } from "react";
import { Navbar } from "@/components/navbar/navbar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar className="hidden md:block" />
      {children}
    </>
  );
};

export default Layout;
