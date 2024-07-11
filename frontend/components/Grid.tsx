import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";

export const Grid = () => {
    return (
        <BentoGrid className="w-full mb-16">
            {gridItems.map((item) => (
                <BentoGridItem
                    id={item.id}
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    className={item.className}
                    img={item.img}
                    imgClassName={item.imgClassName}
                    titleClassName={item.titleClassName}
                    spareImg={item.spareImg}
                />
            ))}
        </BentoGrid>
    );
}
export default Grid;

export const gridItems = [
    {
        id: 1,
        title: "Mantén tus facturas de manera ordenada y administrable ",
        description: "",
        className: "lg:col-span-3 md:col-span-6 md:row-span-2",
        imgClassName: "w-full h-full",
        titleClassName: "justify-end",
        img: "/b1-2.png",
        spareImg: "",
    },
    {
        id: 2,
        title: "Entusiastas de la tecnología y apasionados por el desarrollo.",
        description: "Soy muy flexible con las comunicaciones de zona horaria.",
        className: "lg:col-span-2 md:col-span-3 md:row-span-2",
        imgClassName: "",
        titleClassName: "justify-start",
        img: "",
        spareImg: "",
    },
    {
        id: 3,
        title: "Nuestro Stack",
        description: "Actualmente construyendo un Proyecto en Next JS",
        className: "lg:col-span-2 md:col-span-2 md:row-span-1",
        imgClassName: "",
        titleClassName: "justify-center",
        img: "",
        spareImg: "",
    },
    {
        id: 4,
        title: "Entusiastas de la tecnología y apasionados por el desarrollo.",
        description: "Innovación",
        className: "lg:col-span-3 md:col-span-3 md:row-span-1",
        imgClassName: "",
        titleClassName: "justify-start",
        img: "/grid.svg",
        spareImg: "/b4.svg",
    },
];
