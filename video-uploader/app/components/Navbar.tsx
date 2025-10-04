"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'
import { Mosaic } from 'react-loading-indicators'
import { signOut, useSession } from 'next-auth/react'
import { FaRegUser } from "react-icons/fa"
import toast from 'react-hot-toast'
import { CiMenuBurger } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { LuX } from 'react-icons/lu'
import { useRouter } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'
import { RiCloseFill } from 'react-icons/ri'

export default function Navbar() {
    const pathname = usePathname()
    const [redirection, setRedirection] = useState(false)
    const [loading, setLoading] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [openVideoUploadForm, setOpenVideoUploadForm] = useState(false)
    const [fileTitle, setfileTitle] = useState<string | null>()
    const [fileDescription, setFileDescription] = useState<string | null>()
    const { data: session } = useSession()
    const router = useRouter()

    const file = useRef<HTMLInputElement>(null)

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


    const toggleCloseVIdeoUoloadFromModal = () => {
        setOpenVideoUploadForm(false)
        setfileTitle("")
        setFileDescription("")
        if (file.current) file.current.value = "";
    }

    const isActivePath = (path: string): boolean => {
        return pathname === path
    }

    // TODO: update it
    useEffect(() => {

    }, [file])

    return (
        <>
            {redirection ? (
                <div className='flex items-center justify-center min-h-screen'>
                    <Mosaic color="#456882" size="medium" text="" textColor="" />
                </div>
            ) : (
                <>
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
                                                    className='py-1 px-4 flex items-center rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-200 cursor-pointer'
                                                    onClick={() => setOpenVideoUploadForm((prev) => !prev)}
                                                >
                                                    <CiSquarePlus className='mr-2 group-hover:text-white' />
                                                    <span>Upload</span>
                                                </button>

                                                <button
                                                    onClick={() => handleLogout()}
                                                    disabled={loading}
                                                    className={`px-4 py-1.5 text-sm font-medium border rounded-lg transition-all duration-200 ${loading
                                                        ? 'bg-red-500 border-red-500 text-white cursor-not-allowed'
                                                        : 'bg-white border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                                                        } cursor-pointer`}
                                                >
                                                    {loading ? <LoadingSpinner message="Logging out..." /> : "Log out"}
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
                                    {session?.user && (
                                        <button
                                            onClick={() => setOpenVideoUploadForm((prev) => !prev)}
                                        >
                                            <CiSquarePlus className='text-2xl mr-7' />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className='bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-600  hover:bg-gray-100 focus:outline-none  transition-colors'
                                        aria-controls="mobile-menu"
                                        aria-expanded={menuOpen}
                                        onClick={() => setMenuOpen((prev) => !prev)}
                                    >
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
                                                {loading ? <LoadingSpinner message="Logging out..." /> : "Log out"}
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

                    {openVideoUploadForm && (
                        <>
                            <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4'>
                                <div className='bg-gray-200 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-400 transfrom transition-all duration-300'>
                                    <div className="flex justify-end m-0">
                                        <button
                                            onClick={toggleCloseVIdeoUoloadFromModal}
                                            className={`m-3 cursor-pointer
                                                
                                            `}
                                        >
                                            <RiCloseFill className="text-xl" />
                                        </button>
                                    </div>

                                    <h3 className='text-base font-semibold text-gray-800 uppercase text-center mb-6'>Upload Video</h3>

                                    <form
                                        className='m-5 space-y-4'
                                    >

                                        <input
                                            type="text"
                                            placeholder='Title'
                                            className='w-full px-3 py-2 border-b border-gray-700  focus:border-none focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200 text-sm sm:text-base'
                                        />

                                        <textarea
                                            placeholder='Description'
                                            className='w-full px-3 py-2 border rounded-xl border-gray-700  focus:border-none focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200 text-sm sm:text-base'
                                        />

                                        <div className="relative w-full">
                                            <input
                                                ref={file}
                                                type="file"
                                                className='block w-full text-sm text-gray-500
                                                file:mr-4 file:py-3 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-gray-800 file:text-white
                                                hover:file:bg-gray-600
                                                file:transition-colors file:duration-200
                                                file:cursor-pointer
                                                border border-gray-500 rounded-lg
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            />

                                            <button
                                                type="button"
                                                onClick={() => { if (file.current) file.current.value = ""; }}
                                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-600 hover:text-red-600 font-medium cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200'
                                                title="Clear file"
                                            >
                                                <RiCloseFill className="text-lg" />
                                            </button>

                                        </div>

                                        <button
                                            disabled={!fileTitle || !fileDescription || !(file.current && file.current.value)}
                                            className='uppercase bg-gray-800 text-white w-full rounded-lg py-2 font-medium cursor-pointer hover:bg-gray-600 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed'
                                        >
                                            Upload
                                        </button>
                                    </form>


                                </div>




                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
}