import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import Link from "next/link";

interface Props {
  verified: boolean;
  verificationSubmitted: boolean;
  decorationId: string;
}

export const VerifiedAlert = ({
  decorationId,
  verified,
  verificationSubmitted,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        {!verified || verificationSubmitted ? (
          <Button variant="ghost" size="icon" className="relative">
            <BadgeAlert className="h-[1.2rem] w-[1.2rem]" stroke="#db2626" />
          </Button>
        ) : (
          <Button variant="ghost">
            <BadgeCheck className="h-8 w-8" stroke="#db2626" />
          </Button>
        )}
      </PopoverTrigger>
      {!verified && !verificationSubmitted ? (
        <PopoverContent align="center" className="text-sm">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-2">
              Your decoration is not verified. We make sure all decorations are
              verified for when users visit decorations, they can guarantee that
              the decoration actually exists.
            </div>
            <div className="p-2">
              Unverified decorations are not publicly available.
            </div>
            <Separator />
            <div className="p-2">
              You can submit your decoration for verification{" "}
              <Link
                href={`/verify-decoration/${decorationId}`}
                className="underline text-primary"
              >
                here.
              </Link>
            </div>
          </div>
        </PopoverContent>
      ) : (
        <PopoverContent align="center" className="text-sm">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-2">
              Your decoration is not verified. We make sure all decorations are
              verified for when users visit decorations, they can guarantee that
              the decoration actually exists.
            </div>
            <div className="p-2">
              A submission for verification has been received for this
              decoration.
            </div>
            <Separator />
            <div className="p-2">
              Verification request can take up to 2 days to be resolved.
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
