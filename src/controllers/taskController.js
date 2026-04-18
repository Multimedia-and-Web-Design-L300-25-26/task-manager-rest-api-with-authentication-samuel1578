import Task from "../models/Task.js";

// POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = new Task({
            title,
            description: description || "",
            completed: completed || false,
            owner: req.user._id,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        await task.deleteOne();
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ message: "Server error" });
    }
};