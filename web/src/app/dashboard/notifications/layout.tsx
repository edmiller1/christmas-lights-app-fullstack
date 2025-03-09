import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="flex min-h-[85vh] w-full">{children}</div>;
};

export default Layout;
