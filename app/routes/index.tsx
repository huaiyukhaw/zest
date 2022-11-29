import { useState } from "react";
import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import { Dialog } from '~/components/radix';
import LoginPage from "./login";
import JoinPage from "./join";

const Index = () => {
  const user = useOptionalUser();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isNewUser, setIsNewUser] = useState<boolean>(false)

  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-900 sm:flex sm:items-center sm:justify-center">
      <div className="relative w-full sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1250&q=80"
                alt="Sonic Youth On Stage"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-yellow-900/75 mix-blend-multiply" />
            </div>
            <div className="relative flex h-screen flex-col justify-between px-4 pt-16 pb-8 sm:h-full sm:px-6 sm:pt-14 sm:pb-14 lg:px-8">
              <h1 className="max-w-lg text-3xl text-white sm:max-w-3xl">
                <span className="text-primary">Zest </span>
                is a show, don't tell professional platform to form beautiful
                profiles and make meaningful connections.
              </h1>
              <div className="mt-10">
                {user ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                    <Link
                      to="/u"
                      className="flex w-full sm:w-fit items-center justify-center rounded-full border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      View Profile for {user.email}
                    </Link>
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="flex w-full sm:w-fit items-center justify-center rounded-full border border-transparent bg-white px-4 py-3 text-base font-medium text-black shadow-sm hover:bg-yellow-50 sm:px-8"
                      >
                        Log out
                      </button>
                    </Form>
                  </div>
                ) : (
                  <>
                    <div className="hidden sm:flex flex-row gap-2 items-center">
                      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Dialog.Trigger
                          className="text-black flex items-center justify-center rounded-full border border-transparent bg-white/80 px-8 py-3 text-base font-medium shadow-sm hover:bg-white"
                          onClick={() => setIsNewUser(true)}
                        >
                          Sign up
                        </Dialog.Trigger>
                        <Dialog.Trigger
                          className="flex items-center justify-center rounded-full bg-primary/80 px-8 py-3 font-medium text-white hover:bg-primary"
                          onClick={() => setIsNewUser(false)}
                        >
                          Log In
                        </Dialog.Trigger>
                        <Dialog.Transition show={isDialogOpen}>
                          <Dialog.Content>
                            {isNewUser ?
                              <>
                                <Dialog.Title className="dialog-title">
                                  Create a new profile ✨
                                </Dialog.Title>
                                <Dialog.Description className="dialog-desc">
                                  By continuing you agree to our <span className="text-gray-900 dark:text-white">
                                    terms of service
                                  </span> and <span className="text-gray-900 dark:text-white">
                                    privacy policy
                                  </span>.
                                </Dialog.Description>
                                <JoinPage asModal />
                                <div className="mt-6 flex items-center justify-center">
                                  <div className="text-center text-sm text-gray-500">
                                    Already have an account?{" "}
                                    <button
                                      className="text-yellow-500 dark:text-yellow-400 underline underline-offset-2"
                                      onClick={() => setIsNewUser(false)}
                                    >
                                      Log in
                                    </button>
                                  </div>
                                </div>
                              </> : <>
                                <Dialog.Title className="dialog-title">
                                  Login to your account 👋
                                </Dialog.Title>
                                <Dialog.Description className="dialog-desc">
                                  By continuing you agree to our <span className="text-gray-900 dark:text-white">
                                    terms of service
                                  </span> and <span className="text-gray-900 dark:text-white">
                                    privacy policy
                                  </span>.
                                </Dialog.Description>
                                <LoginPage asModal />
                                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                  Don't have an account?{" "}
                                  <button
                                    className="text-yellow-500 dark:text-yellow-400 underline underline-offset-2"
                                    onClick={() => setIsNewUser(true)}
                                  >
                                    Sign up
                                  </button>
                                </div>
                              </>}
                          </Dialog.Content>
                        </Dialog.Transition>
                      </Dialog.Root>
                    </div>
                    <div className="sm:hidden flex flex-col gap-2">
                      <Link
                        className="text-black flex items-center justify-center rounded-full border border-transparent bg-white/80 px-8 py-3 text-base font-medium shadow-sm hover:bg-white"
                        to="join"
                      >
                        Sign up
                      </Link>
                      <Link
                        className="flex items-center justify-center rounded-full bg-primary/80 px-8 py-3 font-medium text-white hover:bg-primary"
                        to="login"
                      >
                        Log In
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Index
