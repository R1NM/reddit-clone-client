import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAuthDispatch, useAuthState } from '../context/auth'

const Login = () => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [errors, seterrors] = useState<any>({})

    let router=useRouter();

    const {authenticated} = useAuthState();
    const dispatch = useAuthDispatch();

    //already logged in
    if(authenticated) router.push("/");


    const handleSubmit = async (e:FormEvent) =>{
        e.preventDefault();
        try {
            const res= await axios.post('/auth/login',{
                password,
                username,
            },{
                withCredentials: true,
            })
            console.log('res',res);
            dispatch("LOGIN",res.data?.user);
            router.push("/")
        } catch (error: any) {
            console.error(error);
            seterrors(error.response.data||{});
        }
    }

    return (
    <div className='bg-white'>
        <div className='flex flex-col items-center justify-center h-screen p-6'>
            <div className='w-10/12 mx-auto md:w-96'>
                <h1 className='mb-2 text-lg font-bold'>Login</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder='Username'
                        value={username}
                        setValue={setusername}
                        error={errors.username}
                    />
                    <InputGroup
                        placeholder='Password'
                        value={password}
                        setValue={setpassword}
                        error={errors.password}
                    />


                    <button className='w-full py-2 mb-1 text-xs font-medium text-white uppercase bg-blue-500 border border-blue-500 rounded'>
                    Login
                    </button>
                </form>
                <small>
                    Need to Sign Up?
                    <Link href="/register" className='ml-1 text-blue-500 uppercase'>
                        Sign Up
                    </Link>
                </small>
            </div>
        </div>        
    </div>
    )
}

export default Login