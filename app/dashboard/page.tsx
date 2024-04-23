"use client"
import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [dataemail, setDataEmail] = React.useState("")
  React.useEffect(() => {
      const email = localStorage.getItem("emailtemp")
      console.log(email)
      setDataEmail(email)
    }, []);
  useEffect(() => {
    // Hacer la solicitud al backend para obtener el usuario por su correo electrónico
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:2000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'email': 'tomaseavila@gmail.com' // Reemplaza con el correo electrónico real del usuario
          }
        });

        const responseApi = await fetch('http://localhost:2000/data/tomaseavila_gmail_coms', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          const api = await responseApi.json()
          setApiData(api)
          setUserData(data);
          console.log(api)
        } else {
          console.error('Error al obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
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
          <p>Nombre: {userData._id}</p>
          <p>{dataemail}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
