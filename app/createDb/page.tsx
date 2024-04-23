"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
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

function CreateDb() {
  const [email, setEmail] = React.useState("");
  const [arrayName, setArrayName] = React.useState(""); // Nuevo estado para almacenar el nombre del array

  React.useEffect(() => {
    const email = JSON.stringify(localStorage.getItem("emailtemp"));
    setEmail(email);
  }, []);

  const handleDeploy = async () => {
    try {
      console.log(JSON.stringify({ arrayName }))
      const response = await fetch("http://localhost:2000/api/data/add-array", {
        method: "POST",
        headers: {
          email: email, // Enviar el correo electrónico en el encabezado de la petición
        },
        body: JSON.stringify({ arrayName }), // Enviar el nombre del array en el cuerpo de la petición
      });
      if (response.ok) {
        console.log("Nuevo array creado correctamente");
      } else {
        console.error("Error al crear el nuevo array");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Create Db"
                value={arrayName}
                onChange={(e) => setArrayName(e.target.value)} // Actualizar el estado del nombre del array
              />
              <h1>Email: {email}</h1>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleDeploy}>Deploy</Button> {/* Manejar el click del botón para desplegar el array */}
      </CardFooter>
    </Card>
  );
}

export default CreateDb;
