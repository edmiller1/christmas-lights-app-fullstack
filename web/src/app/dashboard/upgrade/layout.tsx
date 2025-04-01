import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="container max-w-4xl py-6">{children}</div>;
};

export default Layout;
