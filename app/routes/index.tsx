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
    <main className="flex flex-col items-center justify-center gap-y-2 min-h-screen mx-4">
      <div className="flex items-center gap-1.5 mb-4">
        <img src="/zest.svg" alt="" className="w-7 h-7" />
        <span className="text-lg">
          Zest CV
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white text-center">The Professional Profile</h1>
      <h2 className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 text-center">for people in tech with robust work profiles at its core.</h2>
      {
        (user) ? (
          <>
            <Link to="app" className="btn-secondary mt-10">
              Continue
            </Link>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="px-3 py-1 text-sm underline underline-offset-2 hover:underline-offset-4"
              >
                Log out
              </button>
            </Form>
          </>
        ) : (
          <>
            <div className="hidden sm:flex flex-row gap-y-2 items-center">
              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="flex flex-col gap-2 items-center justify-center mt-10">
                  <Dialog.Trigger
                    className="btn-secondary"
                    onClick={() => setIsNewUser(false)}
                  >
                    Continue
                  </Dialog.Trigger>
                  <small className="text-gray-500 dark:text-gray-400">or</small>
                  <Dialog.Trigger
                    className="group py-1 text-sm border-b-2 border-yellow-400 hover:border-yellow-500 dark:border-yellow-500 dark:hover:border-yellow-400 relative"
                    onClick={() => setIsNewUser(true)}
                  >
                    <span>
                      Signup w/ email
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute inset-y-0 -right-5 my-auto transition duration-750 group-hover:translate-x-1">
                      <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                    </svg>
                  </Dialog.Trigger>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Don't miss out on your favorite username ;)</p>
                </div>
                <Dialog.Transition show={isDialogOpen}>
                  <Dialog.Content>
                    {isNewUser ?
                      <>
                        <Dialog.Title className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                          Create a new profile ✨
                        </Dialog.Title>
                        <Dialog.Description className="mb-4 text-sm text-gray-700 dark:text-gray-400">
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
                        <Dialog.Title className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                          Login to your account 👋
                        </Dialog.Title>
                        <Dialog.Description className="mb-4 text-sm text-gray-700 dark:text-gray-400">
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
            <div className="sm:hidden flex flex-col gap-2 items-center justify-center mt-10">
              <Link
                className="btn-secondary"
                to="login"
              >
                Continue
              </Link>
              <Link
                className="group py-1 text-sm border-b-2 border-yellow-400 hover:border-yellow-500 dark:border-yellow-500 dark:hover:border-yellow-400 relative"
                to="join"
              >
                <span>
                  Signup w/ email
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute inset-y-0 -right-5 my-auto transition duration-750 group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </>
        )
      }
    </main>
  );
}

export default Index
