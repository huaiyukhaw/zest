import { UniqueIdentifier } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type SortableItemType = {
    id: UniqueIdentifier
    [key: string]: string | number,
}

export type SortableItemProps = {
    id: UniqueIdentifier
    useHandle?: boolean,
    children: React.ReactNode | ((props: {
        isDragging: boolean
        activeIndex: number
        listeners?: SyntheticListenerMap
    }) => React.ReactNode)
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, useHandle, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        activeIndex,
    } = useSortable({ id: id, resizeObserverConfig: {} });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!useHandle) && { ...listeners }}
        >
            {typeof children === "function" ? children({ isDragging, activeIndex, listeners }) : children}
        </div>
    );
}

export default SortableItem