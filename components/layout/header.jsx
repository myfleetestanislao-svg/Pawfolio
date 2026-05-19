import { useState } from "react";
import { useRouter } from "@/lib/router";
import { useStore } from "@/lib/store";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  PawPrint,
  XIcon,
} from "lucide-react";
import { Sidebar } from "./sidebar";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "placeholder:text-muted-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  );
}

function Avatar({ className, ...props }) {
  return <AvatarPrimitive.Root className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)} {...props} />;
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full", className)} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return <AvatarPrimitive.Fallback className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)} {...props} />;
}

function DropdownMenu(props) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

function DropdownMenuTrigger(props) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content sideOffset={sideOffset} className={cn("bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md", className)} {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, ...props }) {
  return <DropdownMenuPrimitive.Item className={cn("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownMenuPrimitive.Separator className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />;
}

function Sheet(props) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger(props) {
  return <SheetPrimitive.Trigger {...props} />;
}

function SheetContent({ className, children, side = "right", ...props }) {
  const sideClass = side === "left" ? "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm" : "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm";

  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <SheetPrimitive.Content className={cn("bg-background fixed z-50 gap-4 shadow-lg", sideClass, className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 hover:opacity-100">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function Header() {
  const router = useRouter();
  const { user, logout, reminders } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const pendingReminders = reminders.filter((r) => r.status === "pending").length;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="p-1.5 bg-primary rounded-lg">
          <PawPrint className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">PawFolio</span>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pets, records, reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {pendingReminders > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {pendingReminders}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 border-b border-border">
              <p className="font-semibold">Notifications</p>
              <p className="text-sm text-muted-foreground">
                You have {pendingReminders} pending reminders
              </p>
            </div>
            <div className="max-h-80 overflow-auto">
              {reminders
                .filter((r) => r.status === "pending")
                .slice(0, 5)
                .map((reminder) => (
                  <DropdownMenuItem key={reminder.id} className="flex flex-col items-start py-3">
                    <p className="font-medium text-sm">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">{reminder.description}</p>
                  </DropdownMenuItem>
                ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center justify-center text-primary cursor-pointer"
              onClick={() => router.push("/reminders")}
            >
              View all reminders
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu - Desktop */}
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto py-1.5 px-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                  <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.fullName?.split(" ")[0] || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
