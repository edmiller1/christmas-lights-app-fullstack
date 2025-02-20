import Link from "next/link";
import { Button } from "./ui/button";

export const NotFound = () => {
  return (
    <main className="grid min-h-[90vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium sm:text-xl/8">
          Whoops! It looks like Santa&apos;s elves have accidentally misplaced
          the page you were looking for!
        </p>
        <div className="mt-10">
          <Link href="/explore">
            <Button variant="default">Go back home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
