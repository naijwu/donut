"use client"

import { DEMO_NOTIF } from "@/lib/demo"
import NotificationsScreen from "@/screens/Notifications/NotificationsScreen"

export default function Notifications() {

  return <NotificationsScreen notifications={DEMO_NOTIF} />
}