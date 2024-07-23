'use server'
import { cookies } from 'next/headers'

interface userData {
  email: String
}
const cookieStore = cookies()
export async function getUserData(email:string): Promise<userData> {

    try {
      const response = await fetch("http://localhost:2000/api/user-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          email: `${email}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        cookieStore.set('email',data.email)
        cookieStore.set('_id',data._id)
        return data;
      } else {
        throw new Error("Error al obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      throw error;
    }
  }
  export async function getCookieData() {
    const email = cookieStore.get('email')?.value
    const id = cookieStore.get('_id')?.value

    return {email , id}
  }