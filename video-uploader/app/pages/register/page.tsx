"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Mosaic } from "react-loading-indicators";
import { LuX } from 'react-icons/lu'
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function Page() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [redirect, setRedirect] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                setError(true)
            } else {
                setError(false)
            }
        }
    }, [confirmPassword, password])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed.");
                return;
            }

            toast.success("Registration successful.");
            setRedirect(true);

            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => router.push("/pages/login"), 1500);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const toggleNavigate = () => {
        setRedirect(true)
        router.push("/")
    }


    return (
        <div>
            {redirect ? (
                <div className="flex items-center justify-center min-h-screen">
                    <Mosaic color="#456882" size="medium" text="" textColor="" />
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 mx-auto">
                            <div className="flex justify-end mb-4 sm:mb-6">
                                <LuX
                                    className='text-xl cursor-pointer text-gray-600 hover:text-gray-800 transition-colors'
                                    onClick={toggleNavigate}
                                />
                            </div>

                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 text-center text-gray-800">Register</h1>
                            <p className="text-center mb-4 sm:mb-6 text-sm sm:text-base text-gray-500">Register your account and join us today</p>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-none focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm sm:text-base"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-lg transition duration-200 text-sm sm:text-base"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-3 border-b focus:border-none focus:rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm sm:text-base ${confirmPassword === ""
                                        ? "border-gray-300 focus:ring-blue-500"
                                        : error
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-green-300 focus:ring-green-500"
                                        }`}
                                    required
                                />

                                {confirmPassword.length > 0 && (
                                    <p className={`text-xs sm:text-sm font-medium ${error ? "text-red-600" : "text-green-600"
                                        }`}>
                                        {error ? "Passwords don't match" : "Passwords match"}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email.trim() || !password.trim() || !confirmPassword.trim() || error}
                                    className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {loading ? <LoadingSpinner message={`Registering....`} /> : 'Register'}
                                </button>

                                <div className="mt-4 sm:mt-6 text-center">
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        Already have an account? {' '}
                                        <Link
                                            href="/pages/login"
                                            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )
            }
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    className: 'text-sm sm:text-base',
                }}
            />
        </div>
    )
}