import {userState} from "../store/User"
import React from "react"
import { Navigate } from "react-router-dom"

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  
    let { user } = userState()

    if (user) {
        return <>{children}</>  // Properly return the child component
    } else {
        return <Navigate to="/" /> // Redirect to login if user is not authenticated
    }
}
