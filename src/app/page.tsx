"use client";
import { useState } from "react";

interface Todo {
	text: string;
	completed: boolean;
}

export default function Home() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodo, setNewTodo] = useState("");

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTodo.trim()) {
			setTodos([...todos, { text: newTodo.trim(), completed: false }]);
			setNewTodo("");
		}
	};

	const deleteTodo = (index: number) => {
		setTodos(todos.filter((_, i) => i !== index));
	};

	const toggleTodo = (index: number) => {
		setTodos(
			todos.map((todo, i) =>
				i === index ? { ...todo, completed: !todo.completed } : todo
			)
		);
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

			<ul className="w-full max-w-md space-y-2">
				{todos.map((todo, index) => (
					<li
						key={index}
						className="flex justify-between items-center p-3 bg-white border rounded shadow-sm"
					>
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								checked={todo.completed}
								onChange={() => toggleTodo(index)}
								className="w-4 h-4"
							/>
							<span
								className={todo.completed ? "line-through text-gray-500" : ""}
							>
								{todo.text}
							</span>
						</div>
						<button
							onClick={() => deleteTodo(index)}
							className="px-2 py-1 text-red-500 hover:text-red-700"
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
