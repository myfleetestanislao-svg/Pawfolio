import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { AlertTriangle, Bell, Calendar, Check, Clock, Pill, Plus, Stethoscope, Syringe, XIcon } from "lucide-react";

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

function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

function Badge({ className, variant = "outline", ...props }) {
  const variants = {
    outline: "border text-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-white",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}

function Input({ className, ...props }) {
  return <input className={cn("border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props} />;
}

function Select({ className, children, ...props }) {
  return <select className={cn("border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props}>{children}</select>;
}

function Textarea({ className, ...props }) {
  return <textarea className={cn("border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props} />;
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

function Dialog({ open, onOpenChange, children }) {
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>{children}</DialogPrimitive.Root>;
}

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-lg", className)} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-xs opacity-70 hover:opacity-100">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

function Tabs({ defaultValue, children }) {
  return <TabsPrimitive.Root defaultValue={defaultValue}>{children}</TabsPrimitive.Root>;
}

function TabsList({ className, ...props }) {
  return <TabsPrimitive.List className={cn("inline-flex h-10 items-center rounded-lg bg-muted p-1", className)} {...props} />;
}

function TabsTrigger({ className, ...props }) {
  return <TabsPrimitive.Trigger className={cn("inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs", className)} {...props} />;
}

function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn("outline-none", className)} {...props} />;
}

function PageTitle({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function isCompleted(reminder) {
  return reminder.status === "completed" || reminder.completed;
}

function reminderIcon(type) {
  if (type === "vaccination") return Syringe;
  if (type === "medication") return Pill;
  if (type === "condition") return Stethoscope;
  return Calendar;
}

export default function RemindersPage() {
  const { pets, reminders, addReminder, completeReminder } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draft, setDraft] = useState({
    petId: pets[0]?.id || "",
    type: "checkup",
    title: "",
    description: "",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  });

  const today = new Date();
  const activeReminders = reminders.filter((reminder) => !isCompleted(reminder));
  const completedReminders = reminders.filter(isCompleted);
  const overdueReminders = activeReminders.filter((reminder) => new Date(reminder.dueDate) < today);
  const todayReminders = activeReminders.filter((reminder) => new Date(reminder.dueDate).toDateString() === today.toDateString());
  const upcomingReminders = activeReminders.filter((reminder) => new Date(reminder.dueDate) > today);

  const handleCreateReminder = () => {
    addReminder({
      id: `reminder-${Date.now()}`,
      petId: draft.petId,
      type: draft.type,
      title: draft.title,
      description: draft.description,
      dueDate: draft.dueDate,
      priority: "medium",
    });
    setIsDialogOpen(false);
    setDraft({ ...draft, title: "", description: "" });
  };

  const ReminderItem = ({ reminder }) => {
    const pet = pets.find((item) => item.id === reminder.petId);
    const dueDate = new Date(reminder.dueDate);
    const completed = isCompleted(reminder);
    const overdue = !completed && dueDate < today;
    const Icon = reminderIcon(reminder.type);

    return (
      <div className={cn("flex items-start gap-4 rounded-xl border p-4", completed ? "bg-muted/30" : overdue ? "border-destructive/40 bg-destructive/5" : "bg-card")}>
        <input
          type="checkbox"
          checked={completed}
          onChange={() => completeReminder(reminder.id)}
          className="mt-1 h-4 w-4 rounded border-input"
          aria-label={`Complete ${reminder.title}`}
        />
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", completed ? "bg-muted" : overdue ? "bg-destructive/10" : "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", completed ? "text-muted-foreground" : overdue ? "text-destructive" : "text-primary")} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className={cn("font-semibold", completed && "text-muted-foreground line-through")}>{reminder.title}</h3>
            {overdue && <Badge variant="destructive">Overdue</Badge>}
            {!overdue && !completed && dueDate.toDateString() === today.toDateString() && <Badge className="bg-warning text-warning-foreground">Today</Badge>}
          </div>
          {reminder.description && <p className="mb-2 text-sm text-muted-foreground">{reminder.description}</p>}
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
              {formatDate(reminder.dueDate)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageTitle title="Reminders" subtitle={`${activeReminders.length} pending reminders`} />

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Overdue", value: overdueReminders.length, icon: AlertTriangle, className: overdueReminders.length ? "border-destructive/50" : "", color: "text-destructive", bg: "bg-destructive/10" },
            { label: "Due Today", value: todayReminders.length, icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
            { label: "Upcoming", value: upcomingReminders.length, icon: Bell, color: "text-primary", bg: "bg-primary/10" },
            { label: "Completed", value: completedReminders.length, icon: Check, color: "text-success", bg: "bg-success/10" },
          ].map((stat) => (
            <Card key={stat.label} className={stat.className}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" />Add Reminder</Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending <Badge variant="secondary">{activeReminders.length}</Badge></TabsTrigger>
            <TabsTrigger value="completed">Completed <Badge variant="secondary">{completedReminders.length}</Badge></TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-6 space-y-6">
            {overdueReminders.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-destructive"><AlertTriangle className="h-4 w-4" />Overdue ({overdueReminders.length})</h2>
                {overdueReminders.map((reminder) => <ReminderItem key={reminder.id} reminder={reminder} />)}
              </section>
            )}
            {todayReminders.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-warning"><Clock className="h-4 w-4" />Due Today ({todayReminders.length})</h2>
                {todayReminders.map((reminder) => <ReminderItem key={reminder.id} reminder={reminder} />)}
              </section>
            )}
            {upcomingReminders.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Bell className="h-4 w-4" />Upcoming ({upcomingReminders.length})</h2>
                {upcomingReminders.map((reminder) => <ReminderItem key={reminder.id} reminder={reminder} />)}
              </section>
            )}
          </TabsContent>
          <TabsContent value="completed" className="mt-6 space-y-3">
            {completedReminders.map((reminder) => <ReminderItem key={reminder.id} reminder={reminder} />)}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogTitle className="text-lg font-semibold">Create Reminder</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Set up a new reminder for your pet.</DialogDescription>
            <div className="mt-5 space-y-4">
              <Select value={draft.petId} onChange={(event) => setDraft({ ...draft, petId: event.target.value })}>
                {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
              </Select>
              <Input placeholder="Reminder title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
              <Input type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} />
              <Textarea placeholder="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button disabled={!draft.title} onClick={handleCreateReminder}>Create Reminder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
