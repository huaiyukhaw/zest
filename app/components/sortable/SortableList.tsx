import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem, { SortableItemType } from "./SortableItem";

export type SortableListProps = {
    items: SortableItemType[]
    onItemsChange: React.Dispatch<React.SetStateAction<SortableItemType[]>>
    onDragEnd?: (items: SortableItemType[]) => void
    children?: React.ReactNode
}

export const SortableList: React.FC<SortableListProps> = ({ items, onItemsChange, onDragEnd, children }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over) {
            if (active.id !== over.id) {
                onItemsChange((items) => {
                    const oldIndex = items.findIndex((item) => item.id === active.id);
                    const newIndex = items.findIndex((item) => item.id === over!.id);

                    const newItems = arrayMove(items, oldIndex, newIndex);

                    if (onDragEnd) onDragEnd(newItems)
                    return newItems
                });
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <div>
                    {children ?? (
                        items.map(item => <SortableItem key={item.id} id={item.id}>{children}</SortableItem>)
                    )}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default SortableList