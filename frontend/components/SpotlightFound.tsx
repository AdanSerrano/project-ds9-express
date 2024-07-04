import React from 'react'
import { Spotlight } from './ui/spotlight'

export const SpotlightFound = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative overflow-hidden flex items-center justify-center w-full min-h-screen h-full">
            <div className="pb-20 pt-36">
                <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
                <Spotlight className="-top-10 left-40 h-[80vh] w-[50vw]" fill="blue" />
                <Spotlight className="-top-28 left-80 h-[80vh] w-[50vw]" fill="purple" />
            </div>
            <div className="h-screen w-full bg-black-100 bg-grid-white/[0.03] flex items-center justify-center absolute top-0 left-0">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>
            {children}
        </div>
    )
}
