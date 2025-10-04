import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGE_KIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
        })

        return Response.json({ authenticationParameters, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
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