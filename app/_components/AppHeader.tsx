import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import ProfileAvatar from './ProfileAvatar'
import Link from 'next/link'
import { Settings } from 'lucide-react'

function AppHeader({hideSidebar=false}) {
    return (
        <header className='sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#4d4353]/20 bg-[#131313]/60 px-5 py-3 backdrop-blur-xl md:px-8'>
            <div className='flex items-center gap-4'>
                {!hideSidebar && <SidebarTrigger className='text-[#c6c6c7] hover:bg-[#1f1f1f] hover:text-[#e0b6ff]' />}
                <span className='text-sm font-black tracking-tight text-[#e0b6ff] md:text-lg'>SketchByte</span>
                <div className='hidden h-4 w-px bg-[#4d4353]/30 md:block' />
                <nav className='hidden items-center gap-5 md:flex'>
                    <Link href='/feedback' className='text-xs text-[#998d9e] transition-colors hover:text-[#e2e2e2]'>Feedback</Link>
                </nav>
            </div>

            <div className='flex items-center gap-2.5'>
                <Link href='/settings' className='rounded-lg p-2 text-[#998d9e] transition-all hover:bg-[#1f1f1f] hover:text-[#e0b6ff] active:scale-95' aria-label='Settings'>
                    <Settings className='h-4 w-4' />
                </Link>
                <ProfileAvatar />
            </div>
        </header>
    )
}

export default AppHeader