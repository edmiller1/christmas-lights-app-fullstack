import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeCheck } from "lucide-react";

interface Props {
  verified: boolean;
}

export const VerifiedBadge = ({ verified }: Props) => {
  if (!verified) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <BadgeCheck className="h-8 w-8" stroke="#db2626" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
