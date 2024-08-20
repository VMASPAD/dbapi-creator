// @ts-nocheck
"use client";
import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { appDir, resolveResource } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/api/shell';

export default function Home() {
  const [email, setEmail] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const emailInput = document.getElementById('email').value;
    localStorage.setItem("emailtemp",emailInput)
    
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    localStorage.removeItem("emailtemp")
    localStorage.setItem("emailtemp",emailInput)
    try {
      const response = await fetch('http://localhost:2000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput, pass: passwordInput }),
      });

      const data = await response.json();

      if (response.ok) {

        setEmail(data.email);
        router.push('/dashboard');
      } else {
        console.error('Error al iniciar sesión:', data.error);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    localStorage.setItem("emailtemp",emailInput)
    localStorage.removeItem("emailtemp")
    localStorage.setItem("emailtemp",emailInput)

    try {
      const response = await fetch('http://localhost:2000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput, pass: passwordInput, data: {"t":[]} }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(data.email);
        router.push('/createDb');
      } else {
        console.error('Error al registrar:', data.error);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Mail</Label>
                <Input id="email" type="email" placeholder="Mail" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input id="password" type="password" placeholder="Pass" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRegister}>Register</Button>
          <Button onClick={handleLogin}>Login</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
