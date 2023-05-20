import React from "react"
import { Outlet, Navigate, useLocation } from "react-router-dom"
import Header from "./Header"

function AuthRequired() {
  const token = localStorage.getItem("token")

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{
          message: "You must log in first.",
        }}
        replace
      />
    )
  }
  return (
    <>
      <Header /> 
      <Outlet />
    </>
  )
}

export default AuthRequired
