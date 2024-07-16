import axios from "axios";
import React, { useEffect, useState } from "react";


function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("Incomplete"); // Default status to Incomplete
    const [newDeadline, setNewDeadline] = useState("");

    // Request Notification Permission
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Fetch tasks from database
    useEffect(() => {
        axios.get('http://127.0.0.1:3001/getTodoList')
            .then(result => {
                setTodoList(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    const showNotification = (title, body) => {
        new Notification(title, { body });
    };

    const scheduleNotification = (task, deadline) => {
        const now = new Date().getTime();
        const timeToDeadline = new Date(deadline).getTime() - now;
        const notificationTime = timeToDeadline - 5 * 60 * 1000; // 5 minutes before the deadline

        if (notificationTime > 0) {
            setTimeout(() => {
                showNotification(`Task Reminder`, `The task "${task}" is due in 5 minutes!`);
            }, notificationTime);
        }
    };

    // Function to toggle the editable state for a specific row
    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    // Function to add task to the database
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        const newTaskData = { task: newTask, status: newStatus, deadline: newDeadline };

        axios.post('http://127.0.0.1:3001/addTodoList', newTaskData)
            .then(res => {
                console.log(res);
                showNotification("Task Added", `You have added a new task: "${newTask}"`);
                scheduleNotification(newTask, newDeadline);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Function to save edited data to the database
    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        // If the fields are empty
        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        // Updating edited data to the database through updateById API
        axios.post('http://127.0.0.1:3001/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                showNotification("Task Updated", `The task "${editedTask}" has been updated.`);
                scheduleNotification(editedTask, editedDeadline);
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Function to mark task as completed
    const markAsCompleted = (id) => {
        const updatedStatus = "Completed";
        axios.post(`http://127.0.0.1:3001/updateTodoList/${id}`, { status: updatedStatus })
            .then(result => {
                console.log(result);
                showNotification("Task Completed", `The task has been marked as completed.`);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Delete task from database
    const deleteTask = (id) => {
        axios.delete('http://127.0.0.1:3001/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <h2 className="card-header text-center">Todo List</h2>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Task</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Actions</th>
                                        <th>Completed</th>
                                    </tr>
                                </thead>
                                {Array.isArray(todoList) ? (
                                    <tbody>
                                        {todoList.map((data) => (
                                            <tr key={data._id}>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editedTask}
                                                            onChange={(e) => setEditedTask(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.task
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <select
                                                            className="form-control"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value)}
                                                        >
                                                            <option value="Incomplete">Incomplete</option>
                                                            <option value="Complete">Complete</option>
                                                        </select>
                                                    ) : (
                                                        data.status
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="datetime-local"
                                                            className="form-control"
                                                            value={editedDeadline}
                                                            onChange={(e) => setEditedDeadline(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div className="btn-group" role="group">
                                                        {editableId === data._id ? (
                                                            <button className="btn btn-success btn-sm mr-2" onClick={() => saveEditedTask(data._id)}>
                                                                Save
                                                            </button>
                                                        ) : (
                                                            <button className="btn btn-primary btn-sm mr-2" onClick={() => toggleEditable(data._id)}>
                                                                Edit
                                                            </button>
                                                        )}
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteTask(data._id)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {data.status !== "Completed" && (
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input mt-3 custom-checkbox"
                                                            onChange={() => markAsCompleted(data._id)}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="5">Loading tasks...</td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <h2 className="card-header text-center">Add Task</h2>
                        <div className="card-body">
                            <form className="bg-light p-4">
                                <div className="mb-3">
                                    <label>Task</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Task"
                                        onChange={(e) => setNewTask(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Status</label>
                                    <select
                                        className="form-control"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        <option value="Incomplete">Incomplete</option>
                                        <option value="">Complete</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Deadline</label>
                                    <input
                                        className="form-control"
                                        type="datetime-local"
                                        onChange={(e) => setNewDeadline(e.target.value)}
                                    />
                                </div>
                                <button onClick={addTask} className="btn btn-success btn-block">
                                    Add Task
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;
