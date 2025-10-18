"use client";

// Contract Detail page: shows full contract information and allows management

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Edit,
  Trash2,
  MessageSquare,
  Handshake,
  XCircle,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  getContract,
  changeContractStatus,
  agreeToContract,
  exportContractPDF,
} from "@/lib/api/contracts";
import { toast } from "sonner";

const STATUS_CONFIG = {
  draft: {
    label: "Brouillon",
    icon: FileText,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  negotiation: {
    label: "Négociation",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  agreement: {
    label: "Accord",
    icon: Handshake,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  legal_review: {
    label: "Révision légale",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  signing: {
    label: "Signature",
    icon: FileText,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  active: {
    label: "Actif",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  expired: {
    label: "Expiré",
    icon: Clock,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  terminated: {
    label: "Résilié",
    icon: XCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

export default function ContractDetailPage() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const params = useParams();
  const contractId = params.id;

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Load contract
  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const data = await getContract(contractId);
        setContract(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast.error("Erreur lors du chargement du contrat");
        router.push("/collab");
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContract();
    }
  }, [contractId, router]);

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      await changeContractStatus(contractId, newStatus);
      const updatedContract = await getContract(contractId);
      setContract(updatedContract);
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Erreur lors du changement de statut");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAgree = async () => {
    try {
      setActionLoading(true);
      await agreeToContract(contractId);
      const updatedContract = await getContract(contractId);
      setContract(updatedContract);
      toast.success("Accord enregistré avec succès");
    } catch (error) {
      console.error("Error agreeing to contract:", error);
      toast.error("Erreur lors de l'enregistrement de l'accord");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setActionLoading(true);
      await exportContractPDF(contractId);
      toast.success("Export en cours...");
    } catch (error) {
      console.error("Error exporting contract:", error);
      toast.error("Erreur lors de l'export");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <SidebarInset className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (!contract) {
    return null;
  }

  const statusConfig = STATUS_CONFIG[contract.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;

  const canEdit = contract.status === "draft" || contract.status === "negotiation";
  const canAgree = contract.status === "agreement" && 
    (!contract.owner_agreed_at || !contract.agent_agreed_at);

  return (
    <SidebarInset className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/collab")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux collaborations
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`size-12 rounded-lg flex items-center justify-center ${statusConfig.color}`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{contract.title}</h1>
                  <Badge className={`${statusConfig.color} mt-1`}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={actionLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/collab/${contractId}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Organisation */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold">Organisation</h3>
            </div>
            {contract.organisation ? (
              <div>
                <p className="font-medium">{contract.organisation.name}</p>
                {contract.owner_agreed_at && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Accord signé le {formatDate(contract.owner_agreed_at)}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Non défini</p>
            )}
          </div>

          {/* Agent */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold">Agent</h3>
            </div>
            {contract.agent ? (
              <div>
                <p className="font-medium">{contract.agent.name}</p>
                {contract.agent_agreed_at && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Accord signé le {formatDate(contract.agent_agreed_at)}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Non défini</p>
            )}
          </div>

          {/* Dates */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold">Période</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Début: </span>
                <span className="font-medium">{formatDate(contract.effective_date)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fin: </span>
                <span className="font-medium">{formatDate(contract.expiration_date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clauses */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-semibold">Clauses du contrat</h2>
            </div>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/collab/${contractId}/clauses`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une clause
              </Button>
            )}
          </div>

          {contract.clauses && contract.clauses.length > 0 ? (
            <div className="space-y-3">
              {contract.clauses.map((clause, index) => (
                <div
                  key={clause.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Clause {index + 1}
                        </span>
                        {clause.is_mandatory && (
                          <Badge variant="outline" className="text-xs">
                            Obligatoire
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold mb-2">{clause.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clause.content}
                      </p>
                    </div>
                    {canEdit && !clause.is_mandatory && (
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune clause ajoutée pour le moment
            </p>
          )}
        </div>

        {/* Actions */}
        {canAgree && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Validation du contrat</h3>
                <p className="text-sm text-muted-foreground">
                  Les deux parties doivent donner leur accord avant de passer à la signature.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={actionLoading}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Donner mon accord
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer l&apos;accord</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous confirmez avoir lu et accepté les termes de ce contrat.
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAgree}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        {/* Version Info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Version {contract.current_version_number} • Créé le{" "}
            {formatDate(contract.created_at)} • Dernière modification le{" "}
            {formatDate(contract.updated_at)}
          </p>
        </div>
      </div>
    </SidebarInset>
  );
}
