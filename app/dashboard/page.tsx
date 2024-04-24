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
import CreateApi from "../createApi/createApi";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [dataemail, setDataEmail] = React.useState("");
  React.useEffect(() => {
  }, []);
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
          console.log(data);
        } else {
          console.error("Error al obtener los datos del usuario");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
      }
    };

    fetchUserData();
  }, []);

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
            <ul>
            </ul>
          </div>
        </div>
      )}
      <CreateApi email={userData?.email}/>
    </div>
  );
}

export default Dashboard;
