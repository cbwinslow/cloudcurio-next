import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Matcher to protect specific routes
  matcher: ["/chat/:path*", "/database/:path*", "/deep-research/:path*"],
};