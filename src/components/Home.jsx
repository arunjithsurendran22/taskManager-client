import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import UpdateForm from "./UpdateForm";
import Navbar from "./Navbar";
import api from "../Authorization/api";
import { MdDeleteOutline, MdEdit } from "react-icons/md";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/get");
      if (response.status === 200) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isModalOpen, editTaskId]);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Task added:", formData);
    setIsModalOpen(false);
    fetchTasks();
  };

  const toggleDescription = (index, event) => {
    // Check if the clicked element is the checkbox
    if (event.target.type !== "checkbox") {
      const updatedTasks = [...tasks];
      updatedTasks[index].showDescription =
        !updatedTasks[index].showDescription;
      setTasks(updatedTasks);
    }
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId); // Set the ID of the task being edited
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/delete/${taskId}`);
      if (response.status === 200) {
        const updatedTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleStatusChange = async (id, checked) => {
    try {
      // Toggle the status between "completed" and "inprogress"
      const newStatus = checked ? "completed" : "inprogress";

      // Update the task status and fetch updated tasks
      const response = await api.put(`/update-status/${id}/${newStatus}`);
      if (response.status === 200) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  useEffect(() => {
    // This effect will run whenever the tasks state changes
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  return (
    <div className="bg-gray-100 min-h-screen ">
      <Navbar />
      <div className="container mx-auto py-8 px-5">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddTask}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:shadow-outline mr-4 transition duration-300"
          >
            Add Task
          </button>

          {isModalOpen && (
            <TaskForm onSubmit={handleFormSubmit} onClose={handleCloseModal} />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks found.</p>
          ) : (
            <ul>
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`bg-white shadow-md rounded-md p-4 mb-4 cursor-pointer hover:shadow-lg transition duration-300 ${
                    task.showDescription ? "border border-gray-300" : ""
                  }`}
                  onClick={(event) => toggleDescription(index, event)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          task.status === "completed" ? "line-through" : ""
                        }`}
                      >
                        {task.name}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-2">
                        <input
                          type="checkbox"
                          className="form-checkbox text-blue-500 h-5 w-5"
                          checked={task.status === "completed"}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.checked)
                          }
                        />
                        <span className="ml-2 text-gray-700">
                          {task.status}
                        </span>
                      </label>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task._id, task.name);
                        }}
                        className=" hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:shadow-outline mr-2 transition duration-300 text-black"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task._id);
                        }}
                        className=" hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:shadow-outline transition duration-300 text-black"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </div>
                  {task.showDescription && (
                    <p className="bg-gray-100 px-5">{task.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {editTaskId && (
          <UpdateForm taskId={editTaskId} onClose={() => setEditTaskId(null)} />
        )}
      </div>
    </div>
  );
};

export default Home;
