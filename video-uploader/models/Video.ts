import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = { // Fixed typo: DIMENSTIONS -> DIMENSIONS
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoUrl: string,
    thumbailUrl: string, // Note: typo here too (thumbail -> thumbnail)
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
                default: VIDEO_DIMENSIONS.height
            },

            width: {
                type: Number,
                default: VIDEO_DIMENSIONS.width
            },

            quality: {
                type: Number,
                min: [1, 'Quality must be at least 1'],
                max: [100, 'Quality cannot exceed 100']
            }
        }
    },
    { timestamps: true }
)

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video