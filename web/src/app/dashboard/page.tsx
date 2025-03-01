"use client";

import { useUser } from "@/hooks/useUser";

const DashboardPage = () => {
  const { user } = useUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">👋 Hi {user?.name}</h1>
    </div>
  );
};

export default DashboardPage;
