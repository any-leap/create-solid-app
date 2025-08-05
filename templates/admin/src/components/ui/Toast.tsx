import { Toast as KobalteToast } from "@kobalte/core/toast"
import { CheckCircle, AlertCircle, X, Info } from "lucide-solid"
import { cn } from "~/utils/cn"
import type { ComponentProps } from "solid-js"

export interface ToastProps extends ComponentProps<typeof KobalteToast> {
    variant?: "default" | "success" | "error" | "warning"
}

export function ToastRegion(props: ComponentProps<typeof KobalteToast.Region>) {
    return (
        <KobalteToast.Region
            class="fixed top-0 right-0 z-50 m-4 flex max-w-sm flex-col space-y-4"
            {...props}
        >
            <KobalteToast.List class="flex flex-col space-y-2" />
        </KobalteToast.Region>
    )
}

export function Toast(props: ToastProps) {
    const variants = {
        default: "border-gray-200 bg-white text-gray-900",
        success: "border-green-200 bg-green-50 text-green-900",
        error: "border-red-200 bg-red-50 text-red-900",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900"
    }

    const icons = {
        default: Info,
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertCircle
    }

    const Icon = icons[props.variant || "default"]

    return (
        <KobalteToast
            class={cn(
                "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
                "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--kb-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--kb-toast-swipe-move-x)] data-[swipe=move]:transition-none",
                "data-[opened]:animate-in data-[closed]:animate-out data-[swipe=end]:animate-out data-[closed]:fade-out-80 data-[closed]:slide-out-to-right-full data-[opened]:slide-in-from-top-full data-[opened]:sm:slide-in-from-bottom-full",
                variants[props.variant || "default"]
            )}
            {...props}
        >
            <div class="flex items-center space-x-2">
                <Icon class="h-5 w-5 flex-shrink-0" />
                <div class="grid gap-1">
                    <KobalteToast.Title class="text-sm font-semibold">
                        {props.children}
                    </KobalteToast.Title>
                    <KobalteToast.Description class="text-sm opacity-90" />
                </div>
            </div>
            <KobalteToast.CloseButton class="absolute right-2 top-2 rounded-md p-1 text-current/50 opacity-0 transition-opacity hover:text-current focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
                <X class="h-4 w-4" />
            </KobalteToast.CloseButton>
        </KobalteToast>
    )
}