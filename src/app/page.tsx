"use client";

import { FiPlus } from "react-icons/fi";
import { dummyData } from "@/data/dummy-list";
import { useEffect, useState } from "react";
import { IListStructure } from "@/types/ListTypes";
import StatusDiv from "@/components/StatusDiv";
import AddTodoList from "@/components/AddTodoList";
import Overlay from "@/components/Overlay";
import { LocalStorageService } from "@/utils/LocalStorageService";
export default function Home() {
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [completed, setCompleted] = useState<IListStructure[]>([]);
  const [todo, setTodo] = useState<IListStructure[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const existing = LocalStorageService.get<IListStructure[]>();

    if (!existing || existing.length === 0) {
      setPageLoading(true);
      setTimeout(() => {
        LocalStorageService.set(dummyData);
        setPageLoading(false);
      }, 1200);
    }
  }, []);
  
  useEffect(()=>{
    setPageLoading(true);
    try{
      setTimeout(()=>{
        const locallySavedData = LocalStorageService.get<IListStructure[]>();
        if(locallySavedData){
          setCompleted(locallySavedData.filter((list)=> list.completed));
          setTodo(locallySavedData.filter((list)=> !list.completed));
        }
        setPageLoading(false);
      }, 1200)
    }catch(err){
      console.log(err)
    }
  },[modalOpen, statusUpdate])
  return (
    <div className="">
      <main className="py-4">
        <div className="flex justify-end">
          <div className="flex items-center cursor-pointer gap-[10px] bg-theme-blue text-white w-fit p-2 px-4 rounded-sm hover:scale-95" onClick={()=>setModalOpen(true)}>
            <span><FiPlus /></span>
            <span>Add New Task</span>
          </div>
        </div>
        <div className="flex items-center justify-between todo-task-div">
          <span>Today</span>
          <span>Pending</span>
          <span>All Tasks</span>
          <span>Past Due-Date</span>
        </div>
        <div>
          <p className="text-xl text-theme-blue font-semibold py-4">Todo Lists</p>
          {
            pageLoading ? 
            <div className="w-full relative h-[40vh]">
              <div className="loader w-full m-auto"></div>
            </div>
            :
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              <StatusDiv data={todo} status="Todo" setStatusUpdate={setStatusUpdate}/>
              <StatusDiv data={completed} status="Completed" setStatusUpdate={setStatusUpdate}/>
            </div>
          }
        </div>
      </main>
      <Overlay isOpen={modalOpen}>
        <AddTodoList setModalOpen={setModalOpen} />
      </Overlay>
    </div>
  );
}
