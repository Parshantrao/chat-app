'use client'

import { useQuery } from "convex/react"
import { MessageSquare, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { api } from "../../convex/_generated/api"

export const useNavigation = () => {
    const pathname = usePathname();
    const requestsCount = useQuery(api.requests.requestCount);

    const conversations = useQuery(api.conversations.getConversations)

    const unseenMessagesCount = useMemo(() => {
        return conversations?.reduce((acc, curr) => {
            return acc + curr.unseenCount
        }, 0)
    }, [conversations])
    
    const paths = useMemo(() => [
        {
            name: 'Conversations',
            href: '/conversations',
            icons: <MessageSquare />,
            active: pathname.startsWith("/conversations"),
            count: unseenMessagesCount
        },
        {
            name: 'Friends',
            href: '/friends',
            icons: <User />,
            active: pathname === "/friends",
            count: requestsCount
        },
    ], [pathname, requestsCount, unseenMessagesCount]);

    return paths;
}
