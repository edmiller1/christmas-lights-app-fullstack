"use client";

import { getDashboardStats } from "@/api/auth/dashboardStats";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { Award, Eye, Star, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const { user } = useUser();

  const { data: dashboardStats, isLoading: dashboardStatsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">👋 Hi {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* Average Views Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-2 top-2 text-muted-foreground">
            <Eye className="h-16 w-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Total Views
              </span>
              <div className="mt-2 flex items-baseline">
                {dashboardStatsLoading ? (
                  <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  <span className="text-3xl font-bold">
                    {dashboardStats?.totalViews.toLocaleString() || 0}
                  </span>
                )}
              </div>
              {!dashboardStatsLoading &&
                dashboardStats?.viewsChange !== undefined && (
                  <div className="mt-1 flex items-center text-xs">
                    <span
                      className={
                        dashboardStats.viewsChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      <TrendingUp
                        className={`h-3 w-3 inline mr-1 ${
                          dashboardStats.viewsChange < 0 ? "rotate-180" : ""
                        }`}
                      />
                      {Math.abs(dashboardStats.viewsChange)}% from last month
                    </span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Average Rating Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-2 top-2 text-muted-foreground">
            <Star className="h-16 w-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Average Rating
              </span>
              <div className="mt-2 flex items-baseline">
                {dashboardStatsLoading ? (
                  <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    <span className="text-3xl font-bold">
                      {Number(dashboardStats?.averageRating)?.toFixed(1) || 0}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      / 5
                    </span>
                  </>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                From{" "}
                {dashboardStatsLoading
                  ? "..."
                  : dashboardStats?.totalRatings || 0}{" "}
                {dashboardStats?.totalRatings === 1 ? "rating" : "ratings"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Decorations Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-2 top-2 text-muted-foreground">
            <Award className="h-16 w-16" />
          </div>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Total Decorations
              </span>
              <div className="mt-2 flex items-baseline">
                {dashboardStatsLoading ? (
                  <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  <span className="text-3xl font-bold">
                    {dashboardStats?.totalDecorations || 0}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {!dashboardStatsLoading &&
                  dashboardStats?.verifiedDecorations !== undefined && (
                    <>{dashboardStats.verifiedDecorations} verified</>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
