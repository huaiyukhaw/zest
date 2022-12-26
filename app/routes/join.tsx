import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { getUserId, createUserSession } from "~/session.server";
import { createUser } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import clsx from "clsx"
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput, SubmitButton } from "~/components/form";
import { joinClientValidator, joinServerValidator } from "~/validators";
import { FormHiddenInput } from "~/components/form"

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const result = await joinServerValidator.validate(
    await request.formData()
  );

  if (result.error) return validationError(result.error);

  const { email, password, redirectTo } = result.data;

  const safeRedirectTo = safeRedirect(redirectTo, "/");

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: safeRedirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

type JoinPageProps = {
  asModal?: boolean
}

const JoinPage: React.FC<JoinPageProps> = ({ asModal = false }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  return (
    <div className={
      clsx(
        "bg-white dark:bg-gray-800 flex min-h-full flex-col justify-center",
        !asModal && "h-screen"
      )
    }>
      <div className={clsx(
        "mx-auto w-full max-w-md", !asModal && "px-8"
      )}>
        {
          !asModal &&
          <>
            <h1 className="text-2xl mb-2 font-medium text-gray-900 dark:text-gray-100">
              Create a new profile ✨
            </h1>
            <p className="text-sm mb-6 text-gray-700 dark:text-gray-400">
              By continuing you agree to our <span className="text-gray-900 dark:text-white">
                terms of service
              </span> and <span className="text-gray-900 dark:text-white">
                privacy policy
              </span>.
            </p>
          </>
        }

        <ValidatedForm validator={joinClientValidator} action="/join" method="post" className="space-y-2">
          <FormInput
            name="email"
            label="Email address"
            type="email"
            autoFocus
            autoCapitalize="off"
            spellCheck={false}
            showSuccessIcon
          />
          <FormInput
            name="password"
            label="Password"
            type="password"
            showSuccessIcon
          />
          <FormHiddenInput name="redirectTo" value={redirectTo} />
          <div className="flex items-center justify-between">
            {
              !asModal &&
              (<div className="flex items-center justify-center">
                <div className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    className="text-yellow-500 dark:text-yellow-400 underline underline-offset-2"
                    to={{
                      pathname: "/login",
                      search: searchParams.toString(),
                    }}
                  >
                    Log in
                  </Link>
                </div>
              </div>)
            }
            <SubmitButton
              className={
                clsx(
                  asModal && "w-full"
                )
              }
            >
              Create
            </SubmitButton>
          </div>
        </ValidatedForm>
      </div >
    </div >
  );
}

export default JoinPage