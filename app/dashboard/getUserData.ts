interface userData {
  email: String
}
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
        return data;
      } else {
        throw new Error("Error al obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      throw error;
    }
  }