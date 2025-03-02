import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeChange } from "@/app/dashboard/components/theme-change";
import { useSignOut } from "@/hooks/use-signout";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  user: User;
}

export const UserMenu = ({ user }: Props) => {
  const { signOut, isLoading } = useSignOut();

  if (isLoading) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="w-9 h-9">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback>{user.name?.[0] ?? user.email[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center space-x-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>{user.name?.[0] ?? user.email[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name ?? ""}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/account-settings">
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
          </Link>
          <ThemeChange />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
