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
	activeId: number | null;
	clickedId: number | null;
	setClickedId: React.Dispatch<React.SetStateAction<number | null>>;
}

const Tab: React.FC<TabProps> = ({ id, label, activeId, clickedId, setClickedId }: TabProps) => {
	/* Dnd */
	const {
		attributes,
	  listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id, transition: { duration: 250, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }})

	/* Styles */
	const parentStyle: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		backgroundColor: clickedId === id ? '#202020' : '#333',
		border: `1px solid ${clickedId === id ? 'rgb(219 11 209)' : '#333' }`,
		borderRadius: '0.25rem',
		zIndex: activeId === id ? '20' : '1',
	};

	const outerStyle: React.CSSProperties = {
		padding: '0.25rem 1rem',
		fontSize: '0.8rem',
	};

	/* Click */
	const handleClick = () => {
		console.log(`clicked tab ${id}`);
		setClickedId(id);
	};

	return (
		<div ref={setNodeRef} style={parentStyle} {...attributes} {...listeners}>
			<div style={outerStyle} onClick={handleClick}>
				<span role="button">{label}</span>
			</div>
		</div>
	);
};

/* -------------------- */
/* Tabs Container       */
/* -------------------- */

export const Tabs: React.FC = () => {
	const [activeId, setActiveId] = useState<number | null>(null);
	const [clickedId, setClickedId] = useState<number | null>(null);
	const [items, setItems] = useState<number[]>(
		Array.from({ length: 3 }, (_, index) => index + 1)
	);

	/* Dnd */
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 4,
			},
		}),
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
						{items.map((id) => (
							<Tab
								key={String(id)}
								id={id}
								label={`Tab ${id}`}
								activeId={activeId}
								setClickedId={setClickedId}
								clickedId={clickedId}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
};
