import { SignOutButton, UserButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {

  const {data} = api.post.getAll.useQuery();

  const user=useUser();

  return (
    <>
      <Head>
        <title>Chirper</title>
        <meta name="description" content="Chirper started May14,2023" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
      
        <div> 
          <>
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <SignOutButton />}
          <UserButton />
          {data?.map((post) => (<div key={post.id}>{post.content}</div>))}
          </>
        </div>
        
      </main>
    </>
  );
};

export default Home;
