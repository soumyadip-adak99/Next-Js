"use client"

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccessMethod: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"
}

const FileUpload = ({
    onSuccessMethod,
    onProgress,
    fileType
}: FileUploadProps) => {


    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // optional validation
    const validateFile = (file: File): boolean => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid file");
                return false;
            }
        }

        if (file.size > 100 * 1024 * 1024) {
            setError("File must be less than 100 MB");
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
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100

                        onProgress(Math.round(percent))
                    }
                },

            });

            onSuccessMethod(uploadResponse)

        } catch (error) {
            console.error("Uplaod faild", error)
        } finally {
            setUploading(false)
        }

    }



    return (
        <>

            <input type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}

            />

            {uploading && (
                <span>Loading ....</span>
            )}

        </>
    );
};

export default FileUpload;