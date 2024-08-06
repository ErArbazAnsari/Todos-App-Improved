import React, { useState, useEffect } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import "./todos.css";

function Todos() {
    // Today Date & Time
    const date = new Date();
    const [todayDate, setTodayDate] = useState(date.toDateString());
    const [currentTime, setCurrentTime] = useState(date.toLocaleTimeString());

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Update date every day
    useEffect(() => {
        const interval = setInterval(() => {
            setTodayDate(new Date().toDateString());
        }, 86400000); // Update every day

        return () => clearInterval(interval);
    }, []);

    // Retrieve todos from local storage
    const getStoredTodos = () => {
        const storedTodos = localStorage.getItem("todos");
        return storedTodos ? JSON.parse(storedTodos) : [];
    };

    // Todos Input Section
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState(getStoredTodos());
    const [message, setMessage] = useState(""); // Message state for showing alerts

    // Save todos to local storage
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    // Function to handle adding new todo
    const handleAddTodo = () => {
        if (inputValue) {
            // Check if the todo already exists
            const todoExists = todos.some(
                (todo) => todo.text.toLowerCase() === inputValue.toLowerCase()
            );

            if (todoExists) {
                setMessage("Todo already present!");
            } else {
                setTodos([...todos, { text: inputValue, done: false }]);
                setInputValue("");
                setMessage(""); // Clear message
            }
        }
    };

    // Function to handle toggling the done state of a todo
    const handleTodoDone = (index) => {
        const updatedTodos = todos.map((todo, i) =>
            i === index ? { ...todo, done: !todo.done } : todo
        );
        setTodos(updatedTodos);
    };

    // Function to handle deleting a todo
    const handleTodoDelete = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    return (
        <div className="flex items-center justify-center p-10">
            <div
                className="p-8 rounded-lg shadow-lg w-full max-w-md text-white"
                style={{ backgroundColor: "#252b37" }}
            >
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold">myTodos App</h1>
                </header>

                {/* Todos Date & Time Section */}
                <div className="todos-date-time flex flex-col items-center gap-1 mb-5">
                    <h3 className="text-lg">{todayDate}</h3>
                    <h3 className="text-lg">{currentTime}</h3>
                </div>

                {/* Display message if any */}
                {message && <div className="text-red-500 mb-3">{message}</div>}

                {/* Todos Input Section */}
                <section className="form mb-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTodo();
                        }}
                        className="flex gap-2"
                    >
                        <input
                            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            type="text"
                            id="input-data"
                            placeholder="Add a new todo"
                            autoFocus
                            autoComplete="off"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Add
                        </button>
                    </form>
                </section>

                {/* Todos List Section */}
                <section className="todos-list mb-6">
                    {todos.length > 0 &&
                        todos.map((todo, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-100 rounded mb-2 shadow-sm"
                            >
                                <li
                                    className={`flex-1 text-left text-2xl ${
                                        todo.done
                                            ? "text-green-500 line-through"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {todo.text}
                                </li>
                                <span
                                    className={`cursor-pointer p-2 ${
                                        todo.done
                                            ? "text-green-500"
                                            : "text-gray-500"
                                    }`}
                                    onClick={() => handleTodoDone(index)}
                                >
                                    <FaRegCheckCircle />
                                </span>
                                <span
                                    className="cursor-pointer p-2 text-red-500"
                                    onClick={() => handleTodoDelete(index)}
                                >
                                    <MdOutlineDelete />
                                </span>
                            </div>
                        ))}
                </section>

                {/* Clear All Todos Button */}
                {todos.length > 0 && (
                    <button
                        className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                        onClick={() => {
                            setTodos([]);
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
}

export default Todos;
