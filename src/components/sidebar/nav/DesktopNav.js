'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { useNavigation } from '@/hooks/useNavigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'


function DesktopNav() {
  const paths = useNavigation()
  const { setTheme } = useTheme()

  return (
    <Card className="hidden lg:flex lg:flex-col lg:items-center lg:justify-between lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className='flex flex-col items-center gap-4'>
          {
            paths.map((path, id) => {
              return <li key={id} className='relative'>
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button size='icon' variant={
                        path.active ? "default" : "outline"
                      }>
                        {path.icons}
                      </Button>
                      {path.count ? <Badge className="absolute left-6 bottom-7 px-2 text-white ">{path.count}</Badge> : null}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{path.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            })
          }
        </ul>
      </nav>
      <div className='flex flex-col items-center gap-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </Card>
  )
}

export default DesktopNav