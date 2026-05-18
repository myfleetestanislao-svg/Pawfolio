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
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
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
  return <div className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)} {...props} />;
}

function CardHeader({ className, ...props }) {
  return <div className={cn("grid auto-rows-min gap-1.5 px-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <div className={cn("leading-none font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <div className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-6", className)} {...props} />;
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

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
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
    {
      label: "Vaccinations",
      value: petVaccinations.length,
      icon: Syringe,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Meds",
      value: activeMedications.length,
      icon: Pill,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Allergies",
      value: petAllergies.length,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Reminders",
      value: petReminders.length,
      icon: Bell,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s an overview of {selectedPet?.name}&apos;s health records
            </p>
          </div>
          <Link href="/pets">
            <Button>
              <PawPrint className="h-4 w-4 mr-2" />
              Manage Pets
            </Button>
          </Link>
        </div>

        {/* Pet Quick View */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={selectedPet?.photo} alt={selectedPet?.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {selectedPet?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedPet?.name}</h2>
                  <Badge variant="secondary">{selectedPet?.species}</Badge>
                </div>
                <p className="text-muted-foreground mb-3">{selectedPet?.breed}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{calculateAge(selectedPet?.birthDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedPet?.weight} {selectedPet?.weightUnit}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedPet?.gender}</span>
                  </div>
                </div>
              </div>
              <Link href={`/pets/${selectedPet?.id}`}>
                <Button variant="outline">
                  View Profile
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts Section */}
        {(overdueVaccinations.length > 0 || highSeverityAllergies.length > 0) && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueVaccinations.map((vac) => (
                <div key={vac.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Syringe className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-foreground">{vac.vaccineType} - Overdue</p>
                      <p className="text-sm text-muted-foreground">Expired {formatDate(vac.expiryDate)}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
              ))}
              {highSeverityAllergies.map((allergy) => (
                <div key={allergy.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-foreground">Severe Allergy: {allergy.allergen}</p>
                      <p className="text-sm text-muted-foreground">{allergy.emergencyResponse}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Vaccinations */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Upcoming Vaccinations</CardTitle>
                <CardDescription>Due in the next 60 days</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingVaccinations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Syringe className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No upcoming vaccinations</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingVaccinations.slice(0, 3).map((vac) => (
                    <div key={vac.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Syringe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{vac.vaccineType}</p>
                          <p className="text-sm text-muted-foreground">Due {formatDate(vac.expiryDate)}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-chart-2 border-chart-2">
                        Upcoming
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Active Medications</CardTitle>
                <CardDescription>Current prescriptions and supplements</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeMedications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Pill className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No active medications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMedications.slice(0, 3).map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-chart-2/10 rounded-lg">
                          <Pill className="h-4 w-4 text-chart-2" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{med.medicationName}</p>
                          <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-success border-success">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Reminders */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Pending Reminders</CardTitle>
                <CardDescription>Upcoming tasks and appointments</CardDescription>
              </div>
              <Link href="/reminders">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {petReminders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No pending reminders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {petReminders.slice(0, 3).map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-chart-3/10 rounded-lg">
                          <Clock className="h-4 w-4 text-chart-3" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{reminder.title}</p>
                          <p className="text-sm text-muted-foreground">Due {formatDate(reminder.dueDate)}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          reminder.priority === "high" 
                            ? "text-destructive border-destructive" 
                            : reminder.priority === "medium"
                            ? "text-chart-2 border-chart-2"
                            : "text-muted-foreground border-muted-foreground"
                        }
                      >
                        {reminder.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Known Allergies */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Known Allergies</CardTitle>
                <CardDescription>Food, medication, and environmental</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {petAllergies.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No known allergies</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {petAllergies.slice(0, 3).map((allergy) => (
                    <div key={allergy.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          allergy.severityLevel === "High" 
                            ? "bg-destructive/10" 
                            : allergy.severityLevel === "Moderate"
                            ? "bg-chart-2/10"
                            : "bg-muted"
                        }`}>
                          <AlertTriangle className={`h-4 w-4 ${
                            allergy.severityLevel === "High" 
                              ? "text-destructive" 
                              : allergy.severityLevel === "Moderate"
                              ? "text-chart-2"
                              : "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{allergy.allergen}</p>
                          <p className="text-sm text-muted-foreground">{allergy.allergyType}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={allergy.severityLevel === "High" ? "destructive" : "outline"}
                        className={
                          allergy.severityLevel === "Moderate" 
                            ? "text-chart-2 border-chart-2" 
                            : allergy.severityLevel === "Low"
                            ? "text-muted-foreground border-muted-foreground"
                            : ""
                        }
                      >
                        {allergy.severityLevel}
                      </Badge>
                    </div>
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
