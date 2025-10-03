"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Mosaic } from 'react-loading-indicators'
import { signOut, useSession } from 'next-auth/react'
import { FaRegUser } from "react-icons/fa"
import toast from 'react-hot-toast'
import { CiMenuBurger } from "react-icons/ci";
import { LuX } from 'react-icons/lu'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()
    const [redirection, setRedirection] = useState(false)
    const [loading, setLoading] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    const navItems = [
        { href: '/pages/login', label: 'Login' },
        { href: '/pages/register', label: 'Register' },
    ]

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut({
                redirect: false
            });
            router.refresh();
            toast.success("Logout successful");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Something went wrong during logout");
        } finally {
            setLoading(false);
            setMenuOpen(false);
            setRedirection(false);
        }
    }

    const isActivePath = (path: string): boolean => {
        return pathname === path
    }

    return (
        <>
            {redirection ? (
                <div className='flex items-center justify-center min-h-screen'>
                    <Mosaic color="#456882" size="medium" text="" textColor="" />
                </div>
            ) : (
                <nav className='bg-white shadow-sm border-b border-gray-200'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex justify-between items-center h-16'>
                            {/* Logo */}
                            <div className='flex-shrink-0'>
                                <Link href="/" className='flex items-center'>
                                    <h1 className='font-bold text-2xl text-gray-800 hover:text-blue-600 transition-colors cursor-pointer'>
                                        VideoUploader
                                    </h1>
                                </Link>
                            </div>

                            {/* Desktop Navigation Links */}
                            <div className='hidden md:block'>
                                <ul className='flex items-center space-x-8'>
                                    {/* Home Link - Always visible */}
                                    <li>
                                        <Link
                                            href="/"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActivePath("/")
                                                ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                                                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            Home
                                        </Link>
                                    </li>

                                    {session?.user ? (
                                        <li className='flex items-center space-x-6'>
                                            <div className='flex items-center text-gray-700 bg-gray-100 px-3 py-2 rounded-lg'>
                                                <FaRegUser className="mr-2 text-gray-500" />
                                                <span className='text-sm font-medium max-w-32 truncate'>
                                                    {session.user.email}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleLogout()}
                                                disabled={loading}
                                                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${loading
                                                    ? 'bg-red-500 border-red-500 text-white cursor-not-allowed'
                                                    : 'bg-white border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                                                    }`}
                                            >
                                                {loading ? "Logging out..." : "Log out"}
                                            </button>
                                        </li>
                                    ) : (
                                        <>
                                            {navItems.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActivePath(item.href)
                                                            ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                                            }`}
                                                        onClick={() => { setRedirection((prev) => !prev) }}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* Mobile menu button */}
                            <div className='md:hidden flex items-center'>

                                <button
                                    type="button"
                                    className='bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-600  hover:bg-gray-100 focus:outline-none  transition-colors'
                                    aria-controls="mobile-menu"
                                    aria-expanded={menuOpen}
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                >
                                    <span className="sr-only duration-100">
                                        {menuOpen ? 'Close main menu' : 'Open main menu'}
                                    </span>
                                    {menuOpen ? (
                                        <LuX className="block h-6 w-6" />
                                    ) : (
                                        <CiMenuBurger className="block h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="md:hidden" id="mobile-menu">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
                                <Link
                                    href="/"
                                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${isActivePath("/")
                                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Home
                                </Link>

                                {session?.user ? (
                                    <>
                                        <div className="px-3 py-3 text-sm text-gray-500 border-b border-gray-200">
                                            Signed in as: {session.user.email}
                                        </div>

                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setMenuOpen(true)
                                            }}
                                            disabled={loading}
                                            className={`w-full text-left block px-3 py-3 rounded-md text-base font-medium transition-colors ${loading
                                                ? 'bg-red-500 text-white cursor-not-allowed'
                                                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                                }`}
                                        >
                                            {loading ? "Logging out..." : "Log out"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${isActivePath(item.href)
                                                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => {
                                                    setRedirection((prev) => !prev)
                                                    setMenuOpen(false)
                                                }}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            )}
        </>
    )
}