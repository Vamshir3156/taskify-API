const Task = require("../models/Task");

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(tasks);
  } catch (err) {
    console.error("getTasks error:", err);
    return res.status(500).send("Server Error");
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description = "" } = req.body;
    if (!title) return res.status(400).json({ msg: "Title is required" });

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).send("Server Error");
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    return res.json(task);
  } catch (err) {
    console.error("getTaskById error:", err);
    return res.status(500).send("Server Error");
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    const fields = { title: req.body.title, description: req.body.description };
    task = await Task.findByIdAndUpdate(req.params.id, fields, { new: true });

    return res.json(task);
  } catch (err) {
    console.error("updateTask error:", err);
    return res.status(500).send("Server Error");
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await Task.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Task removed" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).send("Server Error");
  }
};
