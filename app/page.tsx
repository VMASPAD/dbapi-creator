"use client";
import * as React from "react"
import CreateApi from "./createApi/page"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <CreateApi />
    </main>
  )
}
