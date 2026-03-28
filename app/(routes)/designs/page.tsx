"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Filter, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function Designs() {

    const { user } = useAuthContext();
    const [wireframeList, setWireframeList] = useState<RECORD[]>([]);
    const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (!user?.email) {
            setWireframeList([])
            setCreditsRemaining(null)
            return
        }

        loadDashboardData()
    }, [user])

    const loadDashboardData = async () => {
        await Promise.all([
            GetAllUserWireframe(),
            GetUserCredits(),
        ])
    }

    const GetAllUserWireframe = async () => {
        try {
            const normalizedEmail = user?.email?.trim().toLowerCase()
            if (!normalizedEmail) return

            const result = await axios.get('/api/wireframe-to-code?email=' + encodeURIComponent(normalizedEmail));
            setWireframeList(result.data);
        } catch (error: any) {
            console.error('Error loading designs:', error)
            toast.error(error?.response?.data?.error || 'Failed to load designs')
        }
    }

    const GetUserCredits = async () => {
        try {
            const normalizedEmail = user?.email?.trim().toLowerCase()
            if (!normalizedEmail) return

            const response = await axios.get(`/api/user?email=${encodeURIComponent(normalizedEmail)}`)
            setCreditsRemaining(typeof response.data?.credits === 'number' ? response.data.credits : 0)
        } catch (error: any) {
            if (error?.response?.status === 404) {
                try {
                    const created = await axios.post('/api/user', {
                        userName: user?.displayName,
                        userEmail: user?.email,
                    })
                    setCreditsRemaining(typeof created.data?.credits === 'number' ? created.data.credits : 0)
                    return
                } catch (createError: any) {
                    console.error('Error creating user while loading credits:', createError)
                    toast.error(createError?.response?.data?.error || 'Failed to initialize user credits')
                    return
                }
            }

            console.error('Error loading credits:', error)
            toast.error(error?.response?.data?.error || 'Failed to load credits')
        }
    }

    const handleDeleteDesign = async (uid: string) => {
        if (!user?.email) {
            toast.error('User not authenticated')
            return
        }

        if (!confirm('Are you sure you want to delete this design?')) return

        try {
            const normalizedEmail = user.email.trim().toLowerCase()
            const response = await axios.delete('/api/wireframe-to-code', {
                data: {
                    uid,
                    email: normalizedEmail,
                },
            })

            if (!response.data?.success) {
                throw new Error(response.data?.error || 'Failed to delete design')
            }

            setWireframeList((prev) => prev.filter((item) => item.uid !== uid))
            toast.success('Design deleted successfully')
        } catch (error: any) {
            console.error('Error deleting design:', error)
            toast.error(error?.response?.data?.error || 'Failed to delete design')
        }
    }

    const activityBars = [34, 58, 29, 92, 74, 51, 41];

    return (
        <section className='relative min-h-[calc(100vh-140px)]'>
            <div className='pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#9d4edd]/10 blur-[120px]' />
            <div className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#e0b6ff]/6 blur-[95px]' />

            <div className='relative z-10 space-y-8'>
                <header className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
                    <div>
                        <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-[#998d9e]'>Dashboard Overview</p>
                        <h1 className='mt-2 text-4xl font-black tracking-tight text-[#e2e2e2] md:text-5xl'>Wireframe & Codes</h1>
                        <p className='mt-3 max-w-2xl text-sm text-[#d0c2d5]/75'>
                            Transforming high-fidelity sketches into production-ready React components with Luminous AI.
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button className='inline-flex h-11 items-center gap-2 rounded-md border border-[#4d4353]/30 bg-[#1b1b1b] px-4 text-xs font-semibold uppercase tracking-wide text-[#d0c2d5] transition-colors hover:border-[#e0b6ff]/30 hover:text-[#e2e2e2]'>
                            <Filter className='h-3.5 w-3.5' />
                            Filters
                        </button>
                        <Link
                            href='/dashboard'
                            className='inline-flex h-11 items-center gap-2 rounded-md bg-gradient-to-r from-[#a85ef0] to-[#9d4edd] px-5 text-xs font-bold uppercase tracking-wide text-[#251a00] shadow-[0_10px_28px_rgba(157,78,221,0.3)] transition-all hover:shadow-[0_14px_35px_rgba(157,78,221,0.45)]'
                        >
                            <Plus className='h-4 w-4' />
                            New Project
                        </Link>
                    </div>
                </header>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
                    {wireframeList?.map((item: RECORD, index) => (
                        <DesignCard key={item.uid ?? index} item={item} index={index} onDelete={handleDeleteDesign} />
                    ))}

                    {wireframeList.length === 0 && (
                        <div className='col-span-full rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-10 text-center'>
                            <h3 className='text-xl font-bold text-[#e2e2e2]'>No projects generated yet</h3>
                            <p className='mt-2 text-sm text-[#998d9e]'>Create your first wireframe-to-code project to see it here.</p>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols-1 gap-6 xl:grid-cols-4'>
                    <article className='xl:col-span-3 rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6 md:p-7'>
                        <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
                            <div>
                                <h3 className='text-2xl font-bold text-[#e2e2e2]'>Workspace Activity</h3>
                                <p className='mt-1 text-sm text-[#998d9e]'>Generated {wireframeList.length > 0 ? wireframeList.length * 124 : 0} lines of code this week.</p>
                            </div>
                            <div className='rounded-xl border border-[#4d4353]/20 bg-[#222225] px-5 py-3 text-right'>
                                <p className='text-[10px] font-semibold uppercase tracking-[0.18em] text-[#998d9e]'>Credits Remaining</p>
                                <p className='mt-1 text-4xl font-black leading-none text-[#e0b6ff]'>
                                    {creditsRemaining ?? '--'}
                                </p>
                                <button className='mt-2 text-xs font-semibold text-[#b69ac9] hover:text-[#e0b6ff]'>Upgrade Plan</button>
                            </div>
                        </div>

                        <div className='mt-6 flex h-24 items-end gap-2'>
                            {activityBars.map((bar, idx) => (
                                <div
                                    key={idx}
                                    className={`w-7 rounded-t-md ${idx === 3 ? 'bg-[#c79cf0]' : 'bg-[#6f5a7d]/55'}`}
                                    style={{ height: `${bar}%` }}
                                />
                            ))}
                        </div>
                    </article>

                    <aside className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6'>
                        <div className='inline-flex rounded-xl border border-[#4d4353]/25 bg-[#2b2b31] p-3'>
                            <Sparkles className='h-5 w-5 text-[#e0b6ff]' />
                        </div>
                        <h3 className='mt-5 text-2xl font-black tracking-tight text-[#e2e2e2]'>Need a new prompt?</h3>
                        <p className='mt-3 text-sm leading-relaxed text-[#998d9e]'>Let our AI help you generate your next big idea for your interface.</p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default Designs