// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
"use client";

import * as React from "react";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ suffix, className, type, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
    return (
      <div className="flex flex-row gap-2 items-center w-full">
        <motion.div
          style={{
            background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          #A854F7,
          transparent 80%
        )
      `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="p-[2px] rounded-lg transition duration-300 group/input w-full"
        >
          <input
            type={type}
            className={cn(
              `flex h-10 w-full border-none bg-gray-50 text-black rounded-md px-3 py-2 text-sm 
          file:text-sm file:font-medium placeholder:text-neutral-400  
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
          
           group-hover/input:shadow-none transition duration-400
           `,
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.div>
        {suffix}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
