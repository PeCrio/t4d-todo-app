"use client";

import { IListStructure } from "@/types/ListTypes";
import React, { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LocalStorageService } from "@/utils/LocalStorageService";
import TodoFormModal from "./TodoFormModal";
import Overlay from "./Overlay";
import { formatToLongDate } from "@/utils/Formatters";
import { toast } from "react-toastify";

interface Props {
  data: IListStructure[];
  status: string;
  refreshTodoList: () => void;
}

const StatusDiv = ({ status, data, refreshTodoList }: Props) => {
  const [isPopupOpen, setIsPopupOpen] = useState<Record<string, boolean>>({});
  const [todoItemId, setTodoItemId] = useState<string | number>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add');

  const handlePopUpToggle = (index: number) => {
    setIsPopupOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const updateTodo = (id: string | number) => {
    setMode('edit');
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
      toast.error((err as Error).message);
    }
  };

  const openDeleteModal = (id: string | number) => {
    setTodoItemId(id);
    setMode('delete');
    setModalOpen(true);
  }

  return (
    <div>
      <p className="pb-2">{status}</p>
      <div className="border border-theme-blue rounded-md px-2 bg-[#e8e8e8]">
        {data.length > 0 ? (
          data?.map((item, index) => (
            <ul key={index} className="p-2 pr-6 bg-white my-3 relative rounded-md">
              <span
                className="absolute right-[5px] top-[8px] cursor-pointer p-1 rounded-full hover:bg-gray-200 transition-all duration-300 ease-in-out"
                onClick={() => handlePopUpToggle(index)}
              >
                <HiOutlineDotsVertical />
              </span>
              {isPopupOpen[index] ? (
                <div
                  className={`bg-white rounded-md px-4 p-2 absolute z-[1] top-[35px] -right-[5px] shadow-md gap-[5px] flex flex-col list_popup`}
                  onClick={() => handlePopUpToggle(index)}
                >
                  <div className="cursor-pointer hover:text-[#f1884d] w-fit transition-all duration-300 ease-in-out" onClick={() => updateTodo(item.id)}>Edit</div>
                  {!item.completed ? (
                    <div className="w-full cursor-pointer hover:text-[#f1884d] transition-all duration-300 ease-in-out" onClick={() => updateStatus(item.id)}>
                      Mark as done
                    </div>
                  ) : (
                    <div className="w-fit cursor-pointer hover:text-[#f1884d] transition-all duration-300 ease-in-out" onClick={() => updateStatus(item.id)}>
                      Unmark as done
                    </div>
                  )}
                  <div className="w-fit cursor-pointer hover:text-[#f1884d] transition-all duration-300 ease-in-out" onClick={() => openDeleteModal(item.id)}>Delete</div>
                </div>
              ) : (
                <></>
              )}
              <li>
                <p className="font-semibold">{item.name}</p>
                <span>{item.description || "Nil"}</span>
                <br />
                <span className="flex gap-[5px] items-center">
                  <SlCalender />
                  <span className="font-semibold">
                    {formatToLongDate(item.date)}
                  </span>
                </span>
                <ul>
                  {item.has_subtask ? (
                    item.subTasks?.map((item, index) => (
                      <li key={index} className="list-disc ml-5">
                        {item}
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
                {
                  item.tag && 
                  <span className="pt-4 text-[14px] text-theme-orange">
                    #{item.tag}
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
          refreshTodoList={refreshTodoList}
          mode={mode}
          setMode={setMode}
        />
      </Overlay>
    </div>
  );
};

export default StatusDiv;