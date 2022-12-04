import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react"
import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import type { Project } from "@prisma/client"
import { getAllProjectsByUsername } from "~/models/project.server"
import { AlertDialog } from "~/components/radix"
import { EmptyProject } from "~/images/empty"
import clsx from "clsx"
import { marked } from "marked"
import DOMPurify from 'isomorphic-dompurify';

export type ProjectsLoaderData = {
    projects: Array<Project>
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    const projects = await getAllProjectsByUsername({
        profileUsername: params.profile
    })
    return json({ projects });
}

const ProjectsIndexPage = () => {
    const navigate = useNavigate();
    const { projects } = useLoaderData<ProjectsLoaderData>()

    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center justify-between gap-3">
                <h2 className="text-xl">
                    Projects
                </h2>
                <div>
                    <Link
                        to="new"
                        className="btn-secondary"
                    >
                        Add project
                    </Link>
                </div>
            </div>
            <div className="scrollbar-hide flex flex-col flex-1 m-1 py-4 divide-y divide-gray-200 dark:divide-gray-700">
                {
                    projects.length > 0 ? (
                        projects.map(({
                            id,
                            title,
                            year,
                            company,
                            url,
                            description,
                            published,
                            order
                        }) => (
                            <div key={id} className="flex gap-9 justify-between py-4 -mx-4 px-4">
                                <div className="w-24 flex-none">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{order}: {year}</span>
                                </div>
                                <div className="flex flex-col grow shrink-0 w-min">
                                    <div className={
                                        clsx(
                                            !published && "blur-[1.5px] select-none"
                                        )
                                    }>
                                        <div
                                            className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {
                                                (url && published) ? (
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline hover:underline-offset-2"
                                                    >
                                                        {title}{company && ` at ${company}`}
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                                                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                                        </svg>
                                                    </a>
                                                ) : (
                                                    <span>
                                                        {title}{company && ` at ${company}`}
                                                    </span>
                                                )
                                            }
                                        </div>
                                        {
                                            (description) && (
                                                <div
                                                    className="prose prose-neutral prose-sm dark:prose-invert mt-1"
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(description)) }}
                                                />
                                            )
                                        }
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Form action={id} method="post">
                                            <input type="hidden" name="subaction" value={
                                                published ? "draft" : "publish"
                                            } />
                                            <button type="submit" className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">{
                                                published ? "Revert to draft" : "Publish"
                                            }</button>
                                        </Form>
                                        <div>
                                            <Link to={id} className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">Edit</Link>
                                        </div>
                                        <Form action={id} method="post">
                                            <input type="hidden" name="subaction" value="delete" />
                                            <button type="submit" className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">Delete</button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        )
                        ))
                        : (
                            <div className={
                                clsx("flex flex-col items-center justify-center gap-4 h-full")
                            }>
                                <img src={EmptyProject} alt="" width={200} height={200} className="dark:invert" />
                                <Link
                                    to="new"
                                    className="btn-secondary"
                                >
                                    Add a work project you're proud of
                                </Link>
                            </div>
                        )
                }
            </div>
            <div className="dialog-footer">
                <AlertDialog.Cancel className="btn-secondary" onClick={() => navigate("/u/huaiyukhaw")}>
                    Done
                </AlertDialog.Cancel>
            </div>
        </>
    )
}

export default ProjectsIndexPage