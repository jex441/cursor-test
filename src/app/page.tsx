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
			className="flex items-center p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-sm"
		>
			<div
				{...listeners}
				className="cursor-move px-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
			>
				⋮⋮
			</div>
			<div className="flex flex-1 items-center gap-3 ml-2">
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={() => onToggle(todo.id)}
					className="w-4 h-4 accent-blue-500 dark:accent-blue-400"
				/>
				<span
					className={
						todo.completed
							? "line-through text-gray-500 dark:text-gray-400"
							: "dark:text-gray-200"
					}
				>
					{todo.text}
				</span>
			</div>
			<button
				onClick={() => onDelete(todo.id)}
				className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
				aria-label="Delete todo"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M3 6h18"></path>
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
				</svg>
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
		<div className="flex flex-col items-center justify-start p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
			<h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
				Todo List
			</h1>

			<form onSubmit={addTodo} className="w-full max-w-md mb-8">
				<div className="flex gap-2">
					<input
						type="text"
						value={newTodo}
						onChange={(e) => setNewTodo(e.target.value)}
						placeholder="Add a new todo..."
						className="flex-1 p-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
					/>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
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
