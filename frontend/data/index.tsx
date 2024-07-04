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
