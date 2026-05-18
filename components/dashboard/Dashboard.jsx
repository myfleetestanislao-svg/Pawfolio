import { useStore } from "@/lib/store";
import { AppLayout } from "@/components/layout/app-layout";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  PawPrint,
  Syringe,
  AlertTriangle,
  Pill,
  Calendar,
  Clock,
  ChevronRight,
  Bell,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Link } from "@/lib/router";
import { formatDate, isUpcoming, isOverdue, calculateAge } from "@/lib/sample-data";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent/60 hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-3 rounded-2xl border border-border/60 py-4 shadow-[0_1px_6px_0_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("grid auto-rows-min gap-0.5 px-5", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <div className={cn("leading-none font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <div className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-5", className)} {...props} />;
}

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full", className)} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  );
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "text-foreground border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* ── Thin stat card ── */
function StatCard({ stat }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3.5 py-2.5 shadow-[0_1px_4px_0_rgba(0,0,0,0.05)]">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", stat.bgColor)}>
        <stat.icon className={cn("h-4 w-4", stat.color)} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none text-foreground">{stat.value}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </div>
  );
}

/* ── List row used in detail cards ── */
function ListRow({ children }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5">
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { pets, vaccinations, allergies, medications, reminders, selectedPetId } = useStore();

  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const petVaccinations = vaccinations.filter((v) => v.petId === selectedPet?.id);
  const petAllergies = allergies.filter((a) => a.petId === selectedPet?.id);
  const petMedications = medications.filter((m) => m.petId === selectedPet?.id);
  const petReminders = reminders.filter((r) => r.petId === selectedPet?.id && r.status === "pending");

  const upcomingVaccinations = petVaccinations.filter((v) => isUpcoming(v.expiryDate, 60));
  const overdueVaccinations = petVaccinations.filter((v) => isOverdue(v.expiryDate));
  const activeMedications = petMedications.filter((m) => m.ongoing);
  const highSeverityAllergies = petAllergies.filter((a) => a.severityLevel === "High");

  const stats = [
    { label: "Vaccinations", value: petVaccinations.length, icon: Syringe,       color: "text-primary",     bgColor: "bg-primary/10" },
    { label: "Active Meds",  value: activeMedications.length, icon: Pill,         color: "text-chart-2",     bgColor: "bg-chart-2/10" },
    { label: "Allergies",    value: petAllergies.length,       icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
    { label: "Reminders",    value: petReminders.length,       icon: Bell,         color: "text-chart-3",     bgColor: "bg-chart-3/10" },
  ];

  return (
    <AppLayout>
      <div className="space-y-5">

        {/* ── Welcome ── */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Welcome back!
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Here&apos;s an overview of {selectedPet?.name}&apos;s health records
            </p>
          </div>
          <Link href="/pets">
            <Button>
              <PawPrint className="h-4 w-4" />
              Manage Pets
            </Button>
          </Link>
        </div>

        {/* ── Pet Quick View ── */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-[88px] w-[88px] ring-4 ring-primary/15">
                <AvatarImage src={selectedPet?.photo} alt={selectedPet?.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {selectedPet?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <div className="mb-1 flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                  <h2 className="font-display text-2xl font-bold text-foreground">{selectedPet?.name}</h2>
                  <Badge variant="secondary">{selectedPet?.species}</Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{selectedPet?.breed}</p>

                <div className="flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {calculateAge(selectedPet?.birthDate)}
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedPet?.weight} {selectedPet?.weightUnit}
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedPet?.gender}
                  </span>
                </div>
              </div>

              <Link href={`/pets/${selectedPet?.id}`}>
                <Button variant="outline" size="sm">
                  View Profile
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ── Stats Grid (thin cards) ── */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* ── Alerts ── */}
        {(overdueVaccinations.length > 0 || highSeverityAllergies.length > 0) && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 space-y-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Attention Required
            </p>

            <div className="space-y-2">
              {overdueVaccinations.map((vac) => (
                <div key={vac.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3.5 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                      <Syringe className="h-3.5 w-3.5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{vac.vaccineType} — Overdue</p>
                      <p className="text-xs text-muted-foreground">Expired {formatDate(vac.expiryDate)}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              ))}

              {highSeverityAllergies.map((allergy) => (
                <div key={allergy.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3.5 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Severe Allergy: {allergy.allergen}</p>
                      <p className="text-xs text-muted-foreground">{allergy.emergencyResponse}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Content Grid ── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Upcoming Vaccinations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <div>
                <CardTitle className="text-base">Upcoming Vaccinations</CardTitle>
                <CardDescription className="text-xs">Due in the next 60 days</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingVaccinations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Syringe className="mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">No upcoming vaccinations</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingVaccinations.slice(0, 3).map((vac) => (
                    <ListRow key={vac.id}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                          <Syringe className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{vac.vaccineType}</p>
                          <p className="text-xs text-muted-foreground">Due {formatDate(vac.expiryDate)}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-chart-2 border-chart-2/50 text-xs">
                        Upcoming
                      </Badge>
                    </ListRow>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <div>
                <CardTitle className="text-base">Active Medications</CardTitle>
                <CardDescription className="text-xs">Current prescriptions and supplements</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeMedications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Pill className="mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">No active medications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeMedications.slice(0, 3).map((med) => (
                    <ListRow key={med.id}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-2/10">
                          <Pill className="h-3.5 w-3.5 text-chart-2" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{med.medicationName}</p>
                          <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success/50 text-xs">
                        Active
                      </Badge>
                    </ListRow>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Reminders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <div>
                <CardTitle className="text-base">Pending Reminders</CardTitle>
                <CardDescription className="text-xs">Upcoming tasks and appointments</CardDescription>
              </div>
              <Link href="/reminders">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {petReminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">No pending reminders</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {petReminders.slice(0, 3).map((reminder) => (
                    <ListRow key={reminder.id}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-3/10">
                          <Clock className="h-3.5 w-3.5 text-chart-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{reminder.title}</p>
                          <p className="text-xs text-muted-foreground">Due {formatDate(reminder.dueDate)}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          reminder.priority === "high"
                            ? "text-destructive border-destructive/50"
                            : reminder.priority === "medium"
                            ? "text-chart-2 border-chart-2/50"
                            : "text-muted-foreground border-muted-foreground/40"
                        )}
                      >
                        {reminder.priority}
                      </Badge>
                    </ListRow>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Known Allergies */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <div>
                <CardTitle className="text-base">Known Allergies</CardTitle>
                <CardDescription className="text-xs">Food, medication, and environmental</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {petAllergies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <AlertTriangle className="mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">No known allergies</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {petAllergies.slice(0, 3).map((allergy) => (
                    <ListRow key={allergy.id}>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn("flex h-7 w-7 items-center justify-center rounded-lg", {
                            "bg-destructive/10": allergy.severityLevel === "High",
                            "bg-chart-2/10":     allergy.severityLevel === "Moderate",
                            "bg-muted":          allergy.severityLevel === "Low",
                          })}
                        >
                          <AlertTriangle
                            className={cn("h-3.5 w-3.5", {
                              "text-destructive":    allergy.severityLevel === "High",
                              "text-chart-2":        allergy.severityLevel === "Moderate",
                              "text-muted-foreground": allergy.severityLevel === "Low",
                            })}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{allergy.allergen}</p>
                          <p className="text-xs text-muted-foreground">{allergy.allergyType}</p>
                        </div>
                      </div>
                      <Badge
                        variant={allergy.severityLevel === "High" ? "destructive" : "outline"}
                        className={cn("text-xs", {
                          "text-chart-2 border-chart-2/50":             allergy.severityLevel === "Moderate",
                          "text-muted-foreground border-muted-foreground/40": allergy.severityLevel === "Low",
                        })}
                      >
                        {allergy.severityLevel}
                      </Badge>
                    </ListRow>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}