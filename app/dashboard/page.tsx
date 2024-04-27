"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import CreateApi from "../createApi/createApi";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [dataemail, setDataEmail] = React.useState("");
  const [selectedObject, setSelectedObject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {}, []);
  useEffect(() => {
    // Hacer la solicitud al backend para obtener el usuario por su correo electrónico
    const fetchUserData = async () => {
      const email = localStorage.getItem("emailtemp");
      try {
        const response = await fetch("http://localhost:2000/api/user-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            email: `${email}`, // Reemplaza con el correo electrónico real del usuario
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setApiData(data);
          setUserData(data);
          setIsLoading(false);
        } else {
          console.error("Error al obtener los datos del usuario");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
      }
    };

    fetchUserData();
  }, []);
  function* idGenerator() {
    let id = 1;
    while (true) {
      yield id++;
    }
  }
  const editDataApi = async () => {
      const email = localStorage.getItem("emailtemp");
      const itemName = document.getElementById("itemName").value
      const itemDescription = document.getElementById("itemDescription").value
      try {
        const response = await fetch("http://localhost:2000/api/userdata", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            email: `${email}`,
            pass: `${userData?.pass}`,
            id: `${userData?._id}`,
            framework: `t`,
            iddata: 1,
            name: `${itemName}`,
            description: `${itemDescription}`,
          },
        });
console.log(response)
        if (response.ok) {
          const data = await response.json();
          console.log(data)
        } else {
          console.error("Error al obtener los datos del usuario");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
      }
  }
  
  return (
    <div>
      {userData && (
        <div>
          <h2>User Data</h2>
          <p>Email: {userData.email}</p>
          <p>id: {userData._id}</p>
          <p>{dataemail}</p>
          <div>
            <Separator />

            <h2>User Data:</h2>
            <p>Email: {apiData.email}</p>
            <p>Password: {apiData.pass}</p>
            <h3>Data:</h3>
            <ul></ul>
          </div>
        </div>
      )}

      <Drawer>
        <DrawerTrigger>
          <Button variant={"ghost"}>View Apis</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your Lists</DrawerTitle>
            <DrawerDescription>List.</DrawerDescription>
            <div className="grid justify-items-center">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {isLoading ? (
                    <div>Cargando...</div>
                  ) : userData ? (
                    Object.entries(userData?.data).map(async ([apiName, apiData]) => (
                      <CarouselItem key={apiName}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <div
                                key={apiName}
                                className="flex flex-col gap-5 items-center"
                              >
                                <span className="text-4xl font-semibold">
                                  {apiName}
                                </span>

                                <Sheet>
                                  <SheetTrigger>
                                    <Button key={apiName}>
                                      Editar: {apiName}
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>
                                        Edita tus productos
                                      </SheetTitle>
                                      <SheetDescription>
                                        <div className="flex flex-col gap-5">
                                          {apiData.map((item, index) => (
                                            <Sheet key={index}>
                                              <SheetTrigger>
                                                <Button>{item.name}</Button>
                                              </SheetTrigger>
                                              <SheetContent>
                                                <SheetHeader>
                                                  <SheetTitle>
                                                    {item.name}
                                                  </SheetTitle>
                                                  <SheetDescription>
                                                    <div>
                                                      <Label key={item.name}>Name: {item.description}</Label>
                                                      <Input placeholder={item.name} key={item.name} id="itemName"/>
                                                      <br />
                                                      <Label key={item.description}>
                                                        Descripción:
                                                        {item.getFramework}
                                                      </Label>
                                                      <Input placeholder={item.description} key={item.description} id="itemDescription"/>
                                                      <br />
                                                      <Label key={item.idData}>
                                                      idData:
                                                        {item.idData}
                                                      </Label>
                                                      <br />
                                                      <p>
                                                        Badges:
                                                        {item.getBadges.map(
                                                          (badge, index) => (
                                                            <Badge key={index}>
                                                              {badge.label}
                                                            </Badge>
                                                          )
                                                        )}
                                                      </p>
                                                    </div>
                                                    <br />
                                                    <Button onClick={editDataApi}>Cambiar</Button>
                                                  </SheetDescription>
                                                </SheetHeader>
                                              </SheetContent>
                                            </Sheet>
                                          ))}
                                        </div>
                                      </SheetDescription>
                                    </SheetHeader>
                                  </SheetContent>
                                </Sheet>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <div>No se pudo obtener los datos</div>
                  )}
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
      <CreateApi email={userData?.email} />
    </div>
  );
}

export default Dashboard;
