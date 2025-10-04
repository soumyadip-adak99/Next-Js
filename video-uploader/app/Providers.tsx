"use client"

import { SessionProvider } from "next-auth/react"
import { ImageKitProvider } from "@imagekit/next"
import { ReactNode } from "react"

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT

interface ProvidersProps {
    children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider refetchInterval={10 * 60}>
            <ImageKitProvider urlEndpoint={urlEndPoint}>
                {children}
            </ImageKitProvider>
        </SessionProvider>
    )
}