import { DEMO_DONUT } from "@/lib/demo";
import Post from "@/screens/Post/Post";

export default function PostPage() {

    return <Post donut={DEMO_DONUT} post={DEMO_DONUT.posts![0]} />
}