"use client";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DecorationLoading } from "./components/decoration-loading";

const DecorationPage = () => {
  const params = useParams();

  const id = params.id as string;

  const {
    data: decoration,
    isLoading: getDecorationLoading,
    error: getDecorationError,
  } = useQuery({
    queryKey: ["get-decoration"],
    queryFn: async () => {
      return api.decoration.getDecoration(id);
    },
  });

  if (getDecorationError) {
    return <div>Error</div>;
  }

  if (getDecorationLoading) {
    return <DecorationLoading />;
  }

  if (!decoration) {
    return <div>Decoration not found</div>;
  }

  return <div>Decoration</div>;
};

export default DecorationPage;
