import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { ErrorFragment } from "./components/boundaries";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix CV",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

const App = () => {
  return (
    <html lang="en" className="bg-white dark:bg-gray-800 dark:text-white">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>
        <LiveReload />
      </body>
    </html>
  );
}

export const CatchBoundary = () => {
  return (
    <html lang="en" className="bg-white dark:bg-gray-800 dark:text-white">
      <head>
        <title>404: Page not found</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
          <div className="mt-4 z-20 text-3xl font-bold">Looking for something? &#128269;</div>
          <div className="mt-2 z-20">We couldn't find the page you're looking for!</div>
          <div className="mt-4 z-20">
            <Link to="/" className="btn-secondary">Head back</Link>
          </div>
          <div className="absolute z-0 select-none opacity-[2%] filter transition duration-200 blur-[2px]">
            <h1 className="text-[20rem] font-black">404</h1>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <html lang="en" className="bg-white dark:bg-gray-800 dark:text-white">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="h-screen">
          <ErrorFragment error={error} />
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default App