import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import  useSWR from 'swr';
import SideBar from '../../../../components/SideBar';
import { useAuthState } from '../../../../context/auth';
import { Comment, Post } from '../../../../types';

const PostPage = () => {
    const router = useRouter();
    const {identifier, sub, slug} = router.query;
    const [newComment, setnewComment] = useState("")
    const {authenticated, user} = useAuthState();


    const {data: post, error} = useSWR<Post>(identifier&&slug? `/posts/${identifier}/${slug}`:null)
    const {data: comments,mutate} = useSWR<Comment[]>(identifier&&slug ? `/posts/${identifier}/${slug}/comments`:null)

    const commentList = comments?.map((comment)=>(
        <div className='flex' key={comment.identifier}>
            <div className='py-2 pr-2'>
                <p className='mb-1 text-xs leading-none'>
                    <Link href={`/u/${comment.username}`} className="mr-1 font-bold hover:underline">
                        {comment.username}
                    </Link>
                    <span className='text-gray-600'>
                        {`
                            ${comment.voteScore} points 
                            ${dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
                        `}
                    </span>
                </p>
                <p>{comment.body}</p>
            </div>
        </div>
    ))
    
    const submitComment = async (e:FormEvent) => {
        e.preventDefault();
        if(newComment.trim()==="") return;

        try {
            await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`,{
                body: newComment
            })
            setnewComment("")
            mutate()
        } catch (error) {
            console.error(error);
            
        }
    }

    return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto'> 
        <div className='w-full md:mr-3 md:w-8/12'>
            <div className='bg-white rounded'>
                {post&&(<>
                    <div className='flex'>
                        <div className='py-2 pr-2'>
                            <div className='flex items-center'>
                                <p className='text-xs text-gray-400'>
                                    Posted by
                                    <Link href={`/u/${post.username}`} className="mx-1 hover:underline">
                                        /u/{post.username}
                                    </Link>
                                    <Link href={post.url} className="mx-1 hover:underline">
                                        {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                                    </Link>
                                </p>
                            </div>
                            <h1 className='my-1 text-2xl font-semibold'>{post.title}</h1>
                            <p className='my-3 text-sm'>{post.body}</p>
                            <div className='flex'>
                                <button className='text-rose-400'>
                                    <FontAwesomeIcon icon={["fas","comment-alt"]} style={{maxWidth:20}}/>
                                    <span className='font-semibold'> {post.commentCount} Comments</span>
                                </button>
                            </div>
                        </div>
                        {/* {post && post.sub && <SideBar sub={post.sub}/>} */}
                    </div>
                    {/* write comment */}
                    <div className='pr-6 mb-4'>
                        {authenticated ?(
                            <div>
                                <p className='mb-1 text-xs'>
                                    Comment with
                                    <Link href={`/u/${user?.username}`} className="ml-1 font-semibold text-blue-500">
                                        {user?.username}
                                    </Link>
                                </p>
                                <form onSubmit={submitComment}>
                                    <textarea
                                        onChange={(e)=>setnewComment(e.target.value)}
                                        value={newComment}
                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                                    />
                                    <div className='flex justify-end'>
                                        <button className='px-3 py-1 text-white bg-blue-500 rounded' disabled ={newComment.trim()===""}>
                                            comment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ):(
                            <div className='flex items-center justify-between px-2 py-4 border border-gray-200'>
                                <p className='font-semibold text-gray-400'> Login to comment</p>
                                <div>
                                    <Link href="/login" className='px-3 py-1 text-blue-500'> Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    {comments&&(<hr className='mt-3'/>)}
                    </div>
                    {commentList}
                    

                </>)}
            </div>

        </div>
    </div>
    )
}

export default PostPage