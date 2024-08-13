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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateApi from "../createApi/createApi";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getUserData } from "./getUserData";
import { putUserEdit } from "./putUserEdit";
import SelectWrapper from "./SelectWrapper";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [apiData, setApiData] = useState(null);
  let selectToChange = ''

  const fetchData = async () => {
    try {
      const email = localStorage.getItem("emailtemp");
      const userDataResponse = await getUserData(email);
      setUserData(userDataResponse);
      setApiData(userDataResponse);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleSelectedValueChange = (newValue) => {
    console.log("Nuevo valor seleccionado:", newValue);
    selectToChange = newValue
  };
  const editDataApi = async () => {
    console.log(selectToChange)
    const email = localStorage.getItem("emailtemp");
    const itemName = document.getElementById("itemName").value;
    const itemDescription = document.getElementById("itemDescription").value;
    const itemGetFramework = document.getElementById("itemGetFramework")?.textContent;
    const itemIddata = document.getElementById("itemIddata")?.textContent
    putUserEdit(
      email,
      userData?.pass,
      userData?._id,
      itemGetFramework,
      selectToChange,
      itemIddata,
      itemName,
      itemDescription
    );
  };

  return (
    <div>
      {userData && (
        <div>
          <h2>User Data</h2>
          <p>Email: {apiData.email}</p>
          <p>id: {apiData._id}</p>
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
                    Object.entries(userData?.data).map(
                      async ([apiName, apiData]) => (
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
                                                        <Label key={item.name}>
                                                          Name:{" "}
                                                          {item.description}
                                                        </Label>
                                                        <Input
                                                          placeholder={
                                                            item.name
                                                          }
                                                          key={item.name}
                                                          id="itemName"
                                                        />
                                                        <br />
                                                        <Label
                                                          key={item.description}
                                                        >
                                                          Descripción:
                                                          {item.description}
                                                        </Label>
                                                        <Input
                                                          placeholder={
                                                            item.description
                                                          }
                                                          key={item.description}
                                                          id="itemDescription"
                                                        />
                                                        <br />
                                                        <Label
                                                          key={item.iddata}
                                                          id="itemIddata"
                                                        >
                                                          {item.idData}
                                                        </Label>
                                                        <br />
                                                        <Label
                                                          key={item.getFramework}
                                                          id="itemGetFramework"
                                                        >
                                                          {item.getFramework}
                                                        </Label>
                                                        <br />
                                                        <p>
                                                          Badges:
                                                          {item.getBadges.map(
                                                            (badge, index) => (
                                                              <Badge
                                                                key={index}
                                                              >
                                                                {badge.label}
                                                              </Badge>
                                                            )
                                                          )}
                                                        </p>
                                                        <SelectWrapper onSelectedValueChange={handleSelectedValueChange}>
                                                        {({ selectedValue, handleSelectChange }) => (
                                                        <Select
                                                          value={selectedValue}
                                                          onValueChange={
                                                            handleSelectChange
                                                          }
                                                        >
                                                          <SelectTrigger>
                                                            <SelectValue placeholder="Select api to add" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <SelectGroup>
                                                              {Object.entries(
                                                                userData.data
                                                              ).map(
                                                                ([
                                                                  key,
                                                                  value,
                                                                ]) => (
                                                                  <SelectItem
                                                                    key={key}
                                                                    value={key}
                                                                  >
                                                                    {key}
                                                                  </SelectItem>
                                                                )
                                                              )}
                                                            </SelectGroup>
                                                          </SelectContent>
                                                        </Select>
                                                        )}
                                                        </SelectWrapper>
                                                      </div>
                                                      <br />
                                                      <Button
                                                        onClick={editDataApi}
                                                      >
                                                        Cambiar
                                                      </Button>
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
                      )
                    )
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
