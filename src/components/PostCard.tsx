import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import cls from 'classnames'
import { Post } from '../types'
import Link from 'next/link'
import dayjs from 'dayjs'
import Image from 'next/image'
import classNames from 'classnames'
import { useAuthState } from '../context/auth'
import { useRouter } from 'next/router'
import axios from 'axios'

interface PostCardProps {
    post: Post
    mutate?: () => void
}

const PostCard = ({
    post:{
        identifier,
        slug,
        title,
        body,
        subName,
        createdAt,
        voteScore,
        userVote,
        commentCount,
        url,
        username,
        sub,
    },
    mutate
}:PostCardProps) => {
    const {authenticated} = useAuthState()
    const router = useRouter()
    const isInSubPage = router.pathname==='/r/[sub]'

    const vote = async (value:number) => {
        if(!authenticated) router.push('/login')
        
        if(value === userVote) value =0;

        try {
            await axios.post('/votes',{
                identifier,
                slug,
                value
            })
            if(mutate){
                mutate();
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
    <div key={identifier} className="flex mb-4 bg-white hover:bg-gray-200" id={identifier}>
        {/* Post Vote */}
        <div className='w-10 py-3 text-center rounded-l'>
            <div className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300  hover:text-rose-400'
                onClick={()=>vote(1)}>
                <FontAwesomeIcon icon={"arrow-up"} className={cls({"text-rose-400": userVote===1})}/>
            </div>
            <p className='text-xs font-bold'> {voteScore}</p>
            <div className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300  hover:text-blue-400'
                onClick={()=>vote(-1)} >
                <FontAwesomeIcon icon={"arrow-down"} className={cls({"text-blue-400": userVote===-1})}/>
            </div>
        </div>
                        
        {/* Post */}
        <div className='w-full p-2'>
            <div className='flex'>
                { !isInSubPage &&
                    (<>
                        <Link href={`/r/${subName}`} passHref>
                        {sub&&(<Image 
                        src={sub.imageUrl} 
                        className="w-6 h-6 mr-1 rounded-full cursor-pointer" 
                        alt='sub' 
                        width={12}
                        height={12}
                        />)}
                        </Link>
                        <Link href={`/r/${subName}`} className="text-xs font-bold cursor-pointer hover:underline m-1">
                            /r/{subName}
                        </Link>
                        
                    </>)
                }
                    <p className='text-xs text-gray-400 flex'>
                    Posted by
                    <FontAwesomeIcon icon={["fas","user-alt"]} style={{width:10,margin:3}} />
                    <Link href={`/u/${username}`} className=" hover:underline mr-1">
                        /u/{username}
                    </Link>
                    {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
                    </p>
                
            </div>
            <Link href={url}>
                <h1 className='my-1 text-2xl font-semibold'>{title}</h1>
            </Link>
            <p className='my-3 text-sm'>{body}</p>
            <div className='flex'>
                <Link href={url} className='text-rose-400' passHref>
                    <FontAwesomeIcon icon={["fas","comment-alt"]} style={{maxWidth:20}}/>
                    <span className='font-semibold'> {commentCount} Comments</span>
                </Link>
            </div>
        </div>

    </div>
    )
}

export default PostCard