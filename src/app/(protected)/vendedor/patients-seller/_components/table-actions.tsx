"use client";

import {
  CheckCircle,
  // CreditCardIcon,
  Edit2,
  MoreHorizontal,
  PrinterIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import PrintCardComponent from "@/app/(protected)/_components/print-card-component";
//import { RenewalLinkDialog } from "@/app/(protected)/_components/renewal-link-dialog";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import UpsertPatientForm from "./upsert-patient-form";

interface Patient {
  id: string;
  name: string;
  cpfNumber: string | null;
  phoneNumber: string;
  city: string | null;
  cardType: "enterprise" | "personal";
  numberCards: number | null;
  expirationDate: Date | null;
  birthDate: Date | null;
  rgNumber: string | null;
  address: string | null;
  homeNumber: string | null;
  state: string | null;
  Enterprise: string | null;
  dependents1: string | null;
  dependents2: string | null;
  dependents3: string | null;
  dependents4: string | null;
  dependents5: string | null;
  dependents6: string | null;
  observation: string | null;
  statusAgreement: "expired" | "pending" | null;
  createdAt: Date;
  updatedAt: Date | null;
  sellerId: string | null;
  clinicId: string | null;
  seller?: { name: string } | null;
  isActive: boolean;
  reactivatedAt: Date | null;
  activeAt: Date | null;
  whatsappConsent: boolean;
  paymentType: "PIX" | "CARD" | "DINHEIRO" | null;
  priceInCents: number;
  priceInCentsRenovation: number;
  paymentStatus:
    | "PENDING"
    | "PROOF_SUBMITTED"
    | "PAID"
    | "FAILED"
    | "CANCELED"
    | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  pixProofNote: string | null;
  paidAt: Date | null;
  editedBy: string | null;
  editedAt: Date | null;
}

interface TableActionsProps {
  patient: Patient;
  isExpired: boolean;
  isPending: boolean;
  onActivate: (
    patientId: string,
    paymentType: "PIX" | "CARD" | "DINHEIRO",
  ) => void;
  onDelete: (patientId: string) => void;
  onPrintContract: (patient: Patient) => void;
  sellerId: string;
  clinicId: string;
}

const PAYMENT_TYPE_OPTIONS: {
  value: "PIX" | "CARD" | "DINHEIRO";
  label: string;
}[] = [
  { value: "PIX", label: "PIX" },
  { value: "CARD", label: "Cartão" },
  { value: "DINHEIRO", label: "Dinheiro" },
];
export default function TableActions({
  patient,
  isExpired,
  isPending,
  onActivate,
  onDelete,
  onPrintContract,
  sellerId,
  clinicId,
}: TableActionsProps) {
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "" | "PIX" | "CARD" | "DINHEIRO"
  >("");

  const handleActivateDialogOpenChange = (open: boolean) => {
    setActivateDialogOpen(open);
    if (!open) setSelectedPaymentType("");
  };

  const handleActivateConfirm = () => {
    if (!selectedPaymentType) return;
    onActivate(patient.id, selectedPaymentType);
    setActivateDialogOpen(false);
  };
  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog>
            <DialogTitle hidden>Editar Paciente</DialogTitle>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <UpsertPatientForm
                patient={{
                  ...patient,
                  birthDate: patient.birthDate
                    ? patient.birthDate.toISOString().split("T")[0]
                    : "",
                  clinicId: patient.clinicId,
                  isActive: patient.isActive,
                  reactivatedAt: patient.reactivatedAt,
                  activeAt: patient.activeAt,
                }}
                isOpen={true}
                sellerId={sellerId}
                clinicId={clinicId}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <PrinterIcon className="mr-2 h-4 w-4" />
              Imprimir
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem asChild>
                <div className="cursor-pointer">
                  <PrintCardComponent
                    patient={{
                      ...patient,
                      birthDate: patient.birthDate
                        ? patient.birthDate.toISOString().split("T")[0]
                        : "",
                      seller: patient.seller || null,
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-auto w-full justify-start p-0 font-normal"
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onPrintContract(patient)}
                className="cursor-pointer"
              >
                <PrinterIcon className="mr-2 h-4 w-4" />
                Imprimir Contrato
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {/* <RenewalLinkDialog
            patientId={patient.id}
            isAllowed={isExpired || isPending}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <CreditCardIcon className="mr-2 h-4 w-4" /> Link de pagamento
              </DropdownMenuItem>
            }
          /> */}
          <AlertDialog
            open={activateDialogOpen}
            onOpenChange={handleActivateDialogOpenChange}
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setActivateDialogOpen(true);
              }}
              className={`cursor-pointer ${isExpired ? "text-green-600" : "text-muted-foreground"}`}
            >
              <CheckCircle
                className={`mr-2 h-4 w-4 ${isExpired ? "text-green-600" : "text-muted-foreground"}`}
              />
              {isPending ? "Ativar" : "Renovar"}
            </DropdownMenuItem>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isPending ? "Ativar convenio" : "Renovar convenio"}
                </AlertDialogTitle>
                <AlertDialogDescription className="rounded-md p-2 text-center text-xl font-bold text-red-500">
                  {isPending
                    ? "Atenção! Este convenio está aguardando aprovação. Ao ativar-lo, você estará confirmando que o cliente já fez o pagamento. Isso irá garantir acesso aos benefícios do convenio."
                    : isExpired
                      ? "Atenção! Tem certeza que deseja renovar este convenio? Isso irá renovar a data de vencimento por mais 1 ano."
                      : "Atenção! Tem certeza que deseja fazer a renovação antecipada deste convenio?  Isso irá somar 1 ano a data de vencimento atual."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-2 py-2">
                <Label htmlFor="activate-payment-type">
                  Meio de pagamento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedPaymentType || undefined}
                  onValueChange={(v) =>
                    setSelectedPaymentType(v as "PIX" | "CARD" | "DINHEIRO")
                  }
                  required
                >
                  <SelectTrigger id="activate-payment-type" className="w-full">
                    <SelectValue placeholder="Selecione o meio de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleActivateConfirm}
                  disabled={!selectedPaymentType}
                >
                  {isPending ? "Ativar" : "Renovar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                hidden={true}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Convenio</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este convenio? Esta ação não
                  pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(patient.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
