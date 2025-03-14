"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import {
  Loader2,
  Calendar,
  TrendingUp,
  Eye,
  Star,
  Download,
  Share2,
} from "lucide-react";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { getYearlyStats } from "@/api/stats";

const currentYear = new Date().getFullYear();

// Last 5 years
const availableYears = Array.from({ length: 5 }, (_, i) =>
  (currentYear - i).toString()
);

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-md shadow-md p-3 text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <div className="space-y-1">
          <p className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span className="text-muted-foreground">Views:</span>
            <span className="ml-1 font-medium text-foreground">
              {payload[0].value}
            </span>
          </p>
          {payload.length > 1 && (
            <p className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
              <span className="text-muted-foreground">Ratings:</span>
              <span className="ml-1 font-medium text-foreground">
                {payload[1].value}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const YearlyStatsChart = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [chartType, setChartType] = useState("line");

  const { data: yearlyStats, isLoading: yearlyStatsLoading } = useQuery({
    queryKey: ["yearly-stats", selectedYear],
    queryFn: () => getYearlyStats(selectedYear),
  });

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Seasonal Performance</CardTitle>
            <CardDescription>
              Views and ratings during the {selectedYear} holiday season
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-col items-center space-x-2 md:flex-row space-y-2 md:space-y-0">
          <Tabs
            defaultValue="line"
            value={chartType}
            onValueChange={(value) => setChartType(value as "line" | "bar")}
            className="w-[180px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {yearlyStats && !yearlyStatsLoading && (
        <div className="px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <div className="bg-muted/40 rounded-lg p-3 flex items-center">
            <Eye className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Total Views</p>
              <p className="text-xl font-semibold">
                {yearlyStats.totalViews.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center">
            <Star className="h-5 w-5 text-[#f1bc14] mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Total Ratings</p>
              <p className="text-xl font-semibold">
                {yearlyStats.totalRatings.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-xs text-muted-foreground">Peak Day</p>
              <p className="text-xl font-semibold">
                {yearlyStats.peakDay || "N/A"}
              </p>
              {yearlyStats.peakDay && (
                <p className="text-xs text-muted-foreground">
                  {yearlyStats.peakViews} views
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <CardContent>
        {yearlyStatsLoading ? (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !yearlyStats || yearlyStats.stats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-3" />
            <p className="text-center">No data available for {selectedYear}</p>
            <p className="text-center text-sm mt-1">
              {parseInt(selectedYear) > currentYear
                ? "Data will appear once the season begins"
                : "Add decorations to see statistics"}
            </p>
          </div>
        ) : (
          <div className="h-80 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={yearlyStats.stats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="#de3d33"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#de3d33" }}
                    activeDot={{ r: 5, stroke: "#de3d33", strokeWidth: 1 }}
                    name="Views"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ratings"
                    stroke="#1e7452"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#1e7452" }}
                    activeDot={{ r: 5, stroke: "#1e7452", strokeWidth: 1 }}
                    name="New Ratings"
                  />
                </LineChart>
              ) : (
                <BarChart data={yearlyStats.stats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#a1a1aa"
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="views"
                    fill="#de3d33"
                    name="Views"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="ratings"
                    fill="#1e7452"
                    name="Ratings"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>

      {yearlyStats && !yearlyStatsLoading && (
        <CardFooter className="flex justify-between items-center">
          <Badge variant="outline" className="px-3 py-1">
            {yearlyStats.totalDecorations}{" "}
            {yearlyStats.totalDecorations === 1 ? "decoration" : "decorations"}{" "}
            in {selectedYear}
          </Badge>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Share2 className="h-3.5 w-3.5 mr-1" />
              Share
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
