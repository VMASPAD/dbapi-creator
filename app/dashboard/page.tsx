"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';

function Dashboard() {

  const searchParams = useSearchParams()
  const person = searchParams.get("email")
  const resutls = JSON.stringify(person)
  console.log(resutls)

  return (
    <div>
      <p>Dashboard the {resutls}</p>
    </div>
  )
}

export default Dashboard
