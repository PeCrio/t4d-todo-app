"use client";

import { IListStructure } from "@/types/ListTypes";
import { useRef, useState } from "react";
import { LocalStorageService } from "@/utils/LocalStorageService";
import TodoFormModal from "./TodoFormModal";
import { Overlay } from "./ui";

import { toast } from "react-toastify";
import DraggableListItem from "./DraggableListItem";
import { useDrop } from "react-dnd";

interface Props {
  data: IListStructure[];
  status: string;
  completed: boolean;
  refreshTodoList: () => void;
  handleTaskDrag: (id: string | number) => void;
  modalOpen?: boolean;
}

const StatusDiv = ({ status, completed, data, refreshTodoList, handleTaskDrag }: Props) => {
  const [isPopupOpen, setIsPopupOpen] = useState<Record<string, boolean>>({});
  const [todoItemId, setTodoItemId] = useState<string | number>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add');
  
    const itemRef = useRef<HTMLDivElement>(null);
  
   const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "TODO_ITEM",
    drop: (draggedItem: { id: string | number; completed: boolean }) => {
      if (draggedItem.completed !== completed) {
        handleTaskDrag(draggedItem.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [status]);

  dropRef(itemRef);

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
      <div ref={itemRef} className={`border border-theme-blue rounded-md px-2 pb-6 ${isOver ? 'bg-blue-100' : 'bg-[#e8e8e8]'}`}>
        {data.length > 0 ? (
          data?.map((item, index) => (
            <DraggableListItem
              key={item.id}
              item={item}
              index={index}
              completed={completed}
              isPopupOpen={isPopupOpen[index]}
              handlePopUpToggle={handlePopUpToggle}
              updateTodo={updateTodo}
              updateStatus={updateStatus}
              openDeleteModal={openDeleteModal}
            />
          ))
        ) : (
          <div className="pt-12 pb-10 flex items-center justify-center text-lg">
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
          modalOpen={modalOpen}
        />
      </Overlay>
    </div>
  );
};

export default StatusDiv;