import Todo from "../models/Todo.js";

// Create a new Todo
export const createTodo = async (req, res) => {
  try {
    const todo = new Todo({ userId: req.userId, text: req.body.text });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Create Todo Error:", err);
    res.status(500).json({ error: "Could not create todo" });
  }
};

// Get all Todos for the authenticated user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }); // req.userId must be set by middleware
    res.json(todos);
  } catch (err) {
    console.error("Get Todos Error:", err);
    res.status(500).json({ error: "Could not fetch todos" });
  }
};

// Update a Todo
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { text: req.body.text },
      { new: true }
    );

    if (!todo) {
      return res
        .status(404)
        .json({ error: "Todo not found or not authorized" });
    }

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update todo" });
  }
};

// controllers/todoController.js

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the deleteTodo function if it's not already
