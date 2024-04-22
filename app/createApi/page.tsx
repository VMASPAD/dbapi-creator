"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AddBadges } from "../components/AddBadges";

export default function CreateApi() {
  const [badge, setBadge] = React.useState([]);
  const [imageData, setImageData] = React.useState([]);

  React.useEffect(() => {
    const getBadges = JSON.parse(localStorage.getItem("types"));
    console.log(getBadges);
    setBadge(getBadges);
  }, []);
  const handleData = (data) => {
    console.log(data);
    setImageData(data);
  };
  const getAllData = async () => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const getFramework = document.getElementById("framework").value;
    const getBadges = JSON.parse(localStorage.getItem("types"));
    const data = {
      img: imageData,
      name: name,
      description: description,
      getFramework: getFramework,
      getBadges: getBadges,
    };
  console.log(data)
    try {
      const response = await fetch('http://localhost:2000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        console.log('Datos guardados correctamente');
      } else {
        console.error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };
  
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Add Product to your API.</CardDescription>
      </CardHeader>
      <CardContent>
        <ImageUploader handleData={handleData}/>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name product." />
              <Label htmlFor="description">Description</Label>
              <Textarea placeholder="Description." id="description" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select api to add" />
                </SelectTrigger>
                <SelectContent position="popper"></SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <Label htmlFor="badges">Badges</Label>
        <div>
          {badge.length > 0 ? (
            badge.map((badges) => (
              <Badge variant="outline">{badges.value}</Badge>
            ))
          ) : (
            <p>Not Badges</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={getAllData}>Create</Button>
        <Drawer>
          <DrawerTrigger>
            <Button variant={"ghost"}>New</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Your Products</DrawerTitle>
              <DrawerDescription>List.</DrawerDescription>
              <div className="grid justify-items-center">
                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <span className="text-4xl font-semibold">
                                {index + 1}
                              </span>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant={"ghost"}>Describe your product</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Describe your product</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
              <AddBadges />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

const ImageUploader = ({ handleData }) => {
  const [selectedImages, setSelectedImages] = React.useState([]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        images.push(e.target?.result);
        setSelectedImages(images);
        handleData(images);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <div>
        <>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {selectedImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <img src={image} alt="" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      </div>
    </div>
  );
};


export { ImageUploader };