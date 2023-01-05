import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link'
import  useSWR  from 'swr';
import { useAuthState } from '../context/auth';
import { Sub } from '../types';

export default function Home() {

  const {authenticated} = useAuthState();

  const fetcher =async (url:string) => {
    return await axios.get(url).then((res)=>res.data);
  }
  const address = "http://localhost:4000/api/subs/sub/topSubs";

  const  {data: topSubs} = useSWR<Sub[]>(address,fetcher)
  console.log('topSubs', topSubs);
  
  const subList = topSubs?.map((sub)=>(
    <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
      <Link href={`/r/${sub.name}`}>
        <Image src="https://www.gravatar.com/avatar?d=mp&f=y" 
        className="rounded-full cursor-pointer"
        alt='sub'
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
