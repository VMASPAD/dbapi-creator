// @ts-nocheck
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
import { getCookieData, getUserData } from "./getUserData";
import { putUserEdit } from "./putUserEdit";
import SelectWrapper from "./SelectWrapper";
import { useToast } from "@/components/ui/use-toast";

function Dashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [apiData, setApiData] = useState(null);
  let selectToChange = ''

  const fetchData = async () => {
    try {
      const email = localStorage.getItem("emailtemp")
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
  const handleClick = () => {
    editDataApi();
    toast({
      title: "Changed",
      description: "Reload the webpage to view changes",
    });
  };
const changeApiDb = async  (oldkey: string) => {
  const dataCookie = await getCookieData()
  const apiName = (document.getElementById('apiName') as HTMLInputElement).value
  const response = await fetch("http://localhost:2000/api/changeApiDb", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'email': `${(await dataCookie).email}`,
      'id': `${(await dataCookie).id}`,
      'oldkey': `${oldkey}`,
      'newkey': `${apiName}`
    },
  }); 
 } 
  return (
    <div className="flex flex-col justify-center items-center">
      {userData && (
        <><div className="grid grid-cols-4 justify-center justify-items-center items-center">
          <p>Email: {apiData.email}</p>
          <p>id: {apiData._id}</p>
          <a href="/createDb">Create new DB</a>
      <Drawer>
        <DrawerTrigger>
          <Button variant={"ghost"}>View Apis</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your DBs</DrawerTitle>
            <DrawerDescription>Edit your DBs and products.</DrawerDescription>
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
                                        Editar 
                                      </Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                      <SheetHeader>
                                        <SheetTitle>
                                          Edit your products
                                        </SheetTitle>
                                        <SheetDescription>
                                          <div className="flex flex-col gap-5">
                                            <Input id="apiName" placeholder={apiName}/>
                                            <Button onClick={() => changeApiDb(apiName)}>Change</Button>
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
                                                        onClick={handleClick}
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
            <DrawerClose>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
        </div><Separator /></>
      )}
      <br />
      <CreateApi email={userData?.email} />
    </div>
  );
}

export default Dashboard;
