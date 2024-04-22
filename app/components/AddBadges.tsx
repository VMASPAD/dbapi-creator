"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function AddBadges() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [frameworks, setFrameworks] = React.useState([]);

  const { toast } = useToast();

  // Obtener los datos del localStorage cada vez que se actualizan
  React.useEffect(() => {
    const storedFrameworks = JSON.parse(localStorage.getItem("types")) || [];
    setFrameworks(storedFrameworks);
  }, []);

  const getDataBadge = () => {
    const nameBadge = document.getElementById("nameBadge").value;
    const valueBadge = document.getElementById("valueBadge").value;

    // Obtener la matriz "types" actual del almacenamiento local o crear una nueva matriz vacía si aún no existe
    let types = JSON.parse(localStorage.getItem("types")) || [];

    // Crear un nuevo objeto con los datos obtenidos de los campos nameBadge y valueBadge
    const newType = {
      value: valueBadge,
      label: nameBadge,
    };

    // Agregar el nuevo objeto a la matriz "types"
    types.push(newType);

    // Guardar la matriz actualizada en el almacenamiento local
    localStorage.setItem("types", JSON.stringify(types));

    // Actualizar el estado de frameworks para reflejar los cambios en el localStorage
    setFrameworks(types);

    console.log(types);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select badge"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select badge" />
          <CommandGroup>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Badge</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Badge</DialogTitle>
                  <DialogDescription>Create Badge</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nameBadge" className="text-right">
                      Name
                    </Label>
                    <Input id="nameBadge" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valueBadge" className="text-right">
                      Value
                    </Label>
                    <Input id="valueBadge" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      getDataBadge();
                      toast({
                        title: "Badge Saved!",
                        description: "Badge Saved Succesfully!",
                      });
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {frameworks.length > 0 ? (
              frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))
            ) : (
              <p>Not Badges</p>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}