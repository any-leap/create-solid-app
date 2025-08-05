import { Dialog as KobalteDialog } from "@kobalte/core/dialog"
import { X } from "lucide-solid"
import { cn } from "~/utils/cn"
import type { ComponentProps } from "solid-js"

export interface DialogProps extends ComponentProps<typeof KobalteDialog> {
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function Dialog(props: DialogProps) {
    return (
        <KobalteDialog {...props}>
            {props.children}
        </KobalteDialog>
    )
}

export function DialogTrigger(props: ComponentProps<typeof KobalteDialog.Trigger>) {
    return (
        <KobalteDialog.Trigger {...props}>
            {props.children}
        </KobalteDialog.Trigger>
    )
}

export function DialogContent(props: ComponentProps<typeof KobalteDialog.Content> & { class?: string }) {
    return (
        <KobalteDialog.Portal>
            <KobalteDialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0" />
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <KobalteDialog.Content
                    class={cn(
                        "relative bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-lg",
                        "data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0",
                        "data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95",
                        "data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%]",
                        "data-[expanded]:slide-in-from-left-1/2 data-[expanded]:slide-in-from-top-[48%]",
                        props.class
                    )}
                    {...props}
                >
                    {props.children}
                    <KobalteDialog.CloseButton class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none">
                        <X class="h-4 w-4" />
                        <span class="sr-only">关闭</span>
                    </KobalteDialog.CloseButton>
                </KobalteDialog.Content>
            </div>
        </KobalteDialog.Portal>
    )
}

export function DialogHeader(props: { class?: string; children: any }) {
    return (
        <div class={cn("flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0", props.class)}>
            {props.children}
        </div>
    )
}

export function DialogTitle(props: ComponentProps<typeof KobalteDialog.Title> & { class?: string }) {
    return (
        <KobalteDialog.Title
            class={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", props.class)}
            {...props}
        >
            {props.children}
        </KobalteDialog.Title>
    )
}

export function DialogDescription(props: ComponentProps<typeof KobalteDialog.Description> & { class?: string }) {
    return (
        <KobalteDialog.Description
            class={cn("text-sm text-gray-500", props.class)}
            {...props}
        >
            {props.children}
        </KobalteDialog.Description>
    )
}

export function DialogFooter(props: { class?: string; children: any }) {
    return (
        <div class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", props.class)}>
            {props.children}
        </div>
    )
}