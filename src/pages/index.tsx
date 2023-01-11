import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import  useSWR  from 'swr';
import useSWRInfinite from 'swr/infinite'
import PostCard from '../components/PostCard';
import { useAuthState } from '../context/auth';
import { Post, Sub } from '../types';

export default function Home() {

  const {authenticated} = useAuthState();

  const address = "http://localhost:4000/api/subs/sub/topSubs";
  const  {data: topSubs} = useSWR<Sub[]>(address)

  const getKey = (pageIndex: number, previousPageData:Post[]) =>{
    if(previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}`;
  }
  const {data, error, size:page, setSize:setPage, isValidating, mutate:postMutate}=useSWRInfinite<Post[]>(getKey)

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];
  
  const [observedPost, setobservedPost] = useState("")

  useEffect(() => {
    if(!posts || posts.length===0) return;

    const id = posts[posts.length-1].identifier;
    if(id!==observedPost){
      setobservedPost(id);
      observedElement(document.getElementById(id))
    }
  
  }, [posts])

  const observedElement = (element: HTMLElement | null) =>{
    if(!element) return;

    const observer = new IntersectionObserver(
      (entries) =>{
        //reached bottom
        if(entries[0].isIntersecting === true){
          // console.log("reached bottom");
          
          setPage(page+1);
          observer.unobserve(element);
        }
      },
      {threshold:1}
    );

    observer.observe(element);
  }
  
  
  const subList = topSubs?.map((sub)=>(
    <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b hover:bg-gray-200">
      <Link href={`/r/${sub.name}`}>
        <Image src={sub.imageUrl}
        className="rounded-full cursor-pointer bg-white"
        alt={sub.name}
        width={24} height={24}
        />
      </Link>
      <Link href={`/r/${sub.name}`} className="ml-2 font-bold hover:cursor-pointer">
        /r/{sub.name}
      </Link>
      <p className='ml-auto font-medium'>{sub.postCount}</p>
    </div>
  ))


  return (
    <div>
      <div className='flex max-w-screen-2xl  px-4 pt-5 mx-auto'>
        {/* post list */}
        <div className='w-full md:mr-3 md:w-9/12'>
          {isInitialLoading && <p className='text-lg text-center'>Loading...</p>}
          {posts.map((post)=>(
            <PostCard post={post} key={post.identifier} mutate={postMutate}/>
          ))}
        </div>

        {/* side bar */}
        <div className='hidden w-3/12 ml-3 md:block'>
          <div className='bg-white border border-gray-200 rounded'>
            <div className='p-4 border-b'>
              <p className='text-lg font-semibold text-center'>Sub Ranking</p>
            </div>
            {/* community list */}           
            <div>
            {subList}
            </div>
            {authenticated&&(<Link href="/subs/create">
            <div className='w-full py-6 px-6 text-center'>
              <p className='w-full p-2 text-center text-white font-semibold bg-blue-500 rounded'>
                Create Sub
              </p>
            </div>
            </Link>)}
          </div>
          
        </div>

      </div>
    </div>
  )
}
