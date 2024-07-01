import { HomeIcon, MessageCircleIcon, UserIcon } from "lucide-react";

export const navItems = [
    {
        name: "Home",
        link: "/",
        icon: <HomeIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Usuarios",
        link: "/users",
        icon: <UserIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Facturas",
        link: "/sales",
        icon: (
            <MessageCircleIcon className="h-4 w-4 text-neutral-500 dark:text-white" />
        ),
    },
];

export const gridItems = [
    {
        id: 1,
        title: "Mantén tus facturas de manera ordenada y administrable ",
        description: "",
        className: "col-span-3 row-span-3 lg:min-h-[60vh] overflow-hidden",
        imgClassName: "w-full h-full",
        titleClassName: "justify-end",
        img: "/b1-2.png",
        spareImg: "",
    },
    {
        id: 2,
        title: "I'm very flexible with time zone communications",
        description: "",
        className: "col-span-2 row-span-1 relative overflow-hidden",
        imgClassName: "",
        titleClassName: "justify-start",
        img: "",
        spareImg: "",
    },
    {
        id: 3,
        title: "Nuestro Stack",
        description: "I constantly try to improve",
        className: "col-span-2 row-span-2",
        imgClassName: "",
        titleClassName: "justify-center",
        img: "",
        spareImg: "",
    },
    {
        id: 4,
        title: "Entusiastas de la tecnología y apasionados por el desarrollo.",
        description: "",
        className: "col-span-3 row-span-3",
        imgClassName: "",
        titleClassName: "justify-start",
        img: "/grid.svg",
        spareImg: "/b4.svg",
    }
];
