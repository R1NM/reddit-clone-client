export interface User{
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
export interface Sub {
    createdAt: string;
    updatedAt: string;
    name : string;
    title : string;
    description: string;
    imageUrn: string;
    bannerUrn: string;
    username: string;
    posts: Post[];
    postCount? : string;

    imageUrl: string;
    bannerUrl: string;
}

export interface Post{
    createdAt: string;
    updatedAt: string;
    identifier: string;
    title : string;
    slug: string;
    body: string;
    subName: string;
    username: string;
    sub?: Sub;

    url: string;
    userVote?: number;
    voteScore?:number;
    commentCount?: number;
}

export interface Comment{
    identifier: string;
    body: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    post?:Post;
    userVote?: number;
    voteScore?:number;
}