"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ArrowRight, BriefcaseBusiness, Bolt, History, ShieldCheck, Wallet } from 'lucide-react'

function Credits() {

    const { user } = useAuthContext();
    const [userData, setUserData] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user && GetUserCredits();
    }, [user])

    const GetUserCredits = async () => {
        setLoading(true);
        const result = await axios.get('/api/user?email=' + user?.email);
        console.log(result.data)
        setUserData(result.data);
        setLoading(false);
    }

    const creditCount = typeof userData?.credits === 'number' ? userData.credits : 0;

    return (
        <section className='relative min-h-[calc(100vh-140px)] bg-transparent text-[#e2e2e2]'>
            <div className='pointer-events-none absolute -right-14 -top-12 h-80 w-80 rounded-full bg-[#e0b6ff]/6 blur-[100px]' />
            <div className='pointer-events-none absolute -left-16 bottom-3 h-64 w-64 rounded-full bg-[#9d4edd]/8 blur-[90px]' />

            <div className='relative z-10'>
                <header className='mb-9'>
                    <h1 className='text-4xl font-black tracking-tight'>Credits</h1>
                    <p className='mt-2 max-w-2xl text-sm text-[#d0c2d5]/70'>
                        Manage your account balance and purchase additional resources for your creative projects.
                    </p>
                </header>

                <div className='grid grid-cols-12 gap-5'>
                    <div className='col-span-12 overflow-hidden rounded-xl border border-[#4d4353]/10 bg-[#1b1b1b] p-6 md:p-8'>
                        <div className='pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#e0b6ff]/5 blur-[100px]' />
                        <div className='pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#9d4edd]/5 blur-[80px]' />
                        <div className='relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-start gap-4 md:items-center md:gap-6'>
                                <div className='flex h-16 w-16 items-center justify-center rounded-lg border border-[#4d4353]/10 bg-[#2a2a2a] shadow-xl'>
                                    <Wallet className='h-7 w-7 text-[#e0b6ff]' />
                                </div>
                                <div>
                                    <p className='mb-1 text-xs uppercase tracking-[0.18em] text-[#e0b6ff]/80'>Current Balance</p>
                                    <h2 className='text-4xl font-black tracking-tight md:text-6xl'>
                                        My Credits: <span className='text-[#e0b6ff]'>{loading ? '...' : creditCount}</span>
                                    </h2>
                                </div>
                            </div>

                            <div className='flex items-center gap-4'>
                                <div className='hidden text-right lg:block'>
                                    <p className='text-xs font-medium text-[#d0c2d5]'>Need more power?</p>
                                    <p className='text-xs text-[#998d9e]'>Top up your account instantly</p>
                                </div>
                                <Button className='h-14 min-w-40 rounded-md bg-gradient-to-br from-[#e0b6ff] to-[#9d4edd] px-7 text-base font-bold text-[#2e004e] shadow-[0_10px_30px_rgba(157,78,221,0.3)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(157,78,221,0.5)]'>
                                    Buy More Credits
                                    <ArrowRight className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <article className='col-span-12 rounded-xl border border-[#4d4353]/10 bg-[#1b1b1b] p-6 md:col-span-4'>
                        <Bolt className='mb-4 h-5 w-5 text-[#e0b6ff]' />
                        <h3 className='mb-2 text-lg font-bold'>Instant Activation</h3>
                        <p className='text-sm leading-relaxed text-[#d0c2d5]'>
                            Purchased credits are applied to your workspace immediately. No waiting required.
                        </p>
                    </article>

                    <article className='col-span-12 rounded-xl border border-[#4d4353]/10 bg-[#1b1b1b] p-6 md:col-span-4'>
                        <History className='mb-4 h-5 w-5 text-[#edc156]' />
                        <h3 className='mb-2 text-lg font-bold'>Transaction History</h3>
                        <p className='text-sm leading-relaxed text-[#d0c2d5]'>
                            Keep track of every credit spent and earned through a detailed ledger of activity.
                        </p>
                    </article>

                    <article className='col-span-12 rounded-xl border border-[#4d4353]/10 bg-[#1b1b1b] p-6 md:col-span-4'>
                        <ShieldCheck className='mb-4 h-5 w-5 text-[#e0b6ff]' />
                        <h3 className='mb-2 text-lg font-bold'>Secure Billing</h3>
                        <p className='text-sm leading-relaxed text-[#d0c2d5]'>
                            All transactions are encrypted and processed by trusted payment infrastructure.
                        </p>
                    </article>

                    <div className='col-span-12 mt-1 rounded-xl bg-gradient-to-r from-[#9d4edd]/35 via-[#9d4edd]/20 to-transparent p-[1px]'>
                        <div className='flex flex-col gap-4 rounded-xl bg-[#0e0e0e] p-5 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='rounded-md bg-[#e0b6ff]/10 p-2'>
                                    <BriefcaseBusiness className='h-4 w-4 text-[#e0b6ff]' />
                                </div>
                                <p className='text-sm text-[#e2e2e2]'>
                                    New Year Special: Get <span className='font-bold text-[#e0b6ff]'>20% extra credits</span> on all packs over 500.
                                </p>
                            </div>
                            <button className='text-left text-xs font-bold uppercase tracking-wide text-[#e0b6ff] hover:text-[#f2daff] md:text-right'>
                                View Packs {">"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Credits