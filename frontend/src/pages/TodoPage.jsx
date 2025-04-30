import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from "../redux/todoSlice";
import toast from "react-hot-toast";
import { Trash2, Edit, CheckCircle, Circle, Plus } from "lucide-react"; // Import Plus icon
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination"; // Import Pagination component

const TodoPage = () => {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(5); // Number of todos to show per page

  const todos = useSelector((state) => state.todos.items);
  const loading = useSelector((state) => state.todos.loading);
  const error = useSelector((state) => state.todos.error);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos());
    }
  }, [dispatch, token]);

  const handleAddOrUpdate = async () => {
    if (!input.trim()) {
      toast.error("Todo cannot be empty");
      return;
    }

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
      console.error("Error:", error);
      toast.error("Something went wrong");
    }

    setInput("");
  };

  const handleEdit = (todo) => {
    setInput(todo.text);
    setIsEditing(true);
    setEditId(todo._id);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTodo(id));
      toast.success("Todo deleted");
    } catch {
      toast.error("Failed to delete todo");
    }
  };

  const handleToggle = async (id) => {
    try {
      await dispatch(toggleTodo(id));
    } catch {
      toast.error("Failed to toggle todo");
    }
  };

  // Pagination Logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar /> {/* Navbar stays */}
      <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-700 flex items-center justify-center overflow-hidden">
        <div className="max-w-3xl mx-auto w-full bg-gray-800 rounded-lg shadow-xl p-6 overflow-hidden -mt-13 pb-3">
          {/* Add / Edit Todo */}
          <div className="bg-gray-700 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              {isEditing ? "Edit your todo" : "Add a new todo"}
            </h2>
            <div className="flex items-center gap-4">
              {/* Input Field with Icon */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-grow pl-10 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400" />
              </div>
              <button
                onClick={handleAddOrUpdate}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-lg font-medium transition shadow-md "
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-4 overflow-hidden">
            {loading ? (
              <div className="text-center text-gray-500 text-lg">
                Loading todos...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 text-lg">
                Error: {error}
              </div>
            ) : currentTodos.length === 0 ? (
              <div className="text-center text-gray-500 text-lg">
                No todos yet. Let&apos;s get started 🚀
              </div>
            ) : (
              currentTodos.map((todo) => (
                <div
                  key={todo._id}
                  className="flex justify-between items-center p-4 rounded-lg shadow-md bg-gray-700 border border-gray-600 hover:scale-[1.01] transition-transform"
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
                      } text-lg text-white`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(todo)}>
                      <Edit className="text-teal-400 hover:text-teal-500" />
                    </button>
                    <button onClick={() => handleDelete(todo._id)}>
                      <Trash2 className="text-red-600 hover:text-red-700" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Component */}
          <Pagination
            todosPerPage={todosPerPage}
            totalTodos={todos.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </>
  );
};

export default TodoPage;
