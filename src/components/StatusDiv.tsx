"use client";

import { IListStructure } from "@/types/ListTypes";
import React, { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { HiOutlineDotsVertical } from "react-icons/hi";
import styles from "./styles.module.css";
import { LocalStorageService } from "@/utils/LocalStorageService";
import TodoFormModal from "./TodoFormModal";
import Overlay from "./Overlay";
import { formatToLongDate } from "@/utils/Formatters";

interface Props {
  data: IListStructure[];
  status: string;
  refreshTodoList: () => void;
}

const StatusDiv = ({ status, data, refreshTodoList }: Props) => {
  const [isPopupOpen, setIsPopupOpen] = useState<Record<string, boolean>>({});
  const [todoItemId, setTodoItemId] = useState<string | number>("");
  const [modalOpen, setModalOpen] = useState(false);

  const handlePopUpToggle = (index: number) => {
    setIsPopupOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const updateTodo = (id: string | number) => {
    setTodoItemId(id);
    setModalOpen(true);
  };

  const updateStatus = (id: string | number) => {
    try {
      const lists = LocalStorageService.get<IListStructure[]>();
      const updatedLists = lists?.map((list) => {
        if (list.id === id) {
          return { ...list, completed: !list.completed };
        }
        return list;
      });
      refreshTodoList();
      LocalStorageService.set(updatedLists);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = (id: string | number) => {
    try {
      const lists = LocalStorageService.get<IListStructure[]>() || [];
      const updatedLists = lists.filter((list) => list.id !== id);
      LocalStorageService.set(updatedLists);
      refreshTodoList();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <p className="pb-2">{status}</p>
      <div className="border border-theme-blue rounded-md px-2 bg-[#e8e8e8]">
        {data.length > 0 ? (
          data?.map((list, index) => (
            <ul key={index} className="p-2 bg-white my-3 relative">
              <span
                className="absolute right-[5px] top-[10px] cursor-pointer"
                onClick={() => handlePopUpToggle(index)}
              >
                <HiOutlineDotsVertical />
              </span>
              {isPopupOpen[index] ? (
                <div
                  className={`bg-white p-2 absolute z-[1] top-[25px] -right-[5px] shadow-md flex flex-col ${styles.list_popup}`}
                  onClick={() => handlePopUpToggle(index)}
                >
                  <span onClick={() => updateTodo(list.id)}>Edit</span>
                  {!list.completed ? (
                    <span onClick={() => updateStatus(list.id)}>
                      Mark as done
                    </span>
                  ) : (
                    <span onClick={() => updateStatus(list.id)}>
                      Unmark as done
                    </span>
                  )}
                  <span onClick={() => handleDelete(list.id)}>Delete</span>
                </div>
              ) : (
                <></>
              )}
              <li>
                <p className="font-semibold">{list.name}</p>
                <span>{list.description || "Nil"}</span>
                <br />
                <span className="flex gap-[5px] items-center">
                  <SlCalender />
                  <span className="font-semibold">
                    {formatToLongDate(list.date)}
                  </span>
                </span>
                <ul>
                  {list.has_subtask ? (
                    list.subTasks?.map((list, index) => (
                      <li key={index} className="list-disc ml-5">
                        {list}
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
                {
                  list.category && 
                  <span className="pt-4 text-[14px] text-theme-orange">
                    #{list.category}
                  </span>
                }
              </li>
            </ul>
          ))
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            No list found
          </div>
        )}
      </div>

      <Overlay isOpen={modalOpen}>
        <TodoFormModal
          setModalOpen={setModalOpen}
          todoItemId={todoItemId}
          edit={true}
          refreshTodoList={refreshTodoList}
        />
      </Overlay>
    </div>
  );
};

export default StatusDiv;