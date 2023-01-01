import React, { FormEvent, useState } from 'react'
import InputGroup from '../../components/InputGroup'
import { useRouter } from 'next/router'
import axios from 'axios'
import { GetServerSideProps } from 'next'

const SubCreate = () => {
    const [name, setname] = useState("")
    const [title, settitle] = useState("")
    const [description, setdescription] = useState("")
    const [errors, seterrors] = useState<any>({})

    let router=useRouter();

    const handleSubmit = async (e:FormEvent) =>{
        e.preventDefault();
        try {
            const res= await axios.post('/subs',{
                name,
                title,
                description
            },{
                withCredentials: true
            })
            console.log('res',res);
            // router.push(`/r/${res.data.name}`)
        } catch (error: any) {
            console.error(error);
            seterrors(error.response.data||{});
        }
    }


    return (
    <div className='flex flex-col justify-center pt-16'>
        <div className='w-10/12 mx-auto md:w-96'>
            <h1 className='mb-2 text-2xl font-bold'> Create Community</h1>
            <hr/>
            <form onSubmit={handleSubmit}>
                <div className='my-6'>
                    <p className='font-semibold'>Name</p>
                    <p className='mb-2 text-xs text-gray-400'>Community Name cannot be changed afterwards</p>
                    <InputGroup
                        placeholder='Name'
                        value={name}
                        setValue={setname}
                        error={errors.name}
                    />
                </div>
                <div className='my-6'>
                    <p className='font-semibold'>Title</p>
                    <p className='mb-2 text-xs text-gray-400'>You can change title any time</p>
                    <InputGroup
                        placeholder='Title'
                        value={title}
                        setValue={settitle}
                        error={errors.title}
                    />
                </div>
                <div className='my-6'>
                    <p className='font-semibold'>Description</p>
                    <p className='mb-2 text-xs text-gray-400'>Describe your community</p>
                    <InputGroup
                        placeholder='Description'
                        value={description}
                        setValue={setdescription}
                        error={errors.description}
                    />
                </div>
                <div className='flex justify-end'>
                    <button className='px-4 py-1 text-sm font-semibold rounded text-white bg-blue-500 border'>Create</button>
                </div>
            </form>
        </div>
    </div>
    )
}

export const getServerSideProps : GetServerSideProps =async ({req,res}) => {
    try {
        const cookie = req.headers.cookie;

        //cookie missing
        if(!cookie) throw new Error("Missing auth token");

        //user authentication on backend
        await axios.get("/auth/me",{headers:{cookie}})

        return {props: {}}

    } catch (error) {
        //move to login page
        res.writeHead(307,{Location:"/login"}).end()
        
        return {props: {}}
    }
}

export default SubCreate