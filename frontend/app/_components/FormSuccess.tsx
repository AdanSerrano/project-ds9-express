import React from 'react'

export const FormSuccess = ({ message }: { message?: string }) => {
    if (!message) return null
    return (
        <section className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500'>
            <span>
                {message}
            </span>
        </section>
    )
}
