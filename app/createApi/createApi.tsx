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
  SelectGroup,
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

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AddBadges } from "../components/AddBadges";

export default function CreateApi({email}) {
  const [badge, setBadge] = React.useState([]);
  const [imageData, setImageData] = React.useState([]);
  const [userData, setUserData] = React.useState(null);
  const [selectedValue, setSelectedValue] = React.useState("");

  React.useEffect(() => {
    const getBadges = JSON.parse(localStorage.getItem("types"));
    console.log(getBadges);
    const email = localStorage.getItem("emailtemp");
    setBadge(getBadges);
    getUserData(email);
    console.log(email)
  }, []);
  const handleData = (data) => {
    setImageData(data)
    console.log(data);
  };

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };
  function* idGenerator() {
    let id = 1;
    while (true) {
      yield id++;
    }
  }
  const getAllData = async () => {
    const generateID = idGenerator();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const getBadges = JSON.parse(localStorage.getItem("types"));
    const data = {
      idData: generateID.next().value,
      img: await imageData,
      name: name,
      description: description,
      getFramework: selectedValue,
      getBadges: getBadges,
    };
    console.log(data);
    try {
      const response = await fetch("http://localhost:2000/api/data/content-array", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: `${email}`, // Aquí puedes cambiar por el correo electrónico del usuario
          framework: `${selectedValue}` // Nombre del framework al que se agregará el contenido
        },
        body: JSON.stringify(data), // El contenido a agregar se envía en el cuerpo de la solicitud
      });
  
      if (response.ok) {
        console.log("Datos guardados correctamente");
      } else {
        console.error("Error al guardar los datos",);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };
  const getUserData = async (emailUser) => {
    try {
      const response = await fetch("http://localhost:2000/api/user-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          email: await `${emailUser}`, // Aquí puedes cambiar por el correo electrónico del usuario
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Datos del usuario:", userData);

        // Mostrar las matrices de datos
        if (userData.data) {
          setUserData(userData.data);
        } else {
          console.log("No se encontraron matrices de datos");
        }
      } else {
        console.error("Error al obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Product, {email}</CardTitle>
        <CardDescription>Add Product to your API.</CardDescription>
      </CardHeader>
      <CardContent>
        <ImageUploader handleData={handleData} />
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
              <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger >
                  <SelectValue placeholder="Select api to add" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {userData &&
                      userData.data &&
                      Object.entries(userData.data).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
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
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
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
