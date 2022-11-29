import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export const safeRedirect = (
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) => {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
};

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export const useMatchesData = (
  id: string
): Record<string, unknown> | undefined => {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
};

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} routeId The route id
 * @returns {T} The router data and throw invariant error if not found
 */
export const useRouteData = <T>(routeId: string): T => {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === routeId),
    [matchingRoutes, routeId]
  );
  invariant(route?.data, `Route not found: ${routeId}`);
  return route.data as T;
};

/**
 * Creates an array of numbers progressing from start up to stop, with step.
 * @param {number} start number starts from
 * @param {number} stop number to stop
 * @param {number} step step number
 * @returns {Array<number>} Array of numbers
 */
export const range = (
  start: number,
  stop: number,
  step: number
): Array<number> => {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
};

/**
 * Creates an array of years of this number of year from current year.
 * @param {number} numberOfYear number of year from current year
 * @returns {Array<number>} Array of numbers
 */

export const yearRange = (numberOfYear: number): Array<number> => {
  const currentYear = new Date().getFullYear();

  return range(currentYear, currentYear - numberOfYear, -1);
};

export const fromYearRange = (from: number): Array<number> => {
  const currentYear = new Date().getFullYear();

  return range(currentYear, from, -1);
};

const isUser = (user: any): user is User => {
  return user && typeof user === "object" && typeof user.email === "string";
};

export const useOptionalUser = (): User | undefined => {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
};

export const useUser = (): User => {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
};

export const validateEmail = (email: unknown): email is string => {
  return typeof email === "string" && email.length > 3 && email.includes("@");
};
