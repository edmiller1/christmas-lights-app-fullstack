"use client";

import { useUser } from "@/hooks/useUser";
import { DashboardStatsCards } from "./components/dashboard-stats-cards";
import { LottieAnimation } from "@/components/lottie-animation";
import christmasLoader from "../../lottie/christmas-loader.json";
import { YearlyStatsChart } from "./components/yearly-stats-chart";

const DashboardPage = () => {
  const { user, loading: userLoading } = useUser();

  if (userLoading) {
    return (
      <div className="min-h-screen md:min-h-[90vh] flex justify-center items-center">
        <LottieAnimation animationData={christmasLoader} autoplay loop />
      </div>
    );
  }

  return (
    <div className="py-6 mb-8">
      <h1 className="text-3xl font-bold tracking-tight">👋 Hi {user?.name}</h1>
      <DashboardStatsCards />
      <YearlyStatsChart />
    </div>
  );
};

export default DashboardPage;
