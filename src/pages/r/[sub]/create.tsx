import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { Post, Sub } from '../../../types'

const PostCreate = () => {
    let router=useRouter();
    const {sub: subName} = router.query;
    const [title, settitle] = useState("")
    const [body, setbody] = useState("")

    const submitPost = async (e: FormEvent) => {
        e.preventDefault()

        if(title.trim()===""||!subName) return;

        try {
            const {data:post} = await axios.post<Post>("/posts",{
                title: title.trim(),
                body,
                sub: subName
            })

            router.push(`/r/${subName}/${post.identifier}/${post.slug}`)
            
        } catch (error) {
            console.error(error);
            
        }
        
    }

    return (
    <div className='flex flex-col justify-center pt-16'>
        <div className='w-10/12 mx-auto md:w-96'>
            <div className='p-4 bg-white rounded'>
                <h1 className='w-full mb-3 text-2xl font-bold text-rose-400 '>New Post</h1>
                <form onSubmit={submitPost}>
                    <div className='relative mb-2'>
                        <input
                            type="text"
                            placeholder='Title'
                            maxLength={20}
                            value={title}
                            onChange={(e)=>settitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <div
                            style={{top:10, right:10}}
                            className="absolute mb-2 text-sm text-gray-400 select-none"
                        >
                            {title.trim().length}/20
                        </div>
                    </div>
                    <textarea
                        rows={4}
                        placeholder="Description"
                        value={body}
                        onChange={(e)=>setbody(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <div className='flex justify-center'>
                        <button 
                            className='px-4 py-1 text-sm  text-white bg-blue-500 border rounded'
                            disabled={title.trim().length===0}
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
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

export default PostCreate