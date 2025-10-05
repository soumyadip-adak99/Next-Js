"use client"

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { RiCloseFill } from 'react-icons/ri'
import LoadingSpinner from "./LoadingSpinner";

interface FileUploadProps {
    onSuccessMethod: (res: any) => void
    onProgress?: (progress: number) => void
    onError?: (error: string) => void
    fileType?: "image" | "video"
    onUploadStart?: () => void
    onUploadEnd?: () => void
}

export interface FileUploadHandle {
    clearFile: () => void
}

const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(({
    onSuccessMethod,
    onProgress,
    onError,
    fileType,
    onUploadStart,
    onUploadEnd
}, ref) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const abortControllerRef = useRef<AbortController | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Expose clearFile method to parent
    useImperativeHandle(ref, () => ({
        clearFile: () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
            setError(null)
            setUploadProgress(0)
            // Cancel ongoing upload
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }))

    // optional validation
    const validateFile = (file: File): boolean => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                const errorMsg = "Please upload a valid video file";
                setError(errorMsg);
                onError?.(errorMsg);
                return false;
            }
        }

        if (file.size > 100 * 1024 * 1024) {
            const errorMsg = "File must be less than 100 MB";
            setError(errorMsg);
            onError?.(errorMsg);
            return false;
        }

        setError(null);
        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file || !validateFile(file)) return

        setUploading(true)
        setError(null)
        setUploadProgress(0)
        onUploadStart?.()

        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController()

        try {
            const authResponse = await fetch("/api/auth/imagekit-auth")
            const auth = await authResponse.json()

            const uploadResponse = await upload({
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100
                        const roundedPercent = Math.round(percent)
                        setUploadProgress(roundedPercent)
                        onProgress?.(roundedPercent)
                    }
                },
            });

            console.log(uploadResponse)

            onSuccessMethod(uploadResponse)
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log("Upload cancelled")
            } else {
                console.error("Upload failed", error)
                const errorMsg = "Upload failed. Please try again.";
                setError(errorMsg);
                onError?.(errorMsg);
            }
        } finally {
            setUploading(false)
            onUploadEnd?.()
            abortControllerRef.current = null
        }
    }

    const cancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }

    return (
        <div className="relative w-full">
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className='block w-full text-sm text-gray-500
                                                file:mr-4 file:py-3 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-gray-800 file:text-white
                                                hover:file:bg-gray-600
                                                file:transition-colors file:duration-200
                                                file:cursor-pointer
                                                border border-gray-500 rounded-lg
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />

            {/* <button
                type="button"
                onClick={clearFileInput}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-600 hover:text-red-600 font-medium cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200'
                title="Clear file"
                disabled={uploading}
            >
                <RiCloseFill className="text-lg" />
            </button> */}

            {uploading && (
                <div className="mt-2">
                    {/* <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div> */}
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600"><LoadingSpinner message="Uploading...." /> {uploadProgress}%</span>
                        <button
                            onClick={cancelUpload}
                            className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-2 text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
});

// FileUpload.displayName = 'FileUpload';

export default FileUpload;