"use client";

import { toast } from "react-toastify";

export default function ErrorBoundary({ error }:{ error:Error }){
    return(
        toast.error(error.message)
    )
}