import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { DeleteDecorationDialog } from "./delete-decoration-dialog";

interface Props {
  setEditDialogOpen: (open: boolean) => void;
  decorationId: string;
  decorationName: string;
}

export const DecorationUserMenu = ({
  setEditDialogOpen,
  decorationId,
  decorationName,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-10">
        <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
          <span>Edit</span>
        </DropdownMenuItem>
        <DeleteDecorationDialog
          decorationId={decorationId}
          decorationName={decorationName}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
