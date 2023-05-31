import { SignOutButton, UserButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;

  // console.log(user)

  return (
    <div className="flex w-full gap-3">
      <img
        src={user?.profileImageUrl}
        alt="Profile Image"
        className="w-14 h-14 rounded-full" />
      <input
        placeholder="Type your post!"
        className="bg-transparent grow outline-none" />
    </div>
  )
}

// RouterOutputs inference helper from api utils. 'posts' defined in
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const {post, author} = props;

  return (
    <div className="border-b border-slate-500 p-4" key={post.id}><img
    src={author?.profileImageUrl}
    alt="Profile Image"
    className="w-14 h-14 rounded-full" />
    {post.content}</div>
  )
}

const Home: NextPage = () => {

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Something went wrong</div>

  const user = useUser();

  return (
    <>
      <Head>
        <title>Chirper</title>
        <meta name="description" content="Chirper started May14,2023" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="border-x border-slate-500 h-full w-full md:max-w-2xl">
          <div className="flex justify-center border-b border-slate-500 pb-4">

            {/* {!user.isSignedIn && <SignInButton />} */}
            {/* {!!user.isSignedIn && <SignOutButton />} */}
            {/* <UserButton /> */}
            {user.isSignedIn ? (<CreatePostWizard />) : (null)}

          </div>
          <div className="flex flex-col">
            {[...data]?.map((fullPost) => (
              <PostView {...fullPost}/>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
