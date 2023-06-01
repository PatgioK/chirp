import { SignOutButton, UserButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
// import type interface to reduce code in final compiled output
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
  const { post, author } = props;

  return (
    <div className="flex border-b border-slate-500 p-4 gap-3" key={post.id}>
      <img
        src={author?.profileImageUrl}
        alt="Profile Image"
        className="w-14 h-14 rounded-full" />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-200">
          <span>{`@${author.username}`}</span>
          <span>{` ·  ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
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
          <div className="flex justify-center border-b border-slate-500 p-4">

            {/* {!user.isSignedIn && <SignInButton />} */}
            {/* {!!user.isSignedIn && <SignOutButton />} */}
            {/* <UserButton /> */}
            {user.isSignedIn ? (<CreatePostWizard />) : (null)}

          </div>
          <div className="flex flex-col">
            {[...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
