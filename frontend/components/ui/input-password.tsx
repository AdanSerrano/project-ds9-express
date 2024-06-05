import * as React from "react"

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"

import { Input } from "./input"
import { cn } from "@/lib/utils"

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <Input
                type={showPassword ? 'text' : 'password'}
                suffix={
                    showPassword ? (
                        <EyeOpenIcon className="select-none" onClick={() => setShowPassword(false)} />
                    ) : (
                        <EyeClosedIcon className="select-none" onClick={() => setShowPassword(true)} />
                    )}
                className={className}
                {...props}
                ref={ref}
            />
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
