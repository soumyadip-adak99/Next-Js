import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
        const authenticationParameters = getUploadAuthParams({
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
            privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
        })

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