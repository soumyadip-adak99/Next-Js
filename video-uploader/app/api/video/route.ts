import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function get() {
    try {
        await connectDB()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 404 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            { error: "Faild to fetch videos" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorize" },
                { status: 401 }
            )
        }

        await connectDB()

        const body: IVideo = await request.json();

        if (!body.title || !body.description || !body.videoUrl || body.thumbailUrl) {
            return NextResponse.json(
                { error: "Missing required title." },
                { status: 400 }
            )
        }

        const videoData = {
            ...body,
            control: body?.control ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo)

    } catch (error) {
        return NextResponse.json(
            { error: "Faild to create video." },
            { status: 500 }
        )
    }
}