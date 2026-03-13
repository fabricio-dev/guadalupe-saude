"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import UpsertSellerForm from "./upsert-seller-form";

interface AddSellerButtonProps {
  clinicId: string;
}

const AddSellerButton = ({ clinicId }: AddSellerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-600 hover:bg-sky-700">
          <Plus />
          Novo Vendedor
        </Button>
      </DialogTrigger>
      <UpsertSellerForm
        isOpen={isOpen}
        onSuccess={() => setIsOpen(false)}
        clinicId={clinicId}
      />
    </Dialog>
  );
};

export default AddSellerButton;
