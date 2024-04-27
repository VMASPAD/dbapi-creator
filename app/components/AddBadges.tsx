"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Edit, Trash } from "lucide-react";

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
  const [editIndex, setEditIndex] = React.useState(-1);
  const [editValue, setEditValue] = React.useState("");
  const [editLabel, setEditLabel] = React.useState("");
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const { toast } = useToast();

  // Obtener los datos del localStorage cada vez que se actualizan
  React.useEffect(() => {
    const storedFrameworks = JSON.parse(localStorage.getItem("types")) || [];
    setFrameworks(storedFrameworks);
  }, []);

  const getDataBadge = () => {
    const nameBadge = document.getElementById("nameBadge").value;
    const valueBadge = document.getElementById("valueBadge").value;

    let types = JSON.parse(localStorage.getItem("types")) || [];

    const newType = {
      value: valueBadge,
      label: nameBadge,
    };

    types.push(newType);
    localStorage.setItem("types", JSON.stringify(types));
    setFrameworks(types);
  };

  const editDataBadge = () => {
    let types = JSON.parse(localStorage.getItem("types")) || [];

    types[editIndex] = {
      value: editValue,
      label: editLabel,
    };

    localStorage.setItem("types", JSON.stringify(types));
    setFrameworks(types);
    setEditIndex(-1);
    setEditValue("");
    setEditLabel("");
  };

  const removeDataBadge = (index) => {
    let types = JSON.parse(localStorage.getItem("types")) || [];
    types.splice(index, 1);
    localStorage.setItem("types", JSON.stringify(types));
    setFrameworks(types);
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
              frameworks.map((framework, index) => (
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
                  <Edit
  className="ml-2 h-4 w-4 cursor-pointer"
  onClick={() => {
    setEditIndex(index);
    setEditValue(framework.value);
    setEditLabel(framework.label);
    setEditDialogOpen(true); // Abre el diálogo de edición
  }}
/>

                  <Trash
                    className="ml-2 h-4 w-4 cursor-pointer"
                    onClick={() => removeDataBadge(index)}
                  />
                </CommandItem>
              ))
            ) : (
              <p>Not Badges</p>
            )}
          </CommandGroup>
        </Command>
        {editIndex !== -1 && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Badge</DialogTitle>
                <DialogDescription>Edit Badge</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editLabel" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="editLabel"
                    className="col-span-3"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editValue" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="editValue"
                    className="col-span-3"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    editDataBadge();
                    toast({
                      title: "Badge Edited!",
                      description: "Badge Edited Succesfully!",
                    });
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PopoverContent>
    </Popover>
  );
}