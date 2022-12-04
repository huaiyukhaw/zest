import { useState } from "react"
import { defaultRoutes } from "~/utils";
import type { RouteType } from "~/utils"
import { Form, NavLink, useMatches, useSubmit } from "@remix-run/react";
import clsx from "clsx";
import { SortableItem, SortableItemType, SortableList } from "../sortable";

export type RoutesProps = {
    sectionOrder: Array<RouteType> | null
}

export const Routes: React.FC<RoutesProps> = ({ sectionOrder }) => {
    const [routes, setRoutes] = useState<RouteType[]>(() => sectionOrder ?? defaultRoutes)
    const matches = useMatches()
    const currentPathname = matches[matches.length - 1].pathname

    const submit = useSubmit();

    const onDragEnd = (items: SortableItemType[]) => {
        submit({ sectionOrder: items.map(item => item.id).toString() }, {
            method: "post",
            action: currentPathname
        })
    }

    return (
        <Form method="post">
            <NavLink to="." end>
                {
                    ({ isActive }) => (
                        <div className={
                            clsx(
                                "group pl-9 py-1.5",
                                isActive ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100/40 dark:hover:bg-gray-700/40"
                            )
                        }>
                            <span className={
                                clsx(
                                    "text-sm",
                                    isActive ?
                                        "text-gray-700 dark:text-gray-200"
                                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                                )
                            }>
                                General
                            </span>
                        </div>
                    )
                }
            </NavLink>
            <SortableList items={routes} onItemsChange={setRoutes as React.Dispatch<React.SetStateAction<SortableItemType[]>>} onDragEnd={onDragEnd}>
                <ul>
                    {routes.map(({ id, name, path }) => (
                        <SortableItem id={id} key={id} useHandle>
                            {
                                ({ isDragging, activeIndex, listeners }) => (
                                    <li
                                        className={
                                            clsx(
                                                "relative group/item flex items-center justify-between",
                                                isDragging && "bg-gray-100 dark:bg-gray-700",
                                                activeIndex < 0 && "hover:bg-gray-100/40 dark:hover:bg-gray-700/40",
                                            )
                                        }
                                    >
                                        <NavLink to={path} className={
                                            clsx(
                                                "flex-1 ",
                                                isDragging && "cursor-default"
                                            )
                                        }>
                                            {
                                                ({ isActive }) => (
                                                    <div className="pl-9 py-1.5 absolute inset-0">
                                                        <span className={
                                                            clsx(
                                                                "relative w-full h-full text-sm",
                                                                isDragging ? "text-gray-700 dark:text-gray-200" : "text-gray-600 dark:text-gray-400",
                                                                activeIndex < 0 && "group-hover/item:text-gray-700 dark:group-hover/item:text-gray-200",
                                                                isActive && "text-gray-700 dark:text-gray-200"
                                                            )
                                                        }>
                                                            {name}
                                                        </span>
                                                        <div className={
                                                            clsx(
                                                                isActive && "absolute inset-0 bg-gray-100 dark:bg-gray-700 mix-blend-darken dark:mix-blend-lighten"
                                                            )
                                                        }></div>
                                                    </div>
                                                )
                                            }
                                        </NavLink>
                                        <div
                                            className={
                                                clsx(
                                                    "px-2.5 py-2.5 flex-none",
                                                    isDragging ? "z-50 text-gray-700 dark:text-gray-200" : "z-0 text-gray-400 dark:text-gray-600",
                                                    activeIndex < 0 ? "hover:text-gray-700 dark:hover:text-gray-200 cursor-grab" : "cursor-grabbing",
                                                )
                                            } {...listeners}>
                                            <svg
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                            >
                                                <rect
                                                    x={2}
                                                    y={5}
                                                    width={12}
                                                    height={1.5}
                                                    rx={0.5}
                                                />
                                                <rect
                                                    x={2}
                                                    y={9.5}
                                                    width={12}
                                                    height={1.5}
                                                    rx={0.5}
                                                />
                                            </svg>
                                        </div>
                                    </li>
                                )
                            }
                        </SortableItem>
                    ))}
                </ul>
            </SortableList>
        </Form>
    )
}

export default Routes