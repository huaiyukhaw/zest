import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect } from "~/utils";

import clsx from "clsx"
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput, SubmitButton } from "~/components/form";
import { loginClientValidator, loginServerValidator } from "~/validators";
import FormHiddenInput from "~/components/form/FormHiddenInput";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const action: ActionFunction = async ({ request }) => {
  const result = await loginServerValidator.validate(
    await request.formData()
  );

  if (result.error) return validationError(result.error);

  const { email, password, remember, redirectTo } = result.data;
  const safeRedirectTo = safeRedirect(redirectTo, "/u");

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: safeRedirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

type JoinPageProps = {
  asModal?: boolean
}

const LoginPage: React.FC<JoinPageProps> = ({ asModal = false }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  return (
    <div className={
      clsx(
        "bg-white dark:bg-gray-800 flex min-h-full flex-col justify-center",
        !asModal && "h-screen"
      )
    }>
      <div className={
        clsx(
          "mx-auto w-full max-w-md", !asModal && "px-8")
      }>
        {
          !asModal &&
          <>
            <h1 className="text-2xl mb-2 font-medium text-gray-900 dark:text-gray-100">
              Login to your account 👋
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
        <ValidatedForm validator={loginClientValidator} action="/login" method="post" className="space-y-2">
          <FormInput
            name="email"
            label="Email address"
            type="email"
            autoFocus={true}
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
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex items-center pb-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
              >
                Remember me
              </label>
            </div>
            <SubmitButton className="py-2">Login</SubmitButton>
          </div>
          {
            !asModal && <div className="pt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                className="text-yellow-500 dark:text-yellow-400 underline underline-offset-2"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          }
        </ValidatedForm>
      </div >
    </div >
  );
}

export default LoginPage