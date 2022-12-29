import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export const Content = ({ children }: { children?: React.ReactNode }) => {
    const [open, setOpen] = useState(true)

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed sm:hidden inset-0 overflow-hidden z-50" onClose={setOpen}>
                <div className="absolute inset-0 overflow-hidden">
                    <Dialog.Overlay className="absolute inset-0" />
                    <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-20">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-0"
                            enterTo="translate-x-full"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-full"
                            leaveTo="translate-x-0"
                        >
                            <div className="pointer-events-auto w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 py-6 shadow-xl">
                                    <div className="pl-9 pr-6 py-1.5 flex items-start justify-between">
                                        <Dialog.Title className="text-lg text-gray-500 dark:text-gray-400">Profile</Dialog.Title>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                type="button"
                                                className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative mt-6 flex-1">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
