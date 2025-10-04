import React from 'react'

interface Imessage {
    message: string | any
}

export default function LoadingSpinner({ message }: Imessage) {
    return (
        <div className="flex items-center justify-center gap-2">
            <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.0s_linear_infinite]"
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                </span>
            </div>
            <span className="text-sm">{message}</span>
        </div>
    )
}