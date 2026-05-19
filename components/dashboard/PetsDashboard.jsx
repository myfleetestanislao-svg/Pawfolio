import { useState } from "react";
import { Link } from "@/lib/router";
import { useStore } from "@/lib/store";
import { AppLayout } from "@/components/layout/app-layout";
import { AddPetModal } from "@/components/pets/modal/AddPetModal";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  PawPrint,
  Plus,
  Search,
  Calendar,
  Weight,
  ChevronRight,
  ChevronDownIcon,
  CheckIcon,
  Dog,
  Cat,
  Bird,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Syringe,
  LayoutGrid,
  List,
} from "lucide-react";
import { calculateAge } from "@/lib/sample-data";

// ─── Primitive wrappers ───────────────────────────────────────────────────────

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 px-3 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-6", className)} {...props} />;
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
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        warning:
          "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        danger:
          "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        success:
          "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

function Select(props) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectValue(props) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground flex h-9 w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// ─── Species config ───────────────────────────────────────────────────────────

const speciesIcons = {
  Dog: Dog,
  Cat: Cat,
  Bird: Bird,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-sm flex items-center gap-2.5">
      <div
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-md shrink-0",
          colorClass
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Reminder Item ────────────────────────────────────────────────────────────

const urgencyConfig = {
  overdue:  { dot: "bg-red-500",   badge: "danger",   icon: AlertTriangle },
  soon:     { dot: "bg-amber-500", badge: "warning",  icon: Clock         },
  upcoming: { dot: "bg-primary",   badge: "success",  icon: CheckCircle2  },
};

function ReminderItem({ petName, text, when, urgency }) {
  const config = urgencyConfig[urgency] ?? urgencyConfig.upcoming;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className={cn("mt-1 w-2 h-2 rounded-full shrink-0", config.dot)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">{text}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{when}</p>
      </div>
      <Badge variant={config.badge} className="shrink-0 text-[10px]">
        {petName}
      </Badge>
    </div>
  );
}

// ─── Pet Card (grid view) ─────────────────────────────────────────────────────

function PetCardGrid({ pet, stats }) {
  const SpeciesIcon = speciesIcons[pet.species] || PawPrint;

  return (
    <Card className="border-border hover:border-primary/50 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={pet.photo} alt={pet.name} />
              <AvatarFallback className="text-base bg-primary text-primary-foreground">
                {pet.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-card border border-border rounded-full">
              <SpeciesIcon className="h-3 w-3 text-primary" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground leading-tight truncate">
              {pet.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{pet.breed}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {calculateAge(pet.birthDate)}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Weight className="h-3 w-3" />
                {pet.weight} {pet.weightUnit}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <div className="p-1.5 bg-muted/50 rounded-lg text-center">
            <p className="text-sm font-bold text-foreground">{stats.vaccinations}</p>
            <p className="text-[10px] text-muted-foreground">Vaccines</p>
          </div>
          <div className="p-1.5 bg-muted/50 rounded-lg text-center">
            <p className="text-sm font-bold text-foreground">{stats.allergies}</p>
            <p className="text-[10px] text-muted-foreground">Allergies</p>
          </div>
          <div className="p-1.5 bg-muted/50 rounded-lg text-center">
            <p className="text-sm font-bold text-foreground">{stats.medications}</p>
            <p className="text-[10px] text-muted-foreground">Meds</p>
          </div>
        </div>

        <Link href={`/pets/${pet.id}`} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            View Profile
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── Pet Row (list view) ──────────────────────────────────────────────────────

function PetCardList({ pet, stats }) {
  const SpeciesIcon = speciesIcons[pet.species] || PawPrint;

  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/50 transition-colors group">
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 border-2 border-primary/20">
          <AvatarImage src={pet.photo} alt={pet.name} />
          <AvatarFallback className="text-base bg-primary text-primary-foreground">
            {pet.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-card border border-border rounded-full">
          <SpeciesIcon className="h-3 w-3 text-primary" />
        </div>
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-foreground truncate">{pet.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{pet.breed}</p>
      </div>

      {/* Age + weight */}
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {calculateAge(pet.birthDate)}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Weight className="h-3 w-3" />
          {pet.weight} {pet.weightUnit}
        </span>
      </div>

      {/* Stats pills */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <span className="text-xs bg-muted/60 rounded-md px-2 py-1 text-foreground font-medium">
          {stats.vaccinations} <span className="text-muted-foreground font-normal">Vaccines</span>
        </span>
        <span className="text-xs bg-muted/60 rounded-md px-2 py-1 text-foreground font-medium">
          {stats.allergies} <span className="text-muted-foreground font-normal">Allergies</span>
        </span>
        <span className="text-xs bg-muted/60 rounded-md px-2 py-1 text-foreground font-medium">
          {stats.medications} <span className="text-muted-foreground font-normal">Meds</span>
        </span>
      </div>

      {/* Action */}
      <Link href={`/pets/${pet.id}`} className="shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          View Profile
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function PetsDashboard() {
  const { pets, vaccinations, allergies, medications } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [viewMode, setViewMode] = useState("card"); // "card" | "list"

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies =
      speciesFilter === "all" || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const getPetStats = (petId) => ({
    vaccinations: vaccinations.filter((v) => v.petId === petId).length,
    allergies:    allergies.filter((a) => a.petId === petId).length,
    medications:  medications.filter((m) => m.petId === petId && m.ongoing).length,
  });

  const upcomingReminders = [
    ...vaccinations
      .filter((v) => v.nextDueDate)
      .map((v) => {
        const pet = pets.find((p) => p.id === v.petId);
        const daysUntil = Math.ceil(
          (new Date(v.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        const urgency = daysUntil < 0 ? "overdue" : daysUntil <= 7 ? "soon" : "upcoming";
        const when =
          daysUntil < 0    ? `${Math.abs(daysUntil)} day(s) overdue`
          : daysUntil === 0 ? "Due today"
          : `In ${daysUntil} day(s)`;
        return { petName: pet?.name ?? "—", text: `${v.name} vaccine`, when, urgency };
      }),
    ...medications
      .filter((m) => m.ongoing && m.nextDoseDate)
      .map((m) => {
        const pet = pets.find((p) => p.id === m.petId);
        const daysUntil = Math.ceil(
          (new Date(m.nextDoseDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        const urgency = daysUntil < 0 ? "overdue" : daysUntil <= 7 ? "soon" : "upcoming";
        const when =
          daysUntil < 0    ? `${Math.abs(daysUntil)} day(s) overdue`
          : daysUntil === 0 ? "Due today"
          : `In ${daysUntil} day(s)`;
        return { petName: pet?.name ?? "—", text: `${m.name} medication`, when, urgency };
      }),
  ].sort((a, b) => {
    const order = { overdue: 0, soon: 1, upcoming: 2 };
    return order[a.urgency] - order[b.urgency];
  });

  const overdueCount = upcomingReminders.filter((r) => r.urgency === "overdue").length;
  const soonCount    = upcomingReminders.filter((r) => r.urgency === "soon").length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Pets</h1>
            <p className="text-muted-foreground">Manage your pet profiles and health information</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AddPetModal>
              <Button>
                <Plus className="h-4 w-4" />
                Add Pet
              </Button>
            </AddPetModal>
            <Button variant="outline">
              <FileText className="h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <StatCard
            icon={PawPrint}
            label="Total Pets"
            value={pets.length}
            colorClass="bg-primary/10 text-primary"
          />
          <StatCard
            icon={Syringe}
            label="Vaccinations"
            value={vaccinations.length}
            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <StatCard
            icon={Clock}
            label="Due This Week"
            value={soonCount}
            colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
          <StatCard
            icon={AlertTriangle}
            label="Overdue"
            value={overdueCount}
            colorClass={
              overdueCount > 0
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-muted text-muted-foreground"
            }
          />
        </div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 flex-1 min-h-0">

          {/* ── Pets section ── */}
          <div className="flex flex-col gap-4 min-h-0 overflow-hidden">

            {/* Search + filter + view toggle */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search pets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  <SelectItem value="Dog">Dogs</SelectItem>
                  <SelectItem value="Cat">Cats</SelectItem>
                  <SelectItem value="Bird">Birds</SelectItem>
                </SelectContent>
              </Select>

              {/* View toggle — pushed to the right */}
              <div className="flex items-center gap-1 ml-auto border border-border rounded-md p-0.5 bg-muted/40 h-9 shrink-0">
                <button
                  onClick={() => setViewMode("card")}
                  className={cn(
                    "flex items-center justify-center h-7 w-8 rounded transition-colors",
                    viewMode === "card"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Card view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center justify-center h-7 w-8 rounded transition-colors",
                    viewMode === "list"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pet grid / list */}
            <div className="flex-1 min-h-0 overflow-y-auto">
            {viewMode === "card" ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredPets.map((pet) => (
                  <PetCardGrid key={pet.id} pet={pet} stats={getPetStats(pet.id)} />
                ))}

                <AddPetModal nameId="petName2" speciesId="species2" breedId="breed2">
                  <Card className="border-dashed border-2 border-border hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="p-4 flex flex-col items-center justify-center min-h-[130px] text-center">
                      <div className="p-2.5 bg-muted rounded-full mb-2">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-0.5">Add New Pet</h3>
                      <p className="text-xs text-muted-foreground">Create a profile for another pet</p>
                    </CardContent>
                  </Card>
                </AddPetModal>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredPets.map((pet) => (
                  <PetCardList key={pet.id} pet={pet} stats={getPetStats(pet.id)} />
                ))}

                <AddPetModal nameId="petName3" speciesId="species3" breedId="breed3">
                  <div className="flex items-center gap-3 border-2 border-dashed border-border hover:border-primary/50 rounded-xl px-4 py-3 cursor-pointer transition-colors group">
                    <div className="flex items-center justify-center h-11 w-11 rounded-full bg-muted shrink-0">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Add New Pet</p>
                      <p className="text-xs text-muted-foreground">Create a profile for another pet</p>
                    </div>
                  </div>
                </AddPetModal>
              </div>
            )}

            {/* Empty state */}
            {filteredPets.length === 0 && (
              <div className="text-center py-12">
                <PawPrint className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No pets found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || speciesFilter !== "all"
                    ? "Try adjusting your search or filter"
                    : "Add your first pet to get started"}
                </p>
              </div>
            )}
            </div> {/* end scrollable pet list */}
          </div>

          {/* ── Reminders sidebar ── */}
          <div className="flex flex-col min-h-0 gap-4">
            <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Upcoming Reminders</h2>
                {upcomingReminders.length > 0 && (
                  <Badge variant={overdueCount > 0 ? "danger" : "warning"}>
                    {upcomingReminders.length}
                  </Badge>
                )}
              </div>

              {upcomingReminders.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2 text-center flex-1 justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary/50" />
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No upcoming reminders right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                  {upcomingReminders.map((r, i) => (
                    <ReminderItem key={i} {...r} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions — mobile only */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-2 lg:hidden">
              <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
              <AddPetModal>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add Pet
                </Button>
              </AddPetModal>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4" />
                Add Record
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}