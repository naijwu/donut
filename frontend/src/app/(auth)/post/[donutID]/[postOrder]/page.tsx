import { DEMO_DONUT, DEMO_THREADS } from "@/lib/demo";
import Post from "@/screens/Post/Post";
import { useEffect } from "react";

export default function PostPage() {

    return <Post donut={DEMO_DONUT} post={DEMO_DONUT.posts![0]} threads={DEMO_THREADS} />
}