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
} from "lucide-react";
import { calculateAge } from "@/lib/sample-data";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: { default: "h-9 px-4 py-2 has-[>svg]:px-3" },
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
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
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
      <SelectPrimitive.Content className={cn("bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md", className)} {...props}>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item className={cn("focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

const speciesIcons = {
  Dog: Dog,
  Cat: Cat,
  Bird: Bird,
};

export default function PetsPage() {
  const { pets, vaccinations, allergies, medications } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const getPetStats = (petId) => {
    const petVaccinations = vaccinations.filter((v) => v.petId === petId).length;
    const petAllergies = allergies.filter((a) => a.petId === petId).length;
    const petMedications = medications.filter((m) => m.petId === petId && m.ongoing).length;
    return { vaccinations: petVaccinations, allergies: petAllergies, medications: petMedications };
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Pets</h1>
            <p className="text-muted-foreground">
              Manage your pet profiles and health information
            </p>
          </div>
          <AddPetModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Pet
            </Button>
          </AddPetModal>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
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
        </div>

        {/* Pets Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => {
            const stats = getPetStats(pet.id);
            const SpeciesIcon = speciesIcons[pet.species] || PawPrint;
            
            return (
              <Card key={pet.id} className="border-border hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={pet.photo} alt={pet.name} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {pet.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 p-1.5 bg-card border border-border rounded-full">
                        <SpeciesIcon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-1">{pet.name}</h3>
                    <p className="text-muted-foreground mb-3">{pet.breed}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {calculateAge(pet.birthDate)}
                      </Badge>
                      <Badge variant="secondary">
                        <Weight className="h-3 w-3 mr-1" />
                        {pet.weight} {pet.weightUnit}
                      </Badge>
                    </div>
                    
                    <div className="w-full grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">{stats.vaccinations}</p>
                        <p className="text-xs text-muted-foreground">Vaccines</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">{stats.allergies}</p>
                        <p className="text-xs text-muted-foreground">Allergies</p>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">{stats.medications}</p>
                        <p className="text-xs text-muted-foreground">Meds</p>
                      </div>
                    </div>
                    
                    <Link href={`/pets/${pet.id}`} className="w-full">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Profile
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Pet Card */}
          <AddPetModal nameId="petName2" speciesId="species2" breedId="breed2">
            <Card className="border-dashed border-2 border-border hover:border-primary/50 cursor-pointer transition-colors">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[320px] text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Add New Pet</h3>
                <p className="text-sm text-muted-foreground">
                  Create a profile for another pet
                </p>
              </CardContent>
            </Card>
          </AddPetModal>
        </div>

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
      </div>
    </AppLayout>
  );
}
