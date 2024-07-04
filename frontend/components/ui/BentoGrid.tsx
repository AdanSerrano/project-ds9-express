import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./BackgroundGradientAnimation";
import Image from "next/image";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                // change gap-4 to gap-8, change grid-cols-3 to grid-cols-5, remove md:auto-rows-[18rem], add responsive code
                "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-2 gap-4 lg:gap-8 mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    id,
    img,
    imgClassName,
    spareImg,
    titleClassName,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    id?: number,
    img?: string,
    imgClassName?: string,
    spareImg?: string,
    titleClassName?: string
}) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 ",
                className
            )}
            style={{
                background: ' rgb(2, 0, 36)',
                backgroundColor: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(26,26,28,1) 23%, rgba(109,121,124,1) 100%)'
            }}
        >
            <div className={`${id === 6 && "flex justify-center"} h-full`}>
                <div className="absolute">
                    {img && (
                        <Image
                            src={img}
                            alt={img}
                            className={cn(imgClassName, "object-cover object-center")}
                            fill
                        />
                    )}
                </div>
                <div className={`absolute -right-20 -bottom-5 ${id === 4 && 'w-full opacity-80'}`}>
                    {spareImg && (
                        <Image
                            src={spareImg}
                            alt={spareImg}
                            className={"object-cover object-center w-full h-full"}
                            fill
                        />
                    )}
                </div>
                {id === 6 && (
                    <BackgroundGradientAnimation>
                        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
                    </BackgroundGradientAnimation>
                )}
                <div className={cn(titleClassName, 'group-hover/bento:translate-x-2 transition duration-200 relative md:w-full min-h-40 flex flex-col px-5 p-5 lg:p-10')}>
                    <div className="font-sans font-extralight text-[#c1c2d3] text-sm md:text-xs lg:text-base z-10">

                        {description}
                    </div>
                </div>
            </div>
            <div className="relative z-50 p-10 group-hover/bento:translate-x-2 transition duration-200">
                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
            </div>
        </div >
    );
};
