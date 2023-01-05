
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react'
import { useAuthState } from '../context/auth'
import { Sub } from '../types'



const SideBar = ({sub}:{sub:Sub}) => {
    
    const {authenticated} = useAuthState();

    return (
    <div className='hidden w-4/12 ml-3 md:block'>
        <div className='bg-white border rounded'>
            <div className='p-3 bg-rose-400  rounded-t'>
                <p className='font-semibold text-white'>About</p>
            </div>
            <div className='p-3'>
                <p className='mb-3 text-base'>{sub?.description}</p>
                <div className='flex mb-3 text-sm font-medium'>
                    <div className='w-1/2'>
                        <FontAwesomeIcon icon={['fas','users']} style={{marginRight:5, maxWidth:15}}/>
                        100 <small>members</small>                    
                    </div>
                </div>
                <p className='my-3 font-medium text-sm'>
                    <FontAwesomeIcon icon={['fas','cake-candles']} style={{marginRight:5,maxWidth:15}}/>
                    {dayjs(sub?.createdAt).format("YYYY-MM-DD")}
                </p>
                {authenticated &&(
                    <Link href={`/r/${sub.name}/create`}>
                    <div className='w-full'>
                        <p className='w-full p-2 text-center text-white bg-blue-500 rounded'>
                        Post
                        </p>
                    </div>
                    </Link>
                )}
            </div>
        </div>
    </div>
    )
}

export default SideBar