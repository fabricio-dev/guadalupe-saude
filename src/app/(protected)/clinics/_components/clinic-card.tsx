"use client";

import dayjs from "dayjs";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { clinicsTable } from "@/db/schema";

import UpsertClinicForm from "./upsert-clinic-form";

type ClinicForCard = Pick<
  typeof clinicsTable.$inferSelect,
  | "id"
  | "name"
  | "createdAt"
  | "updatedAt"
  | "editedBy"
  | "individualActivationPriceInCents"
  | "individualRenovationPriceInCents"
  | "enterpriseActivationPriceInCents"
  | "enterpriseRenovationPriceInCents"
> & {
  editedByName?: string | null;
};

interface ClinicCardProps {
  clinic: ClinicForCard;
}
const ClinicCard = ({ clinic }: ClinicCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (date?: Date | null) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
  };

  const editedByLabel = clinic.editedByName?.trim()
    ? `Atualizada por: ${clinic.editedByName}`
    : clinic.editedBy?.trim()
      ? `Atualizada por: ${clinic.editedBy}`
      : "";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-sky-900">{clinic.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Criada em:</strong> {formatDate(clinic.createdAt)}
          </p>

          {clinic.updatedAt && clinic.updatedAt !== clinic.createdAt && (
            <p>
              <strong>Atualizada em:</strong> {formatDate(clinic.updatedAt)}
            </p>
          )}
          {editedByLabel ? <p>{editedByLabel}</p> : null}
        </div>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" /> Editar unidade
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <UpsertClinicForm
          clinic={clinic}
          onSuccess={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </Card>
  );
};

export default ClinicCard;
