import React, { use, useEffect, useState, useRef } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import { MdModeEdit, MdDelete } from "react-icons/md";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const serverUrl = import.meta.env.VITE_server_url;

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [toggleList, setToggleList] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
  const [editTask, setEditTask] = useState({
    id: "",
    task: "",
    status: "pending",
  });
  const navigate = useNavigate();
  const taskNum = useRef(0);
  useEffect(() => {
    // let subscribed = true;
    const fetchDetails = async () => {
      try {
        const trelloToken = Cookies.get("trelloToken");

        const response = await fetch(`${serverUrl}/details`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${trelloToken}`,
          },
        });
        if (response.ok) {
          console.log("dfjfjdddd");

          const data = await response.json();
          const { tasks, ...rest } = data;
          setUserData(rest);
          setTasks(tasks);
          if (!data.verified) {
            navigate("/verify", {});
          } else {
            console.log("dfjfj");
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.error("Error fetching user details:", e);
      }
    };
    fetchDetails();
    return () => {
      //   subscribed = false;
    };
  }, []);
  const AddNewTask = async () => {
    try {
      const trelloToken = Cookies.get("trelloToken");
      const response = await fetch(`${serverUrl}/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trelloToken}`,
        },
        body: JSON.stringify({ task }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("task Added successfully");
        setTasks((prev) => {
          return [...prev, { task, id: data.id, status: "pending" }];
        });
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onChangeEditTask = (e) => {
    setEditTask((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const EditTask = async () => {
    try {
      const trelloToken = Cookies.get("trelloToken");
      const response = await fetch(`${serverUrl}/editTask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trelloToken}`,
        },
        body: JSON.stringify(editTask),
      });
      if (response.ok) {
        const data = await response.json();
        const newTask = [...tasks];
        newTask.splice(taskNum.current, 1, editTask);
        setShowEditTaskPopup(false);
        setTasks(newTask);
        console.log(data);
        toast.success("task updated successfully");
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const DeleteTask = async (index) => {
    try {
      const trelloToken = Cookies.get("trelloToken");
      const response = await fetch(`${serverUrl}/deleteTask`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${trelloToken}`,
        },
        body: JSON.stringify({ id: tasks[index].id }),
      });
      if (response.ok) {
        const data = await response.json();
        const newTask = [...tasks];
        newTask.splice(index, 1);
        setShowEditTaskPopup(false);
        setTasks(newTask);
        console.log(data);
        toast.success("task deleted successfully");
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        {/* <p>ddd</p> */}
        <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center bg-[#CD5A91] w-full h-screen">
      <button
        className="bg-green-400 fixed top-2 right-5 w-20 h-8 rounded-md text-white cursor-pointer hover:bg-green-600"
        onClick={() => {
          Cookies.remove("trelloToken");
          navigate("/login", { replace: true });
        }}
      >
        Log Out
      </button>
      <ToastContainer />
      <Popup
        onClose={() => {
          setShowEditTaskPopup(false);
        }}
        open={showEditTaskPopup}
        closeOnDocumentClick
        contentStyle={{
          height: "230px",
          width: "350px",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <div className="">
          <div className="flex flex-col mb-2">
            <label>task</label>
            <input
              value={editTask.task}
              className="border-1 border-gray-400 pl-2"
              onChange={onChangeEditTask}
              name="task"
            />
          </div>
          <div className="flex flex-col mb-2">
            <label>status</label>
            <select
              className="border-1 border-gray-400 pl-2 rounded-sm"
              defaultValue={editTask.status}
              onChange={onChangeEditTask}
              name="status"
            >
              {["pending", "inprogress", "complete"].map((item, index) => {
                return (
                  <option value={item} key={index}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            className="bg-blue-600 p-2 rounded-sm w-16 text-white hover:bg-blue-800 cursor-pointer"
            onClick={EditTask}
          >
            Save
          </button>
        </div>
      </Popup>
      <h1 className="text-4xl mb-4">Hi {userData.name}</h1>
      <div>
        <h1 className="text-4xl mb-4">Your tasks</h1>
        <div>
          {tasks.map((task, index) => {
            return (
              <div
                className="bg-white text-black p-3 max-w-80 sm:max-w-100 rounded-xl flex justify-between relative pt-4 mb-3 "
                key={task.id}
              >
                <button
                  className="absolute right-6 top-1 cursor-pointer"
                  onClick={() => {
                    setShowEditTaskPopup(true);

                    setEditTask({
                      task: task.task,
                      status: task.status,
                      id: task.id,
                    });
                    taskNum.current = index;
                  }}
                >
                  <MdModeEdit />
                </button>
                <button
                  className="absolute right-2 top-1 cursor-pointer"
                  onClick={() => {
                    DeleteTask(index);
                  }}
                >
                  <MdDelete />
                </button>

                <h1
                  key={index}
                  className="w-[60%]  text-2xl overflow-x-auto custom-scrollbar"
                >
                  {task.task}
                </h1>
                <p className="w-[30%]">{task.status}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {!toggleList && (
          <div
            className="flex mt-3 text-white items-center bg-[#D77BA7] p-3 max-w-80 sm:max-w-100 rounded-xl cursor-pointer"
            onClick={() => {
              setToggleList((prev) => !prev);
            }}
          >
            <div className="mr-3">
              <FaPlus />
            </div>
            <h1 className="">Create new task</h1>
          </div>
        )}
        {toggleList && (
          <div className="flex flex-col mt-3 bg-white p-3 max-w-80 sm:max-w-100 rounded-xl">
            <input
              placeholder="Enter a task"
              className="w-full border-1 border-gray-400 rounded-sm h-8 pl-2"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
              }}
            />
            <div className="mt-3 flex items-center">
              <button
                className="bg-[#0c66e4] text-white rounded-sm p-1.5 cursor-pointer"
                onClick={() => {
                  // setTask()
                  AddNewTask();
                  setTask("");
                }}
              >
                Add Task
              </button>
              <button
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setToggleList(false);
                  setTask("");
                }}
              >
                <RxCross1 size="20" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
