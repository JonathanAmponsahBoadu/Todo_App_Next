"use client";

// import "./page.css";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TodoHome() {
  const [blur, setblur] = useState(false);
  const [userId, setUserId] = useState<string>("");
  type Task = {
    id: number;
    task_name: string;
    type: string;
    date: string;
    iscompleted: boolean;
    user_id: string;
  };

  const [Objects, setObjects] = useState<Task[]>([]);
  const Diag = useRef<HTMLDialogElement>(null);
  const taskField = useRef<HTMLInputElement>(null);
  const typeField = useRef<HTMLInputElement>(null);
  const dateField = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const getUserId = () => {
    let user_id = localStorage.getItem("user_id");
    if (!user_id) {
      user_id = uuidv4();
      localStorage.setItem("user_id", user_id);
    }
    return user_id;
  };

  useEffect(() => {
    const user_id = getUserId();
    setUserId(user_id);
    const fetchTasks = async () => {
      const response = await fetch(`/api/tasks?user_id=${userId}`);
      const data = await response.json();
      setObjects(data.Tasks || []);
    };
    fetchTasks();
  }, [userId]);

  const toggleDiag = () => {
    if (Diag.current) {
      if (Diag.current.open) {
        Diag.current.close();
        setblur(false);
      } else {
        Diag.current.show();
        setblur(true);
        if (dateField.current) {
          dateField.current.value = today;
        }
      }
    }
  };

  const closeDiag = () => {
    if (Diag.current) {
      if (taskField.current && typeField.current && dateField.current) {
        taskField.current.value = "";
        typeField.current.value = "";
        dateField.current.value = "";
        Diag.current.close();
      }
    }
  };

  const HandleDone = async () => {
    if (
      taskField.current &&
      typeField.current &&
      dateField.current &&
      Diag.current
    ) {
      if (taskField.current.value.trim() == "") {
        alert("Enter a task please");
      } else {
        const task = taskField.current.value.trim();
        const type = typeField.current.value.trim();
        const date = dateField.current.value.toString().split("T")[0];
        const newTask = {
          task_name: task,
          task_type: type,
          date: date,
          user_id: userId,
        };
        try {
          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
          });
          if (response.ok) {
            const data = await response.json();
            setObjects((prev) => [...prev, data.Task]);
            taskField.current.value = "";
            typeField.current.value = "";
            dateField.current.value = "";
            Diag.current.close();
          } else {
            alert("Task not added");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const HandleComplete = async (index: number) => {
    const task = Objects[index];
    if (!task) {
      console.error("Task not found");
      return;
    }
    try {
      const updatedValue = { id: task.id, iscompleted: !task.iscompleted };
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValue),
      });
      if (response.ok) {
        const data = await response.json();
        setObjects((prev) =>
          prev.map((taskItem) =>
            taskItem.id === data.Task.id
              ? { ...taskItem, ...data.Task }
              : taskItem
          )
        );
      } else {
        alert("Failed to update task");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const HandleDelete = async (index: number) => {
    const task = Objects[index];

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({ id: task.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setObjects((prev) =>
          prev.filter((taskItem) => taskItem.id !== data.Task.id)
        );
      } else {
        alert("Unable to delete task");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <div
        className="Header w-full h-[20vh] bg-gradient-to-r from-[#0c6139] to-[#15ad66] flex - flex-col items-end relative
    "
      >
        <div className="Header_info p-2 flex gap-2 mr-5">
          <Image
            src="/Check.png"
            alt="Check button"
            width={30}
            height={30}
            className="bg-white p-[0.5px] rounded-full "
          ></Image>
          <h1 className="Header_text text-white font-bold text-[20px]">
            To Do List
          </h1>
        </div>
        <p className="Header_subinfo text-white mr-2">
          Plan your tasks today
          <Image src="/Plan.png" alt="Plan_icon" width={10} height={10}></Image>
        </p>
      </div>
      <div className="Add_task flex flex-row gap-2 justify-center mt-2">
        <p className="Add_task_text font-semibold text-md pt-1">Add task</p>
        <button>
          <Image
            src="/Add.png"
            alt="Add_button "
            width={30}
            height={30}
            onClick={toggleDiag}
            className="hover:scale-120"
          ></Image>
        </button>
      </div>
      <form action="">
        <dialog
          ref={Diag}
          className=" fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              border-[#0c6139] border-2 
             rounded-t-[15px] rounded-b-[15px] shadow-2xl bg-white z-50"
        >
          <div className="dialog flex flex-col p-5   ">
            <input
              ref={taskField}
              type="text"
              placeholder="Enter task"
              className="p-2 border-[1px] border-solid  focus:border-green-400 rounded-l-[10px] rounded-r-[10px] mb-2 outline-none "
            />
            <input
              type="text"
              ref={typeField}
              placeholder="Task type"
              className="p-2 border-[1px] border-solid  focus:border-green-400 rounded-l-[10px] rounded-r-[10px] mb-2 outline-none "
            />
            <input
              type="date"
              min={today}
              ref={dateField}
              placeholder="Date"
              className="p-2 border-[1px] border-solid  focus:border-green-400 rounded-l-[10px] rounded-r-[10px] mb-2 outline-none "
            />
            <div className="flex gap-2">
              <button
                className=""
                type="button"
                onClick={() => {
                  HandleDone();
                  setblur(false);
                }}
              >
                <Image
                  src="/DoneBtn.png"
                  alt="Done Button"
                  width={20}
                  height={20}
                ></Image>
              </button>
              <button type="button">
                <Image
                  src="/cancelBtn.png"
                  alt="cancel Button"
                  width={25}
                  height={25}
                  onClick={() => {
                    closeDiag();
                    setblur(false);
                  }}
                ></Image>
              </button>
              <button type="reset">
                <Image
                  src="/refreshBtn.png"
                  alt="Refresh Button"
                  width={20}
                  height={20}
                  onClick={() => {
                    setblur(false);
                  }}
                ></Image>
              </button>
            </div>
          </div>
        </dialog>
      </form>

      <div className="relative">
        {Objects && Objects.length > 0 ? (
          Objects.map((Object, index) => (
            <ul key={index} className={`pl-5 pr-5 pt-1 ${blur && "blur-2xl"}`}>
              <li className="mb-5">
                <div className=" relative p-2 bg-gradient-to-r from-[#0c6139] to-[#15ad66] ">
                  <div className="flex flex-row items-center gap-1 ">
                    <div
                      className=" bg-white rounded-full w-[20px] h-[20px]"
                      onClick={() => {
                        HandleComplete(index);
                      }}
                    >
                      {Object["iscompleted"] && (
                        <Image
                          src="/DoneBtn.png"
                          alt="CompletedBtn"
                          width={20}
                          height={20}
                        ></Image>
                      )}
                    </div>

                    <div
                      className=" bg-white rounded-full w-[20px] h-[20px] absolute right-3"
                      onClick={() => HandleDelete(index)}
                    >
                      <Image
                        src="/deleteBtn.png"
                        alt="Deletebtn"
                        width={20}
                        height={20}
                      ></Image>
                    </div>

                    <div>
                      <p
                        className={`text-white p-1 ${
                          Object["iscompleted"] && "line-through"
                        }`}
                      >
                        {Object["task_name"]}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-white text-[10px] pl-[25px] ${
                      Object["iscompleted"] && " line-through"
                    } flex-col`}
                  >
                    {new Date(Object.date).toISOString().split("T")[0]}
                  </p>
                </div>
              </li>
            </ul>
          ))
        ) : (
          <Image
            src="/Mainspace.jpg"
            alt="No tasks"
            width={200}
            height={200}
            className="flex justify-center items-center w-full p-10 opacity-15"
          ></Image>
        )}

        <p className="Last_text  flex justify-center items-center absolute -bottom-10 translate-x-[50%]">
          Get it done, have some fun 🏋️‍♀️📚
        </p>
      </div>
      {/* <aside className="bg-white absolute top-0 left-0 h-full w-[50vw]">
        <div className="sidebar_top">
        <div className="User w-[30px] h-[30px] rounded-full bg-white absolute left-5 top-3 flex items-center justify-center border-2 border-[#0c6139]">
          <Image
            src="/dashboard.png"
            alt="dashboard_icon"
            width={20}
            height={20}
          ></Image>
        </div>
        <nav>
          <ul>
            <li>One Item</li>
          </ul>
        </nav>
      </aside> */}
    </section>
  );
}
