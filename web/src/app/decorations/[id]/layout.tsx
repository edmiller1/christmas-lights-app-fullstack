import { ReactNode } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { MobileNavbar } from "@/components/navbar/mobile-navbar";
import { Metadata } from "next";
import { api } from "@/api";

interface Props {
  children: ReactNode;
}

// export async function generateMetadata({
//   params,
// }: {
//   params: { id: string };
// }): Promise<Metadata> {
//   try {
//     const decoration = await api.decoration.getDecoration(params.id);

//     return {
//       title: decoration
//         ? `${decoration.name} | Christmas Lights App`
//         : "Decoration | Christmas Lights App",
//     };
//   } catch (error) {
//     // Add error handling to prevent app from breaking
//     console.error("Error generating metadata:", error);
//     return {
//       title: "Decoration | Christmas Lights App",
//     };
//   }
// }

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
      <MobileNavbar />
    </>
  );
};

export default Layout;
