import React from 'react'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import { Spotlight } from './ui/spotlight'
import { RocketIcon } from 'lucide-react'
import MagicButton from './ui/MagicButton'

export const Hero = () => {
    return (
        <>
            <div className='pb-20 pt-36'>
                <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white' />
                <Spotlight className='-top-10 -left-full h-[80vh] w-[50vw]' fill='purple' />
                <Spotlight className='-top-28 left-80 h-[80vh] w-[50vw]' fill='blue' />
            </div>
            <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.5] flex items-center justify-center absolute  top-0 left-0">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>
            <div className='flex justify-center relative my-20 z-10'>
                <div className='max-h-[89vh] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'>
                    <h2 className='uppercase tracking-widest text-sm text-center text-blue-100 max-w-80'>
                        DISEÑO DINAMICO CON NEXT JS
                    </h2>
                    <TextGenerateEffect
                        className='text-center text-[40px] md:text-5xl lg:text-6xl font-normal '
                        words='ADMINISTRA TUS FACTURAS DE MANERA RAPIDA Y SEGURA'
                    />

                    <a href="#about">
                        <MagicButton
                            title='Ingresa tu factura'
                            icon={<RocketIcon />}
                            position='right'
                        />
                    </a>
                </div>
            </div>
        </>
    )
}
