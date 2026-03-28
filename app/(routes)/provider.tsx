"use client"
import React, { useEffect } from 'react'
import { useAuthContext } from '../provider';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import axios from "axios";
import AppHeader from '../_components/AppHeader';
import { AppSidebar } from '../_components/AppSidebar';

function DashboardProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const user = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!user?.user) {
            router.replace('/')
            return
        }

        checkUser()

    }, [user])


    const checkUser = async () => {
        try {
            const normalizedEmail = user?.user?.email?.trim().toLowerCase()
            if (!normalizedEmail) return

            await axios.post('/api/user', {
                userName: user?.user?.displayName,
                userEmail: normalizedEmail
            });
        } catch (error) {
            console.error('Failed to check/create user:', error)
        }
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full min-h-screen bg-[#131313] text-[#e2e2e2]'>
                <AppHeader />
                <div className='px-6 py-8 md:px-9'>{children}</div>
            </main>
        </SidebarProvider>

    )
}

export default DashboardProvider