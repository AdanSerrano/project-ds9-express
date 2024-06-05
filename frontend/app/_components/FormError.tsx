import React from 'react'

export const FormError = ({ message }: { message?: string }) => {
    if (!message) return null
    return (
        <section className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
            <span>
                {message}
            </span>
        </section>
    )
}
