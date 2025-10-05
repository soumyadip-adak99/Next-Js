import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
        const authenticationParameters = getUploadAuthParams({
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
            privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
        })

        // const authenticationParameters = getUploadAuthParams({
        //     publicKey: "public_fHLSrHvOrJD1oGTiU/BMHFRxBF8=",
        //     privateKey: "private_nyMvxWJOBl0RPmA/rLfBVSnV5wE="
        // })

        return Response.json(authenticationParameters)
    } catch (error) {
        console.error("Error getting on api/auth/imagekit-auth/ :-", error)
        return Response.json(
            {
                error: "Authentication for imagekit failed",
            },
            {
                status: 500
            }
        )
    }
}