import { useMemo, useState } from "react";
import * as ModalPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva } from "class-variance-authority";
import { Barcode, Camera, CheckIcon, ChevronDownIcon, ImagePlus, XIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { calculateAge } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: { default: "h-9 px-4 py-2 has-[>svg]:px-3" },
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

function Label({ className, ...props }) {
  return <label className={cn("flex items-center gap-2 text-sm leading-none font-medium select-none", className)} {...props} />;
}

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "placeholder:text-muted-foreground border-input flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  );
}

function ModalContent({ className, children, ...props }) {
  return (
    <ModalPrimitive.Portal>
      <ModalPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <ModalPrimitive.Content
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border shadow-lg duration-200 sm:max-w-2xl",
          className
        )}
        {...props}
      >
        {children}
        <ModalPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </ModalPrimitive.Close>
      </ModalPrimitive.Content>
    </ModalPrimitive.Portal>
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

const speciesOptions = ["Dog", "Cat", "Bird", "Exotic", "Rabbit", "Reptile", "Small Mammal"];
const genderOptions = ["Male", "Female"];
const breedSuggestions = [
  "Golden Retriever",
  "Labrador Retriever",
  "German Shepherd",
  "Poodle",
  "Maine Coon",
  "Persian",
  "Siamese",
  "African Grey Parrot",
  "Cockatiel",
  "Mini Rex",
  "Bearded Dragon",
];

const initialPet = {
  name: "",
  species: "",
  breed: "",
  gender: "",
  birthDate: "",
  weight: "",
  weightUnit: "kg",
  neutered: false,
  distinguishingMarks: "",
  microchipNumber: "",
  photo: "",
};

export function AddPetModal({ children, nameId = "petName", speciesId = "species", breedId = "breed" }) {
  const { addPet } = useStore();
  const [open, setOpen] = useState(false);
  const [pet, setPet] = useState(initialPet);

  const age = useMemo(() => {
    if (!pet.birthDate) return "Select a birthdate";
    return calculateAge(pet.birthDate);
  }, [pet.birthDate]);

  const updatePet = (field, value) => {
    setPet((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePet("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!pet.name || !pet.species || !pet.gender || !pet.birthDate || !pet.weight) return;

    addPet({
      ...pet,
      weight: Number(pet.weight),
      photo: pet.photo || "/placeholder-user.jpg",
      spayNeuterStatus: pet.neutered ? "Neutered/Spayed" : "Intact",
    });

    setPet(initialPet);
    setOpen(false);
  };

  return (
    <ModalPrimitive.Root open={open} onOpenChange={setOpen}>
      <ModalPrimitive.Trigger asChild>{children}</ModalPrimitive.Trigger>
      <ModalContent>
        {/* Scrollable inner — only vertical, no horizontal */}
        <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden p-6">
          <div className="flex flex-col gap-2 text-center sm:text-left mb-5">
            <ModalPrimitive.Title className="text-lg leading-none font-semibold">Add New Pet</ModalPrimitive.Title>
            <ModalPrimitive.Description className="text-muted-foreground text-sm">
              Enter your pet&apos;s profile details and identification information.
            </ModalPrimitive.Description>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Photo + core fields */}
            <div className="grid gap-4 sm:grid-cols-[7rem_1fr]">
              <div className="space-y-2">
                <Label htmlFor={`${nameId}-photo`}>Photo</Label>
                <label
                  htmlFor={`${nameId}-photo`}
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input bg-muted/30 text-center text-xs text-muted-foreground transition-colors hover:border-primary"
                >
                  {pet.photo ? (
                    <img src={pet.photo} alt="Pet preview" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="mb-2 h-6 w-6" />
                      Upload
                    </>
                  )}
                </label>
                <Input id={`${nameId}-photo`} type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={nameId}>Pet Name</Label>
                  <Input
                    id={nameId}
                    value={pet.name}
                    onChange={(e) => updatePet("name", e.target.value)}
                    placeholder="e.g., Max"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={speciesId}>Species</Label>
                  <Select value={pet.species} onValueChange={(v) => updatePet("species", v)}>
                    <SelectTrigger id={speciesId} className="w-full">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {speciesOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={breedId}>Breed</Label>
                  <Input
                    id={breedId}
                    list={`${breedId}-suggestions`}
                    value={pet.breed}
                    onChange={(e) => updatePet("breed", e.target.value)}
                    placeholder="Search or enter breed"
                  />
                  <datalist id={`${breedId}-suggestions`}>
                    {breedSuggestions.map((b) => <option key={b} value={b} />)}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${nameId}-gender`}>Gender</Label>
                  <Select value={pet.gender} onValueChange={(v) => updatePet("gender", v)}>
                    <SelectTrigger id={`${nameId}-gender`} className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Birthdate + Weight */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${nameId}-birthdate`}>Birthdate</Label>
                <Input
                  id={`${nameId}-birthdate`}
                  type="date"
                  value={pet.birthDate}
                  onChange={(e) => updatePet("birthDate", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Age: {age}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${nameId}-weight`}>Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id={`${nameId}-weight`}
                    type="number"
                    min="0"
                    step="0.1"
                    value={pet.weight}
                    onChange={(e) => updatePet("weight", e.target.value)}
                    placeholder="0.0"
                    required
                  />
                  <div className="grid grid-cols-2 rounded-md border border-input p-0.5 shrink-0">
                    {["kg", "lbs"].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => updatePet("weightUnit", unit)}
                        className={cn(
                          "rounded px-3 text-sm font-medium transition-colors",
                          pet.weightUnit === unit
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Neutered — Yes / No toggle */}
            <div className="space-y-2">
              <Label>Neutered / Spayed</Label>
              <div className="grid grid-cols-2 gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => updatePet("neutered", val)}
                    className={cn(
                      "flex items-center justify-center gap-2 h-9 rounded-md border text-sm font-medium transition-colors",
                      pet.neutered === val
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {pet.neutered === val && <CheckIcon className="h-3.5 w-3.5" />}
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>

            {/* Microchip */}
            <div className="space-y-2">
              <Label htmlFor={`${nameId}-microchip`}>Microchip Number</Label>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`${nameId}-microchip`}
                    value={pet.microchipNumber}
                    onChange={(e) => updatePet("microchipNumber", e.target.value)}
                    placeholder="Enter or scan microchip number"
                    className="pl-9"
                  />
                </div>
                <Button type="button" variant="default" className="px-3 shrink-0" title="Barcode scanning placeholder">
                  <Camera className="h-4 w-4" />
                  Scan
                </Button>
              </div>
            </div>

            {/* Distinguishing Marks */}
            <div className="space-y-2">
              <Label htmlFor={`${nameId}-marks`}>Distinguishing Marks</Label>
              <Textarea
                id={`${nameId}-marks`}
                value={pet.distinguishingMarks}
                onChange={(e) => updatePet("distinguishingMarks", e.target.value)}
                placeholder='e.g., "White patch on left ear"'
              />
            </div>

            <Button className="w-full" type="submit">Create Pet Profile</Button>
          </form>
        </div>
      </ModalContent>
    </ModalPrimitive.Root>
  );
}