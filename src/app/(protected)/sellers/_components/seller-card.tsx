"use client";

import {
  Building2,
  DollarSign,
  KeyRound,
  PencilIcon,
  Percent,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { sellersTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import GenerateLinkButton from "../../_components/generate-link-button";
import UpsertSellerForm from "./upsert-seller-form";

interface SellerCardProps {
  seller: typeof sellersTable.$inferSelect & {
    patientsCount: number;
    clinicName: string | null;
    enterpriseCount: number;
    faturamentoInCents: number;
  };
}
const SellerCard = ({ seller }: SellerCardProps) => {
  const [isUpsertSellerFormOpen, setIsUpsertSellerFormOpen] = useState(false);

  const sellerInitials = seller.name
    .split(" ")
    .slice(0, 2)
    .map((name) => name[0])
    .join("");

  const faturamentoCents = Number(seller.faturamentoInCents ?? 0);
  const commissionCents = Math.round(
    (faturamentoCents * seller.percentage) / 100,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-md bg-sky-50 font-medium text-sky-600">
              {sellerInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{seller.name}</h3>
            <p className="text-muted-foreground text-sm">{seller.email}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4 text-sky-600" />
            Unidade:
          </div>
          <span className="font-semibold">
            {seller.clinicName || "Sem clínica"}
          </span>
        </Badge>
        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-sky-600" />
            Convênios totais:
          </div>
          <span className="font-semibold">{seller.patientsCount}</span>
        </Badge>
        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-sky-600" />
            Convênios de empresas:
          </div>
          <span className="font-semibold">{seller.enterpriseCount}</span>
        </Badge>
        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-sky-600" />
            Faturamento:
          </div>
          <span className="font-semibold">
            {formatCurrencyInCents(faturamentoCents)}
          </span>
        </Badge>

        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <Percent className="mr-2 h-4 w-4 text-sky-600" />
            Comissão:
          </div>
          <span className="font-semibold">
            {formatCurrencyInCents(commissionCents)}
          </span>
        </Badge>
        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <KeyRound className="mr-2 h-4 w-4 text-sky-600" />
            Tipo de Chave PIX:
          </div>
          <span className="font-semibold">{seller.pixKeyType}</span>
        </Badge>
        <Badge variant="outline" className="justify-between">
          <div className="flex items-center">
            <KeyRound className="mr-2 h-4 w-4 text-sky-600" />
            Chave PIX:
          </div>
          <span className="font-semibold">{seller.pixKey}</span>
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex gap-2">
        <Dialog
          open={isUpsertSellerFormOpen}
          onOpenChange={setIsUpsertSellerFormOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex-1 bg-sky-600/90 hover:bg-sky-700">
              <PencilIcon className="mr-1" />
              Editar
            </Button>
          </DialogTrigger>
          <UpsertSellerForm
            isOpen={isUpsertSellerFormOpen}
            seller={seller}
            onSuccess={() => setIsUpsertSellerFormOpen(false)}
          />
        </Dialog>
        <GenerateLinkButton sellerId={seller.id} sellerName={seller.name} />
      </CardFooter>
    </Card>
  );
};

export default SellerCard;
