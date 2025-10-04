import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSTIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoUrl: string,
    thumbailUrl: string,
    control?: boolean,
    transformation?: {
        height: number,
        width: number,
        quality?: number
    }
}

const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        videoUrl: {
            type: String,
            required: true
        },

        thumbailUrl: {
            type: String,
            required: true
        },

        control: {
            type: Boolean,
            default: true
        },

        transformation: {
            height: {
                type: Number,
                default: VIDEO_DIMENSTIONS.height
            },

            width: {
                type: Number,
                default: VIDEO_DIMENSTIONS.width
            },

            quality: {
                type: Number,
                min: 1,
                max: 100
            }
        }
    },
    { timestamps: true }
)

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video