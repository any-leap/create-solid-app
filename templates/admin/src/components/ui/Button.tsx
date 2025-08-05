import { Button as KobalteButton } from "@kobalte/core/button"
import { cn } from "~/utils/cn"
import type { ComponentProps } from "solid-js"

export interface ButtonProps extends ComponentProps<typeof KobalteButton.Root> {
    variant?: "default" | "secondary" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
    class?: string
}

export function Button(props: ButtonProps) {
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        ghost: "text-gray-700 hover:bg-gray-100"
    }

    const sizes = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    }

    return (
        <KobalteButton.Root
            class={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none",
                variants[props.variant || "default"],
                sizes[props.size || "md"],
                props.class
            )}
            {...props}
        >
            {props.children}
        </KobalteButton.Root>
    )
}