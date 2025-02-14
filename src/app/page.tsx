"use client";
import { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Todo {
	id: string;
	text: string;
	completed: boolean;
}

function SortableItem({
	todo,
	onToggle,
	onDelete,
}: {
	todo: Todo;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: todo.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<li
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex justify-between items-center p-3 bg-white border rounded shadow-sm cursor-move"
		>
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={() => onToggle(todo.id)}
					className="w-4 h-4"
				/>
				<span
					{...listeners}
					className={todo.completed ? "line-through text-gray-500" : ""}
				>
					{todo.text}
				</span>
			</div>
			<button
				onClick={() => onDelete(todo.id)}
				className="px-2 py-1 text-red-500 hover:text-red-700"
			>
				Delete
			</button>
		</li>
	);
}

export default function Home() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodo, setNewTodo] = useState("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTodo.trim()) {
			setTodos([
				...todos,
				{
					id: Date.now().toString(),
					text: newTodo.trim(),
					completed: false,
				},
			]);
			setNewTodo("");
		}
	};

	const deleteTodo = (id: string) => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const toggleTodo = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setTodos((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<div className="flex flex-col items-center justify-start p-8 min-h-screen">
			<h1 className="text-4xl font-bold mb-8">Todo List</h1>

			<form onSubmit={addTodo} className="w-full max-w-md mb-8">
				<div className="flex gap-2">
					<input
						type="text"
						value={newTodo}
						onChange={(e) => setNewTodo(e.target.value)}
						placeholder="Add a new todo..."
						className="flex-1 p-2 border rounded"
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Add
					</button>
				</div>
			</form>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={todos} strategy={verticalListSortingStrategy}>
					<ul className="w-full max-w-md space-y-2">
						{todos.map((todo) => (
							<SortableItem
								key={todo.id}
								todo={todo}
								onToggle={toggleTodo}
								onDelete={deleteTodo}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
}
