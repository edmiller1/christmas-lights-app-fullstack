"use client";

import { getDecorationsStats } from "@/api/stats";
import { getUserDecorations } from "@/api/decoration";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Eye, Lightbulb, Star } from "lucide-react";
import { Fragment, useState } from "react";
import { UserDecorationCard } from "../components/user-decoration-card";
import { Button } from "@/components/ui/button";

const DecorationsPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const { data: userDecorations, isLoading: userDecorationsLoading } = useQuery(
    {
      queryKey: ["user-decorations"],
      queryFn: () => getUserDecorations(),
    }
  );

  const {
    data: decorationsStats,
    isLoading: decorationsStatsLoading,
    refetch: refetchDecorationsStats,
  } = useQuery({
    queryKey: ["decorations-stats"],
    queryFn: () => getDecorationsStats(),
  });

  const filteredDecorations = userDecorations?.filter((decoration) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "verified") return decoration.verified;
    if (selectedTab === "pending")
      return decoration.verificationSubmitted && !decoration.verified;
    if (selectedTab === "unverified")
      return !decoration.verificationSubmitted && !decoration.verified;
    return true;
  });

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0 md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Decorations
            </h1>
            <p className="text-muted-foreground">
              Manage your Christmas decorations
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {decorationsStatsLoading ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <div className="flex items-center mt-1 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Skeleton key={star} className="h-3 w-3 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-36 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            </>
          ) : decorationsStats ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Decorations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {decorationsStats.totalDecorations}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {decorationsStats.verifiedDecorations} verified
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {decorationsStats.totalViews}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From all decorations
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Number(decorationsStats.averageRating)?.toFixed(1) ||
                      "0.0"}
                  </div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <=
                          Math.round(Number(decorationsStats.averageRating))
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Most Popular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {decorationsStats.mostViewedDecoration ? (
                    <>
                      <div
                        className="text-2xl font-bold truncate"
                        title={decorationsStats.mostViewedDecoration.name}
                      >
                        {decorationsStats.mostViewedDecoration.name.length > 15
                          ? `${decorationsStats.mostViewedDecoration.name.substring(
                              0,
                              15
                            )}...`
                          : decorationsStats.mostViewedDecoration.name}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />{" "}
                        {decorationsStats.mostViewedDecoration.viewCount} views
                      </p>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No views yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            // Fallback for when stats failed to load
            <Card className="md:col-span-2 lg:col-span-4">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-medium">Failed to load statistics</h3>
                  <Button
                    variant="outline"
                    className="text-sm text-muted-foreground mt-1"
                    onClick={() => refetchDecorationsStats()}
                  >
                    Try again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs for filtering */}
        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="unverified">Unverified</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Decoration Grid */}
        {userDecorationsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredDecorations && filteredDecorations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDecorations.map((decoration) => (
              <Fragment key={decoration.id}>
                <UserDecorationCard decoration={decoration} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Lightbulb className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No decorations found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {selectedTab === "all"
                ? "You haven't added any decorations yet."
                : selectedTab === "verified"
                ? "You don't have any verified decorations."
                : selectedTab === "pending"
                ? "You don't have any pending verifications."
                : "You don't have any unverified decorations."}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DecorationsPage;
