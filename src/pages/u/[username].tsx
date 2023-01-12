import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'
import PostCard from '../../components/PostCard';
import { Comment, Post } from '../../types';

const UserPage = () => {
    const router = useRouter();
    const username = router.query.username; 

    const {data, error} = useSWR<any>(username? `/users/${username}`:null)

    
    const renderList = data?.userData.map((data:any)=>{
        if(data.type==="Post"){
            const post: Post = data;
            return <PostCard key={post.identifier} post={post} />
        } else {
            const comment: Comment = data;
            return(
                <div key={comment.identifier} className="flex my-4 bg-white rounded">
                    <div className='flex-shrink-0 w-10 py-10 text-center bg-white rounded-l border-gray-200 border-r'>
                        <FontAwesomeIcon icon={["fas","comment-alt"]} style={{width:15}} className='text-rose-300'  />
                    </div>
                    <div className='w-full p-2  hover:bg-gray-200'>
                        <p className='mb-1 text-xs leading-none border-b border-dashed '>
                            <span className="ml-1 text-gray-400 cursor-pointer">
                            commented on
                                <Link href={`${comment.post?.url}`} className="ml-1 hover:underline">
                                    {comment.post?.title}
                                </Link>
                            </span>
                            
                            
                            <span className='text-rose-400'>
                                <FontAwesomeIcon icon={["fas","users"]} style={{width:12, marginLeft:5, marginRight:5}} />
                                <Link href={`/r/${comment.post?.subName}`} className="mr-1 hover:underline">
                                    /r/{comment.post?.subName}
                                </Link>                                
                                
                            </span>
                            <span className='text-gray-400'>{dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}</span>
                        </p>
                        <p className='text-lg' >{comment.body}</p>
                    </div>
                </div>
            )
        }
    })

    if(!data) return null;
    return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
        {/* Post and Comment list  */}
        <div className='w-full md:mr-3 md:w-8/12'>
            {renderList}
        </div>

        {/* User info */}
        <div className='hidden w-4/12 ml-3 md:block'>
            <div className='flex items-center p-3 bg-rose-300 rounded-t'>
                <Image
                    src="https://www.gravatar.com/avatar/00000?d=mp&f=y"
                    alt="user profile"
                    className='border border-white rounded-full'
                    width={40}
                    height={40}
                />
                <p className='pl-2'>{data.user.username}</p>
            </div>
            <div>
                <div className='p-2 bg-white rounded-b '>
                    <p className='text-gray-500'>since {dayjs(data.user.createdAt).format("YYYY.MM.DD")}</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default UserPage