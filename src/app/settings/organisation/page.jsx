"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
  Edit,
  Trash2,
  Copy,
  Plus,
  UserPlus,
  Crown,
} from "lucide-react";
import { organisations } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function SettingsOrganisationPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [organisation, setOrganisation] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const isCollaborator = user?.account_type === "COLLABORATOR";
  const isOwner = organisation?.owner_user_id === user?.user_id;

  useEffect(() => {
    let mounted = true;

    async function fetchOrganisation() {
      if (!isCollaborator) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await organisations.getOrganisations();
        if (!mounted) return;
        const list = Array.isArray(result) ? result : result?.results ?? [];
        const org = list[0] ?? null;
        setOrganisation(org);

        // Fetch collaborators and invites if organisation exists
        if (org?.id) {
          fetchCollaborators(org.id);
          fetchInvites(org.id);
        }
      } catch (error) {
        toast.error("Impossible de charger l'organisation.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchOrganisation();
    return () => {
      mounted = false;
    };
  }, [isCollaborator]);

  async function fetchCollaborators(orgId) {
    try {
      setLoadingCollaborators(true);
      const result = await organisations.getCollaborators(orgId);
      const list = Array.isArray(result) ? result : result?.results ?? [];
      setCollaborators(list);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
    } finally {
      setLoadingCollaborators(false);
    }
  }

  async function fetchInvites(orgId) {
    try {
      setLoadingInvites(true);
      const result = await organisations.getInvites(orgId);
      const list = Array.isArray(result) ? result : result?.results ?? [];
      setInvites(list);
    } catch (error) {
      console.error("Failed to fetch invites:", error);
    } finally {
      setLoadingInvites(false);
    }
  }

  async function handleRemoveCollaborator(collaboratorId) {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce collaborateur ?")) return;
    
    try {
      await organisations.removeCollaborator(collaboratorId);
      toast.success("Collaborateur retiré avec succès");
      fetchCollaborators(organisation.id);
    } catch (error) {
      toast.error("Impossible de retirer le collaborateur");
    }
  }

  async function handleCreateInvite() {
    try {
      const newInvite = await organisations.createInvite(organisation.id);
      toast.success("Code d'invitation créé avec succès");
      fetchInvites(organisation.id);
      setInviteDialogOpen(false);
    } catch (error) {
      toast.error("Impossible de créer le code d'invitation");
    }
  }

  function copyInviteCode(code) {
    navigator.clipboard.writeText(code);
    toast.success("Code copié dans le presse-papiers");
  }

  if (!isCollaborator) {
    return (
      <Card className="border-border/80 bg-card/90">
        <CardHeader className="border-b border-border/60 bg-muted/40 px-6 py-5">
          <CardTitle className="text-xl">Organisation</CardTitle>
          <CardDescription>
            Les informations d&rsquo;organisation sont disponibles pour les collaborateurs faisant partie d’une structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6 text-sm text-muted-foreground">
          Vous n&apos;êtes pas identifié comme collaborateur. Si vous devez rejoindre une organisation, utilisez un code
          d&apos;invitation via la page Onboarding organisation.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-border/80 bg-card/90">
        <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Organisation</CardTitle>
              <CardDescription>
                Gérez votre organisation, les collaborateurs et les codes d&apos;invitation
              </CardDescription>
            </div>
            {organisation && isOwner && (
              <EditOrganisationDialog 
                organisation={organisation}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onUpdate={(updated) => {
                  setOrganisation(updated);
                  toast.success("Organisation mise à jour");
                }}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 py-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : organisation ? (
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="collaborators">
                  Collaborateurs
                  {collaborators.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {collaborators.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="invites">
                  Invitations
                  {invites.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {invites.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <OrganisationDetails organisation={organisation} />
              </TabsContent>

              <TabsContent value="collaborators" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Collaborateurs</h3>
                    <p className="text-sm text-muted-foreground">
                      Gérez les membres de votre organisation
                    </p>
                  </div>
                </div>

                {loadingCollaborators ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : collaborators.length > 0 ? (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Ajouté le</TableHead>
                          {isOwner && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collaborators.map((collab) => (
                          <TableRow key={collab.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {collab.user?.first_name || collab.user?.last_name ? (
                                  `${collab.user.first_name || ""} ${collab.user.last_name || ""}`.trim()
                                ) : (
                                  <span className="text-muted-foreground">Sans nom</span>
                                )}
                                {collab.user_id === organisation.owner_user_id && (
                                  <Crown className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{collab.user?.email || "-"}</TableCell>
                            <TableCell>
                              {collab.user_id === organisation.owner_user_id ? (
                                <Badge>Propriétaire</Badge>
                              ) : (
                                <Badge variant="secondary">Collaborateur</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {collab.created_at
                                ? new Date(collab.created_at).toLocaleDateString("fr-FR")
                                : "-"}
                            </TableCell>
                            {isOwner && (
                              <TableCell className="text-right">
                                {collab.user_id !== organisation.owner_user_id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCollaborator(collab.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Aucun collaborateur pour le moment
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invites" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Codes d&apos;invitation</h3>
                    <p className="text-sm text-muted-foreground">
                      Créez des codes pour inviter de nouveaux collaborateurs
                    </p>
                  </div>
                  {isOwner && (
                    <Button onClick={handleCreateInvite}>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un code
                    </Button>
                  )}
                </div>

                {loadingInvites ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : invites.length > 0 ? (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Créé le</TableHead>
                          <TableHead>Expire le</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invites.map((invite) => {
                          const isExpired = invite.expires_at && new Date(invite.expires_at) < new Date();
                          const isUsed = invite.is_used;
                          
                          return (
                            <TableRow key={invite.id}>
                              <TableCell className="font-mono">
                                {invite.code}
                              </TableCell>
                              <TableCell>
                                {invite.created_at
                                  ? new Date(invite.created_at).toLocaleDateString("fr-FR")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {invite.expires_at
                                  ? new Date(invite.expires_at).toLocaleDateString("fr-FR")
                                  : "Jamais"}
                              </TableCell>
                              <TableCell>
                                {isUsed ? (
                                  <Badge variant="secondary">Utilisé</Badge>
                                ) : isExpired ? (
                                  <Badge variant="destructive">Expiré</Badge>
                                ) : (
                                  <Badge variant="default">Actif</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyInviteCode(invite.code)}
                                  disabled={isUsed || isExpired}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Aucun code d&apos;invitation créé
                    </p>
                    {isOwner && (
                      <Button className="mt-4" onClick={handleCreateInvite}>
                        Créer le premier code
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Aucune organisation associée à votre compte.</p>
              <Button asChild>
                <Link href="/onboarding/organisation?required=true">Rejoindre une organisation</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{children}</p>
      </div>
    </div>
  );
}

function OrganisationDetails({ organisation }) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{organisation.name}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {organisation.type ? <Badge variant="secondary">{organisation.type}</Badge> : null}
            {organisation.industry ? <Badge variant="outline">{organisation.industry}</Badge> : null}
          </div>
        </div>
      </header>

      {organisation.description ? (
        <p className="text-sm text-muted-foreground leading-relaxed">{organisation.description}</p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        {organisation.website_url ? (
          <InfoRow icon={Globe} label="Site web">
            <Link
              href={organisation.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {organisation.website_url}
            </Link>
          </InfoRow>
        ) : null}
        {organisation.email_contact ? (
          <InfoRow icon={Mail} label="Email">
            <Link href={`mailto:${organisation.email_contact}`} className="hover:text-foreground">
              {organisation.email_contact}
            </Link>
          </InfoRow>
        ) : null}
        {organisation.phone_contact ? (
          <InfoRow icon={Phone} label="Téléphone">
            {organisation.phone_contact}
          </InfoRow>
        ) : null}
        {(organisation.address_city || organisation.address_country || organisation.address_postal_code) ? (
          <InfoRow icon={MapPin} label="Adresse">
            {[organisation.address_city, organisation.address_postal_code, organisation.address_country]
              .filter(Boolean)
              .join(", ")}
          </InfoRow>
        ) : null}
        {organisation.founded_year ? (
          <InfoRow icon={Building2} label="Année de création">
            {organisation.founded_year}
          </InfoRow>
        ) : null}
        {organisation.employees_count ? (
          <InfoRow icon={Users} label="Nombre d'employés">
            {organisation.employees_count}
          </InfoRow>
        ) : null}
      </section>

      {organisation.social_links && Object.keys(organisation.social_links).length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Réseaux sociaux & liens</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(organisation.social_links).map(([network, url]) => (
              <InfoRow key={network} icon={Globe} label={network}>
                <Link href={url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  {url}
                </Link>
              </InfoRow>
            ))}
          </div>
        </section>
      ) : null}

      {organisation.sponsoring_focus && Object.keys(organisation.sponsoring_focus).length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Focus sponsoring</h3>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
            <ul className="list-disc space-y-2 pl-4">
              {Object.entries(organisation.sponsoring_focus).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold text-foreground">{key} :</span>{" "}
                  <span>{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EditOrganisationDialog({ organisation, open, onOpenChange, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: organisation?.name || "",
    description: organisation?.description || "",
    type: organisation?.type || "",
    industry: organisation?.industry || "",
    website_url: organisation?.website_url || "",
    email_contact: organisation?.email_contact || "",
    phone_contact: organisation?.phone_contact || "",
    address_city: organisation?.address_city || "",
    address_postal_code: organisation?.address_postal_code || "",
    address_country: organisation?.address_country || "",
    founded_year: organisation?.founded_year || "",
    employees_count: organisation?.employees_count || "",
  });

  useEffect(() => {
    if (organisation) {
      setFormData({
        name: organisation.name || "",
        description: organisation.description || "",
        type: organisation.type || "",
        industry: organisation.industry || "",
        website_url: organisation.website_url || "",
        email_contact: organisation.email_contact || "",
        phone_contact: organisation.phone_contact || "",
        address_city: organisation.address_city || "",
        address_postal_code: organisation.address_postal_code || "",
        address_country: organisation.address_country || "",
        founded_year: organisation.founded_year || "",
        employees_count: organisation.employees_count || "",
      });
    }
  }, [organisation]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await organisations.updateOrganisation(organisation.id, formData);
      onUpdate(updated);
      onOpenChange(false);
    } catch (error) {
      toast.error("Impossible de mettre à jour l'organisation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;organisation</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de votre organisation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="ex: Entreprise, Association"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Secteur</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="ex: Sport, Marketing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Site web</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email_contact">Email</Label>
                <Input
                  id="email_contact"
                  type="email"
                  value={formData.email_contact}
                  onChange={(e) => setFormData({ ...formData, email_contact: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_contact">Téléphone</Label>
                <Input
                  id="phone_contact"
                  type="tel"
                  value={formData.phone_contact}
                  onChange={(e) => setFormData({ ...formData, phone_contact: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_city">Ville</Label>
              <Input
                id="address_city"
                value={formData.address_city}
                onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address_postal_code">Code postal</Label>
                <Input
                  id="address_postal_code"
                  value={formData.address_postal_code}
                  onChange={(e) => setFormData({ ...formData, address_postal_code: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address_country">Pays</Label>
                <Input
                  id="address_country"
                  value={formData.address_country}
                  onChange={(e) => setFormData({ ...formData, address_country: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="founded_year">Année de création</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employees_count">Nombre d&apos;employés</Label>
                <Input
                  id="employees_count"
                  type="number"
                  value={formData.employees_count}
                  onChange={(e) => setFormData({ ...formData, employees_count: e.target.value })}
                  min="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
