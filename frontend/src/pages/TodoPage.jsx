import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from "../redux/todoSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, Edit, CheckCircle, Circle } from "lucide-react";

const TodoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const username = useSelector((state) => state.auth.user?.username || "User");
  const todos = useSelector((state) => state.todos.items);
  const loading = useSelector((state) => state.todos.loading);
  const error = useSelector((state) => state.todos.error);
  const token = useSelector((state) => state.auth.token);

  // Fetch todos when component mounts or when token changes
  useEffect(() => {
    if (token) {
      dispatch(fetchTodos());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleAddOrUpdate = async () => {
    if (!input.trim()) return toast.error("Todo cannot be empty");

    try {
      if (isEditing) {
        const resultAction = await dispatch(
          updateTodo({ id: editId, text: input })
        );

        if (updateTodo.fulfilled.match(resultAction)) {
          toast.success("Todo updated");
        } else {
          toast.error("Failed to update todo");
        }

        setIsEditing(false);
        setEditId(null);
      } else {
        const resultAction = await dispatch(addTodo(input));

        if (addTodo.fulfilled.match(resultAction)) {
          toast.success("Todo added");
        } else {
          toast.error("Failed to add todo");
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setInput("");
  };

  const handleEdit = (todo) => {
    setInput(todo.text);
    setIsEditing(true);
    setEditId(todo._id);
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id)); // Dispatch deleteTodo action
    toast.success("Todo deleted");
  };

  const handleToggle = (id) => {
    dispatch(toggleTodo(id)); // Dispatch toggleTodo action
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
            Welcome, {username}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-3">
            {isEditing ? "Edit your todo" : "Add a new todo"}
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAddOrUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition shadow-md"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
              Loading todos...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 dark:text-red-400 text-lg">
              Error: {error}
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
              No todos yet. Let's get started 🚀
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggle(todo._id)}>
                    {todo.completed ? (
                      <CheckCircle className="text-green-600" />
                    ) : (
                      <Circle className="text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`${
                      todo.completed ? "line-through text-gray-500" : ""
                    } text-lg dark:text-white`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(todo)}>
                    <Edit className="text-blue-600 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(todo._id)}>
                    <Trash2 className="text-red-600 hover:text-red-700" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
