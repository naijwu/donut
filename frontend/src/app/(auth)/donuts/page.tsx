"use client"

import { DEMO_DONUTS } from "@/lib/demo"
import DonutsScreen from "@/screens/Donuts/DonutsScreen"

export default function Donuts() {
    
  return <DonutsScreen donuts={DEMO_DONUTS} />
}