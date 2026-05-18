import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Link } from "@/lib/router";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import {
  AlertTriangle,
  Calendar,
  Pill,
  Plus,
  Search,
  Scissors,
  Stethoscope,
  Syringe,
  Utensils,
} from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Button({ className, variant, ...props }) {
  return <button className={cn(buttonVariants({ variant, className }), "h-9 px-4 py-2")} {...props} />;
}

function Card({ className, ...props }) {
  return <div className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)} {...props} />;
}

function CardHeader({ className, ...props }) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h2 className={cn("font-semibold leading-none", className)} {...props} />;
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

function Input({ className, ...props }) {
  return <input className={cn("border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props} />;
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

const recordTypes = {
  vaccination: { label: "Vaccination", icon: Syringe, color: "text-primary", bg: "bg-primary/10" },
  condition: { label: "Condition", icon: Stethoscope, color: "text-chart-3", bg: "bg-chart-3/10" },
  surgery: { label: "Surgery", icon: Scissors, color: "text-chart-4", bg: "bg-chart-4/10" },
  allergy: { label: "Allergy", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  medication: { label: "Medication", icon: Pill, color: "text-chart-2", bg: "bg-chart-2/10" },
  diet: { label: "Diet", icon: Utensils, color: "text-accent", bg: "bg-accent/10" },
};

function toRecords({ vaccinations, medicalHistory, allergies, medications, dietaryRequirements }) {
  return [
    ...vaccinations.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "vaccination",
      title: record.vaccineType,
      subtitle: record.administeringVet ? `By ${record.administeringVet}` : record.clinic,
      date: record.dateAdministered,
    })),
    ...medicalHistory.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: record.type,
      title: record.type === "surgery" ? record.surgeryName : record.condition,
      subtitle: record.type === "surgery" ? record.clinic : record.notes,
      date: record.type === "surgery" ? record.dateOfSurgery : record.dateOfDiagnosis,
    })),
    ...allergies.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "allergy",
      title: record.allergen,
      subtitle: `${record.allergyType} - ${record.severityLevel} severity`,
      date: record.lastReactionDate,
      severity: record.severityLevel,
    })),
    ...medications.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "medication",
      title: record.medicationName,
      subtitle: `${record.dosage} - ${record.frequency}`,
      date: record.startDate,
      active: record.ongoing,
    })),
    ...dietaryRequirements.map((record) => ({
      id: record.id,
      petId: record.petId,
      type: "diet",
      title: `${record.specialDietType} Diet`,
      subtitle: record.feedingSchedule,
      date: record.id === "diet-2" ? "2024-01-20" : "2023-04-15",
    })),
  ];
}

export default function RecordsPage() {
  const store = useStore();
  const { pets } = store;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPet, setSelectedPet] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const allRecords = useMemo(() => toRecords(store), [store]);
  const filteredRecords = allRecords
    .filter((record) => {
      const query = searchQuery.toLowerCase();
      return (
        (selectedPet === "all" || record.petId === selectedPet) &&
        (selectedType === "all" || record.type === selectedType) &&
        (!query || record.title.toLowerCase().includes(query) || record.subtitle?.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageTitle title="Health Records" subtitle={`${allRecords.length} total records across ${pets.length} pets`} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search records..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-9" />
          </div>
          <Select value={selectedPet} onChange={(event) => setSelectedPet(event.target.value)} className="sm:w-44">
            <option value="all">All Pets</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </Select>
          <Select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="sm:w-44">
            <option value="all">All Types</option>
            {Object.entries(recordTypes).map(([type, config]) => (
              <option key={type} value={type}>{config.label}</option>
            ))}
          </Select>
          <Link href="/records/new">
            <Button className="w-full sm:w-auto"><Plus className="h-4 w-4" />Add Record</Button>
          </Link>
        </div>

        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold">No records found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const config = recordTypes[record.type];
              const Icon = config.icon;
              const pet = pets.find((item) => item.id === record.petId);

              return (
                <Card key={`${record.type}-${record.id}`} className="transition-colors hover:border-primary/40">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.bg)}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{record.title}</h3>
                        <Badge variant="outline">{config.label}</Badge>
                        {record.severity && <Badge variant={record.severity === "High" ? "destructive" : "secondary"}>{record.severity}</Badge>}
                        {record.active && <Badge variant="success">Active</Badge>}
                      </div>
                      {record.subtitle && <p className="mb-2 text-sm text-muted-foreground">{record.subtitle}</p>}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={pet?.photo} alt={pet?.name} />
                            <AvatarFallback className="text-[8px]">{pet?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          {pet?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(record.date)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Records Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {Object.entries(recordTypes).map(([type, config]) => {
                const Icon = config.icon;
                const count = allRecords.filter((record) => record.type === type).length;
                return (
                  <div key={type} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <Icon className={cn("h-5 w-5", config.color)} />
                    <div>
                      <p className="text-lg font-semibold">{count}</p>
                      <p className="text-xs text-muted-foreground">{config.label}s</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
