"use client";

import { useUser } from "@/hooks/useUser";

const DashboardPage = () => {
  const { user } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">👋 Hi {user?.name}</h1>
      <div className="flex flex-1 flex-col gap-4 py-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-full flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </div>
  );
};

export default DashboardPage;
