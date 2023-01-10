import axios from 'axios'
import { useRouter } from 'next/router';
import React,{Fragment,useRef,useState,useEffect, ChangeEvent} from 'react'
import  useSWR, { mutate } from 'swr'
import cls from 'classnames'
import Image from 'next/image';
import { useAuthState } from '../../context/auth';
import SideBar from '../../components/SideBar';
import { Post } from '../../types';
import PostCard from '../../components/PostCard';

const SubPage = () => {

    const router = useRouter()
    const subName = router.query.sub;

    const {data: sub, error,mutate:subMutate} = useSWR(subName?`/subs/${subName}`:null);
    // console.log(sub);

    const [ownSub, setownSub] = useState(false)
    const {authenticated, user} = useAuthState();
    
    useEffect(() => {
        if(!sub || !user)  return;
        setownSub(authenticated && user.username === sub.username)
    }, [sub])
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    const openFileInput = (type: string) =>{
        if(!ownSub) return ;
        const fileInput = fileInputRef.current
        if(fileInput){
            fileInput.name= type;
            fileInput.click();
        }
    }

    const uploadImage = async (e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.files === null) return;
        
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("file",file)
        formData.append("type",fileInputRef.current!.name)

        try {
            await axios.post(`subs/${sub.name}/upload`,formData,{
                headers:{"Context-Type":"multipart/form-data"}
            })
            window.location.reload();
        } catch (error) {
            console.error(error);
            
        }
    }

    let renderPosts;
    if(!sub){
        renderPosts =<p className='text-lg text-center'>Loading...</p>
    }else if(sub.posts.length===0){
        renderPosts=<p className='text-lg text-center'>No One Posted Yet...</p>
    } else {
        // console.log(sub.posts);
        
        renderPosts= sub.posts.map((post:Post)=>
            <PostCard key={post.identifier} post={post} subMutate={subMutate}/>
        )
        
    }
    
    
    return (
    <div> 
    { sub&&(
        <Fragment>
            <input
                type="file" hidden={true} ref={fileInputRef} onChange={uploadImage}
            />
            <div>
                {/* banner */}
                <div className={cls("bg-gray-400")}>
                    {sub.bannerUrl?(
                    <div 
                    className='h-56' 
                    style={{backgroundImage: `url(${sub.bannerUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                    onClick={()=> openFileInput("banner")}
                    ></div>
                    ):( <div className='h-56 bg-rose-400' onClick={()=> openFileInput("banner")}></div>
                    )}
                </div>
                {/* sub profile */}
                <div className='h-20 bg-white'>
                    <div className='relative flex max-w-5xl mx-auto'>
                        <div className='absolute' style={{top:-20}}>
                            {sub.imageUrl&&(
                                <Image 
                                    src={sub.imageUrl}
                                    alt="sub image"
                                    width={70} height={70}
                                    onClick={()=>openFileInput("image")}
                                    className={cls("rounded-full")}
                                />
                            )}
                        </div>
                        <div className='pt-1 pl-24'>
                            <div className='flex items-center'>
                                <h1 className='mb-1 text-3xl font-bold'>{sub.title}</h1>
                            </div>
                            <p className='text-sm font-bold text-rose-400'>/r/{sub.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                {/* post */}
                <div className='w-full md:mr-3 md:w-8/12'>
                    {renderPosts}
                </div>
                {/* side bar */}
                <SideBar sub={sub} />
            </div>
        </Fragment>
    )}
    </div>
    )
}

export default SubPage