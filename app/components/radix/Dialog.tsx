import { forwardRef } from "react"
import { Transition as HTransition } from "@headlessui/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Fragment } from "react";
import clsx from "clsx";


export const Root = DialogPrimitive.Root;
export const Trigger = DialogPrimitive.Trigger;
export const Title = DialogPrimitive.Title
export const Description = DialogPrimitive.Description
export const Close = DialogPrimitive.Close

export interface TransitionProps extends React.PropsWithChildren {
    show: boolean
}

export const Transition: React.FC<TransitionProps> = ({ show, children }) => (
    <HTransition.Root show={show}>
        <HTransition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <DialogPrimitive.Overlay
                forceMount
                className="fixed inset-0 z-20 bg-black/50"
            />
        </HTransition.Child>
        <HTransition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            {children}
        </HTransition.Child>
    </HTransition.Root>
)

export interface ContentProps extends Omit<React.ComponentPropsWithRef<"div">, "className"> {
    lg?: boolean
    closeButton?: boolean
    noPadding?: boolean
}

export const Content: React.FC<ContentProps> = forwardRef(
    ({ children, lg = false, closeButton = false, noPadding = false, ...props }, forwardedRef) => (
        <DialogPrimitive.Content {...props} ref={forwardedRef}
            forceMount
            className={clsx(
                "fixed z-50",
                "w-[95vw] rounded-2xl md:w-full",
                "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                "bg-white dark:bg-gray-800",
                "focus-visible:ring focus-visible:outline-yellow-500 focus-visible:outline-opacity-75",
                noPadding ? "p-0" : "p-6",
                lg ? "max-w-3xl" : "max-w-sm"
            )}
        >
            {children}
            {closeButton && (
                <DialogPrimitive.Close
                    className={clsx(
                        "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                        "focus-visible:ring focus-visible:outline-yellow-500 focus-visible:outline-opacity-75"
                    )}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    )
);