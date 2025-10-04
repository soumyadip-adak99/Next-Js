"use client"

import React from 'react'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { Mosaic } from 'react-loading-indicators'

export default function Index() {
    const { status } = useSession()

    if (status === "loading") {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <Mosaic color="#456882" size="medium" text="" textColor="" />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <Toaster />
        </>
    )
}