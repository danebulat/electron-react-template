import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors } from "@dnd-kit/core";
import {
	restrictToHorizontalAxis,
	restrictToParentElement
} from "@dnd-kit/modifiers";
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

/* -------------------- */
/* Tab Component        */
/* -------------------- */

interface TabProps {
	id: number;
	label: string;
}

const Tab: React.FC<TabProps> = ({ id, label }: TabProps) => {
	/* Dnd */
	const {
		attributes,
	  listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id, transition: { duration: 250, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }})

	/* Styles */
	const outerStyle: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		backgroundColor: '#333',
		padding: '0.25rem 1rem',
		borderRadius: '0.25rem',
		fontSize: '0.8rem',
	};

	return (
		<div ref={setNodeRef} style={outerStyle} {...attributes} {...listeners}>
			<span role="button">{label}</span>
		</div>
	);
};

/* -------------------- */
/* Tabs Container       */
/* -------------------- */

export const Tabs: React.FC = () => {
	const [activeId, setActiveId] = useState<number | null>(null);
	const [items, setItems] = useState<number[]>(
		Array.from({ length: 5 }, (_, index) => index + 1)
	);

	/* Dnd */
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		if (active) {
			setActiveId(Number(active.id));
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.indexOf(Number(active.id));
				const newIndex = items.indexOf(Number(over.id));
				return arrayMove(items, oldIndex, newIndex);
			})
		}
	};

	/* Styles */
	const outerStyle: React.CSSProperties = {
		height: '48px',
		backgroundColor: 'black',
		borderBottom: '2px solid grey',
	};

	const innerStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		columnGap: '0.5rem',
		height: '100%',
		color: 'white',
		padding: '0 0.5rem',
	};

	return (
		<div style={outerStyle}>
			<div style={innerStyle}>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
					modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
				>
					<SortableContext items={items} strategy={horizontalListSortingStrategy}>
						{items.map((id) => (<Tab key={String(id)} id={id} label={`Tab ${id}`}/> ))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
};