const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.use(auth); // all /api/tasks require JWT

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
