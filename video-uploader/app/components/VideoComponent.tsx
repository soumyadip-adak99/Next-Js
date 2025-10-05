"use client"

import React, { useEffect, useState, useRef } from 'react'
import { apiClient } from '@/lib/api-client'
// import Image from 'next/image'
// import { Image } from '@imagekit/next'

interface Video {
    _id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    control: boolean
    transformation: {
        height: number
        width: number
        quality: number
    }
    createdAt: string
    updatedAt: string
    __v: number
}

export default function VideoComponent() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    const handleGetVideos = async () => {
        setLoading(true)
        try {
            const response = await apiClient.getVideos()
            console.log(response)
            setVideos(response as Array<Video>)
        } catch (error) {
            console.error('Error fetching videos:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetVideos()
    }, [])

    const handleThumbnailClick = (videoUrl: string) => {
        setSelectedVideo(videoUrl)
    }

    const handleCloseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
        setSelectedVideo(null)
    }

    // Auto-play when modal opens
    useEffect(() => {
        if (selectedVideo && videoRef.current) {
            const playVideo = async () => {
                try {
                    await videoRef.current?.play()
                } catch (error) {
                    console.log('Auto-play failed:', error)
                    if (videoRef.current) {
                        videoRef.current.muted = true
                        await videoRef.current.play()
                    }
                }
            }
            playVideo()
        }
    }, [selectedVideo])

    return (
        <div className="p-6">
            <button
                onClick={handleGetVideos}
                disabled={loading}
                className="border-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 mb-4"
            >
                {loading ? 'Loading...' : 'Refresh Videos'}
            </button>

            {selectedVideo && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Video Player</h3>
                            <button
                                onClick={handleCloseVideo}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            <video
                                ref={videoRef}
                                controls
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-auto max-h-[70vh]"
                                src={selectedVideo}
                                onError={(e) => console.error('Video error:', e)}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}

            {videos.length > 0 && (
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                        <div key={video._id} className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-auto">
                            {/* Thumbnail - Click to play video */}
                            <div
                                className="relative cursor-pointer group"
                                onClick={() => handleThumbnailClick(video.videoUrl)}
                            >
                                <img
                                    src={`https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg`}
                                    alt={video.title}
                                    className="w-30 h-78 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                    <div className="bg-white bg-opacity-80 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform">
                                        <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Video Info */}
                            {/* <div className="p-4">
                                <h3 className="text-lg font-bold mb-2 line-clamp-1">{video.title}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Quality: {video.transformation.quality}%</span>
                                    <span>{video.transformation.width}x{video.transformation.height}</span>
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </p>
                            </div> */}
                        </div>
                    ))}
                </div>
            )}

            {videos.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    No videos found. Click the button to load videos.
                </div>
            )}
        </div>
    )
}