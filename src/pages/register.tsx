import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'
import axios from 'axios'
import { useRouter } from 'next/router'

const Register = () => {
    const [email, setemail] = useState("")
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [errors, seterrors] = useState<any>({})

    let router=useRouter();

    const handleSubmit = async (e:FormEvent) =>{
        e.preventDefault();
        try {
            const res= await axios.post('/auth/register',{
                email,
                password,
                username,

            })
            console.log('res',res);
            router.push("/login")
        } catch (error: any) {
            console.error(error);
            seterrors(error.response.data||{});
        }
    }

    return (
    <div className='bg-white'>
        <div className='flex flex-col items-center justify-center h-screen p-6'>
            <div className='w-10/12 mx-auto md:w-96'>
                <h1 className='mb-2 text-lg font-bold'>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder='Email'
                        value={email}
                        setValue={setemail}
                        error={errors.email}
                    />
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


                    <button className='w-full py-2 mb-1 text-xs font-medium text-white uppercase bg-gray-400 border border-gray-400 rounded'>
                    Sign Up
                    </button>
                </form>
                <small>
                    Already Signed Up?
                    <Link href="/login" className='ml-1 text-blue-500 uppercase'>
                        Login
                    </Link>
                </small>
            </div>
        </div>        
    </div>
    )
}

export default Register