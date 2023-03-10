
import axios from 'axios';
import Link from 'next/link'
import React, { Fragment } from 'react'
import { useAuthDispatch, useAuthState } from '../context/auth'

const NavBar : React.FC = () => {
    const {loading, authenticated} = useAuthState();

    const dispatch = useAuthDispatch();

    const handleLogout = () =>{
        axios.post("/auth/logout")
        .then(()=>{
            dispatch("LOGOUT")
            window.location.reload();
        })
        .catch((err)=>{
            console.error(err);
        })
    }

    return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white'>
        <span className='text-2xl font-semibold text-rose-400'>
            <Link href="/">Community</Link>
        </span>

        <div className='max-w-full px-4'>
            <div className='relative flex items-center bg-gray-100 border rounded hover:border-gray-400'>
                <input type="text" placeholder='Search' 
                    className='px-3 py-1 bg-transparent rounded focus: outline-none'/>
            </div>
        </div>

        <div className='flex'>
            {!loading &&(
                authenticated ?(
                    <button className='w-20 p-2 mr-2 text-center text-sm text-white bg-gray-400 rounded' onClick={handleLogout}>LOGOUT</button>
                ):(
                    <Fragment>
                        <div className='w-20 p-2 mr-2 text-center font-bold text-blue-500 border-blue-400 rounded'>
                            <Link href="/login">LOGIN</Link>
                        </div>
                        <div className='w-20 p-2 text-center text-white bg-blue-500 rounded'>
                            <Link href="/register">SIGN UP</Link>
                        </div>
                    </Fragment>
                )
            )}
        </div>
    </div>
    )
}

export default NavBar