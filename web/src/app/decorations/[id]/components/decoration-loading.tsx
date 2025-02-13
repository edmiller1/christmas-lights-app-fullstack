import { Skeleton } from "@/components/ui/skeleton";

export const DecorationLoading = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col sm:mx-10 pt-32 md:mx-16 lg:mx-32 xl:mx-52 2xl:mx-72">
        <Skeleton className="h-10 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 my-5 w-1/3" />
          <Skeleton className="h-8 my-32" />
        </div>
      </div>
    </div>
  );
};
