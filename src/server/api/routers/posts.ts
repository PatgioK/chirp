import type { User } from "@clerk/nextjs/dist/server";
import { clerkClient } from "@clerk/nextjs/dist/server-helpers.server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username!,
    profileImageUrl: user.profileImageUrl
  }
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      // where: {authorId: "user_2PnsKtN2DvTTJ0fIKTBCUcSuNnF"},
    });

    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })).map(filterUserForClient);

    console.log(users);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId)

      // if(!author || !author.username) throw new TRPCError({   //USERNAME not yet implemented
      if(!author) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      })

      return {
      post,
      author,
    }})
  }),
});
