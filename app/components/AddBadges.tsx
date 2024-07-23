import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area"

export function AddBadges() {
  const { toast } = useToast();
  const [badges, setBadges] = useState([]);
  const [newBadge, setNewBadge] = useState({ name: '', value: '' });
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    const storedBadges = JSON.parse(localStorage.getItem("badges")) || [];
    setBadges(storedBadges);
  }, []);

  useEffect(() => {
    localStorage.setItem("badges", JSON.stringify(badges));
  }, [badges]);

  const addBadge = () => {
    if (newBadge.name && newBadge.value) {
      setBadges([...badges, { ...newBadge, active: true }]);
      setNewBadge({ name: '', value: '' });
      toast({
        title: "Badge added",
        description: "Your new badge has been added successfully.",
      });
    }
  };

  const toggleBadge = (index) => {
    const updatedBadges = badges.map((badge, i) => 
      i === index ? { ...badge, active: !badge.active } : badge
    );
    setBadges(updatedBadges);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const saveEdit = (index, field, value) => {
    const updatedBadges = badges.map((badge, i) => 
      i === index ? { ...badge, [field]: value } : badge
    );
    setBadges(updatedBadges);
    setEditingIndex(-1);
  };

  const deleteBadge = (index) => {
    const updatedBadges = badges.filter((_, i) => i !== index);
    setBadges(updatedBadges);
    toast({
      title: "Badge deleted",
      description: "The badge has been removed.",
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Badge</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your badge</DialogTitle>
            <DialogDescription>
              <Input 
                placeholder="Name" 
                value={newBadge.name}
                onChange={(e) => setNewBadge({...newBadge, name: e.target.value})}
              />
              <Input 
                placeholder="Value" 
                value={newBadge.value}
                onChange={(e) => setNewBadge({...newBadge, value: e.target.value})}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={addBadge}>Add Badge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ScrollArea className="h-96 w-auto rounded-md border p-4">
      <Table>
        <TableCaption>Your Badges</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Active</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badges.map((badge, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={badge.active}
                  onCheckedChange={() => toggleBadge(index)}
                />
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input
                    value={badge.name}
                    onChange={(e) => saveEdit(index, 'name', e.target.value)}
                    onBlur={() => setEditingIndex(-1)}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => startEditing(index)}>{badge.name}</span>
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input
                    value={badge.value}
                    onChange={(e) => saveEdit(index, 'value', e.target.value)}
                    onBlur={() => setEditingIndex(-1)}
                  />
                ) : (
                  <span onClick={() => startEditing(index)}>{badge.value}</span>
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => deleteBadge(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </ScrollArea>
    </>
  );
}

export default AddBadges;