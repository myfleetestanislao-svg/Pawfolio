import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AppLayout } from "@/components/layout/app-layout";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { AlertTriangle, Check, Copy, Eye, Link as LinkIcon, Plus, QrCode, Shield, Trash2, XIcon } from "lucide-react";

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

function CardHeader({ className, ...props }) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h2 className={cn("font-semibold leading-none", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
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
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}

function Input({ className, ...props }) {
  return <input className={cn("border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props} />;
}

function Select({ className, children, ...props }) {
  return <select className={cn("border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", className)} {...props}>{children}</select>;
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

function PageTitle({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default function ShareLinkPage() {
  const { pets, shareLinks, createShareLink, revokeShareLink } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [draft, setDraft] = useState({
    petId: pets[0]?.id || "",
    accessType: "full",
    recipientName: "",
    recipientEmail: "",
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  const activeLinks = shareLinks.filter((link) => link.isActive && new Date(link.expiresAt) >= new Date());
  const expiredLinks = shareLinks.filter((link) => !link.isActive || new Date(link.expiresAt) < new Date());

  const handleCreateLink = () => {
    createShareLink(draft.petId, draft.accessType, draft.expiresAt, draft.recipientName || "Shared contact", draft.recipientEmail);
    setIsDialogOpen(false);
    setDraft({ ...draft, recipientName: "", recipientEmail: "" });
  };

  const copyToClipboard = async (link) => {
    const url = `${window.location.origin}/shared/${link.token}`;
    await navigator.clipboard?.writeText(url);
    setCopiedId(link.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageTitle title="Share Records" subtitle="Create QR codes and secure links to share pet records" />

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Share Links</CardTitle>
              <CardDescription>Generate secure, expiring links to share your pet's health records with vets, sitters, or emergency contacts</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" />Create Link</Button>
          </CardHeader>
        </Card>

        {activeLinks.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <QrCode className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-1 text-lg font-semibold">No active share links</h2>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">Create a secure link to share your pet's health records with veterinarians, pet sitters, or emergency contacts</p>
              <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" />Create Your First Link</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeLinks.map((link) => {
              const pet = pets.find((item) => item.id === link.petId);
              const url = `${window.location.origin}/shared/${link.token}`;
              return (
                <Card key={link.id}>
                  <CardContent className="flex flex-col gap-5 p-5 sm:flex-row">
                    <div className="w-fit rounded-lg bg-white p-3">
                      <QRCodeSVG value={url} size={104} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Avatar>
                          <AvatarImage src={pet?.photo} alt={pet?.name} />
                          <AvatarFallback>{pet?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{pet?.name}'s records</p>
                          <p className="text-xs text-muted-foreground">{link.recipientName}</p>
                        </div>
                        {link.accessType === "emergency" && <Badge variant="destructive"><AlertTriangle />Emergency</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Expires {formatDate(link.expiresAt)}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{link.accessCount} views</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(link)}>
                          {copiedId === link.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedId === link.id ? "Copied" : "Copy Link"}
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => revokeShareLink(link.id)}>
                          <Trash2 className="h-3 w-3" />Revoke
                        </Button>
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
            <CardTitle className="text-lg">How Sharing Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "Generate QR Code", text: "Create a unique QR code that links to your pet's health profile", icon: QrCode },
                { title: "Control Access", text: "Set expiry dates, view limits, and choose what information to share", icon: Shield },
                { title: "Share Anywhere", text: "Print the QR code or copy the link to share via text, email, or messaging apps", icon: LinkIcon },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {expiredLinks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-muted-foreground">Expired / Revoked Links</h2>
            {expiredLinks.slice(0, 5).map((link) => {
              const pet = pets.find((item) => item.id === link.petId);
              return (
                <div key={link.id} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 text-muted-foreground">
                  <Avatar className="opacity-60">
                    <AvatarImage src={pet?.photo} alt={pet?.name} />
                    <AvatarFallback>{pet?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{pet?.name}'s records</p>
                    <p className="text-xs">{link.isActive ? "Expired" : "Revoked"} - {link.accessCount} total views</p>
                  </div>
                  <Badge variant="secondary">{link.isActive ? "Expired" : "Revoked"}</Badge>
                </div>
              );
            })}
          </section>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogTitle className="text-lg font-semibold">Create Share Link</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Configure access settings for the shared records.</DialogDescription>
            <div className="mt-5 space-y-4">
              <Select value={draft.petId} onChange={(event) => setDraft({ ...draft, petId: event.target.value })}>
                {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
              </Select>
              <Select value={draft.accessType} onChange={(event) => setDraft({ ...draft, accessType: event.target.value })}>
                <option value="full">Full health profile</option>
                <option value="emergency">Emergency only</option>
              </Select>
              <Input type="date" value={draft.expiresAt} onChange={(event) => setDraft({ ...draft, expiresAt: event.target.value })} />
              <Input placeholder="Recipient name" value={draft.recipientName} onChange={(event) => setDraft({ ...draft, recipientName: event.target.value })} />
              <Input type="email" placeholder="Recipient email" value={draft.recipientEmail} onChange={(event) => setDraft({ ...draft, recipientEmail: event.target.value })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateLink} disabled={!draft.petId || !draft.expiresAt}>Create Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
