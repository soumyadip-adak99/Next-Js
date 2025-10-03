"use client"

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { LuX } from 'react-icons/lu'
import { Mosaic } from 'react-loading-indicators'

function Login() {
    const [passwordType, setPasswordType] = useState("password")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [redirection, setRedireaction] = useState(false)
    const router = useRouter()

    const togglePasswordVisibility = () => {
        setPasswordType(passwordType === "password" ? "text" : "password")
    }

    const toggleNavigate = () => {
        setRedireaction(true)
        router.push("/")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setLoading(true)
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                toast.error(result.error || "Login failed.")
                return
            }
            setRedireaction(true)
            router.refresh()
            router.push("/")
        } catch (error) {
            console.error('Login failed:', error)
            toast.error("Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = email.trim() && password.trim()

    return (
        <>
            {redirection ? (
                <div className='flex items-center justify-center min-h-screen'>
                    <Mosaic color="#456882" size="medium" text="" textColor="" />
                </div >

            ) : (
                <div className='flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8'>
                    <div className='bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 mx-auto'>

                        <div className='flex justify-end mb-4 sm:mb-6'>
                            <LuX
                                className='text-xl cursor-pointer text-gray-600 hover:text-gray-800 transition-colors'
                                onClick={toggleNavigate}
                            />
                        </div>

                        <h1 className='text-center font-bold mb-3 text-xl sm:text-2xl lg:text-3xl text-gray-800'>
                            Welcome
                        </h1>
                        <h2 className='text-center mb-4 sm:mb-6 text-sm sm:text-base text-gray-600'>
                            Login to your account
                        </h2>

                        <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                            <div>
                                <input
                                    placeholder='Email'
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 px-4 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:rounded-lg transition duration-200 text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <input
                                    placeholder='Password'
                                    type={passwordType}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-3 px-4 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:rounded-lg transition duration-200 text-sm sm:text-base pr-20"
                                    required
                                />
                                <button
                                    type="button"
                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-600 hover:text-blue-800 font-medium cursor-pointer transition-colors'
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordType === "password" ? "Show" : "Hide"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !isFormValid}
                                className={`w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
                            >
                                {loading ? "Logging in..." : "Log in"}
                            </button>

                            <div className='text-center pt-2 sm:pt-4'>
                                <p className='text-xs sm:text-sm text-gray-600'>
                                    Don't have an account? {' '}
                                    <Link
                                        href="/pages/register"
                                        className='text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold'
                                    >
                                        Register Now
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <Toaster
                        position='top-center'
                        toastOptions={{
                            duration: 4000,
                            className: 'text-sm sm:text-base',
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default Login