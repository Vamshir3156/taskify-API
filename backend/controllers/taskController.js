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
    const { title, description = "", status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      status: status || "pending",
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
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    return res.json(task);
  } catch (err) {
    console.error("getTaskById error:", err);
    return res.status(500).send("Server Error");
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ msg: "Task not found" });
    if (existing.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const allowed = ["title", "description", "status"];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        update[key] =
          key === "title" && typeof req.body[key] === "string"
            ? req.body[key].trim()
            : req.body[key];
      }
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json(updated);
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
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Task removed" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).send("Server Error");
  }
};
