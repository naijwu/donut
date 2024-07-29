"use client"

import { DEMO_FEED } from "@/lib/demo";
import FeedScreen from "@/screens/Feed/FeedScreen";

export default function App() {

  return <FeedScreen donuts={DEMO_FEED} />
}