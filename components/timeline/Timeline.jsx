import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import { AlertTriangle, Calendar, Pill, Scissors, Stethoscope, Syringe, Utensils } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: { default: "h-9 px-4 py-2", sm: "h-8 px-3" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

function Card({ className, ...props }) {
  return <div className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

function Badge({ className, variant = "outline", ...props }) {
  const variants = {
    outline: "border text-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-white",
    success: "border-transparent bg-success text-success-foreground",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}

function Select({ className, children, ...props }) {
  return <select className={cn("border-input bg-background h-9 rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props}>{children}</select>;
}

function Avatar({ className, ...props }) {
  return <AvatarPrimitive.Root className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)} {...props} />;
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return <AvatarPrimitive.Fallback className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)} {...props} />;
}

function PageTitle({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

const typeConfig = {
  vaccination: { label: "Vaccination", icon: Syringe, color: "text-primary", bg: "bg-primary/10" },
  condition: { label: "Condition", icon: Stethoscope, color: "text-chart-3", bg: "bg-chart-3/10" },
  surgery: { label: "Surgery", icon: Scissors, color: "text-chart-4", bg: "bg-chart-4/10" },
  allergy: { label: "Allergy", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  medication: { label: "Medication", icon: Pill, color: "text-chart-2", bg: "bg-chart-2/10" },
  diet: { label: "Diet", icon: Utensils, color: "text-accent", bg: "bg-accent/10" },
};

function monthKey(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function toTimelineEvents(store) {
  return [
    ...store.vaccinations.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "vaccination",
      title: record.vaccineType,
      description: `Administered by ${record.administeringVet} at ${record.clinic}`,
      date: record.dateAdministered,
    })),
    ...store.medicalHistory.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: record.type,
      title: record.type === "surgery" ? record.surgeryName : record.condition,
      description: record.type === "surgery" ? `${record.notes}. ${record.postOpCare}` : record.notes,
      date: record.type === "surgery" ? record.dateOfSurgery : record.dateOfDiagnosis,
    })),
    ...store.allergies.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "allergy",
      title: record.allergen,
      description: `${record.allergyType} - ${record.severityLevel} severity`,
      date: record.lastReactionDate,
      severity: record.severityLevel,
    })),
    ...store.medications.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "medication",
      title: record.medicationName,
      description: `${record.dosage} - ${record.frequency}`,
      date: record.startDate,
      active: record.ongoing,
    })),
    ...store.dietaryRequirements.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "diet",
      title: `${record.specialDietType} Diet`,
      description: record.feedingSchedule,
      date: record.id === "diet-2" ? "2024-01-20" : "2023-04-15",
    })),
  ];
}

export default function TimelinePage() {
  const store = useStore();
  const { pets } = store;
  const [selectedPet, setSelectedPet] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const events = useMemo(() => {
    const now = new Date();
    const cutoff = timeRange === "all" ? null : new Date(now.setMonth(now.getMonth() - Number(timeRange)));
    return toTimelineEvents(store)
      .filter((event) => {
        return (
          (selectedPet === "all" || event.petId === selectedPet) &&
          (selectedTypes.length === 0 || selectedTypes.includes(event.type)) &&
          (!cutoff || new Date(event.date) >= cutoff)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [store, selectedPet, selectedTypes, timeRange]);

  const groupedEvents = events.reduce((groups, event) => {
    const key = monthKey(event.date);
    groups[key] = groups[key] || [];
    groups[key].push(event);
    return groups;
  }, {});

  const toggleType = (type) => {
    setSelectedTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageTitle title="Health Timeline" subtitle="Chronological view of all health events" />

        <Card>
          <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={selectedPet} onChange={(event) => setSelectedPet(event.target.value)} className="w-40">
                <option value="all">All Pets</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </Select>
              <Select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} className="w-40">
                <option value="all">All Time</option>
                <option value="1">Last Month</option>
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last Year</option>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeConfig).map(([type, config]) => {
                const Icon = config.icon;
                const selected = selectedTypes.includes(type);
                return (
                  <Button key={type} variant={selected ? "default" : "outline"} size="sm" onClick={() => toggleType(type)}>
                    <Icon className="h-3.5 w-3.5" />{config.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold">No events found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([month, records]) => (
              <section key={month}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{records.length}</div>
                  <h2 className="text-xl font-semibold">{month}</h2>
                </div>
                <div className="relative ml-4 space-y-4 border-l-2 border-border pl-8">
                  {records.map((record) => {
                    const config = typeConfig[record.type];
                    const Icon = config.icon;
                    const pet = pets.find((item) => item.id === record.petId);
                    return (
                      <div key={`${record.type}-${record.id}`} className="relative">
                        <span className="absolute -left-[39px] top-6 h-3 w-3 rounded-full border-2 border-background bg-primary/20" />
                        <Card>
                          <CardContent className="flex items-start gap-4 p-4">
                            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.bg)}>
                              <Icon className={cn("h-5 w-5", config.color)} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold">{record.title}</h3>
                                <Badge variant="outline">{config.label}</Badge>
                                {record.severity && <Badge variant={record.severity === "High" ? "destructive" : "secondary"}>{record.severity}</Badge>}
                                {record.active && <Badge variant="success">Active</Badge>}
                              </div>
                              {record.description && <p className="mb-2 text-sm text-muted-foreground">{record.description}</p>}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage src={pet?.photo} alt={pet?.name} />
                                    <AvatarFallback className="text-[8px]">{pet?.name?.[0]}</AvatarFallback>
                                  </Avatar>
                                  {pet?.name}
                                </span>
                                <span>{formatDate(record.date)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
