import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { ReportDecorationDialog } from "./report-decoration-dialog";

interface Props {
  decorationId: string;
  decorationName: string;
}

export const DecorationMenu = ({ decorationId, decorationName }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ReportDecorationDialog
          decorationId={decorationId}
          decorationName={decorationName}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
