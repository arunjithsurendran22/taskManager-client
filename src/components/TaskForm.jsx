import React, { useState, useRef, useEffect } from "react";
import api from "../Authorization/api";
import { IoMdCloseCircle } from "react-icons/io";

const TaskForm = ({ onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input box when the component is mounted
    inputRef.current.focus();
  }, []);

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/create", {
        taskName,
        taskDescription,
      });

      console.log(response.data);

      if (response.status === 201) {
        const newTask = response.data;
        if (newTask.status === "inprogress") {
          setTaskName("");
          setTaskDescription("");
          onClose(); // Close the modal
        } else {
          throw new Error("Failed to add task");
        }
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full md:max-w-md relative mx-10">
        <button
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <IoMdCloseCircle className="w-6 h-6 fill-current" />
        </button>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="text"
              id="taskName"
              value={taskName}
              onChange={handleTaskNameChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 mt-7 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter Task Name"
            />
          </div>
          <div>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={handleTaskDescriptionChange}
              className="block w-full h-40 border border-gray-300 rounded-md py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter Task Description"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
