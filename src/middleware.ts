import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  beforeAuth: (req) => {
    console.log("beforeAuth Running")
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};