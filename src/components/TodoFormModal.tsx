"use client";

import { IListStructure } from '@/types/ListTypes';
import { LocalStorageService } from '@/utils/LocalStorageService';
import React, { useState, Dispatch, SetStateAction, useId, useEffect } from 'react';
import { MdOutlineCancel, MdAdd } from "react-icons/md";
import { FiMinus } from "react-icons/fi";
import { toast } from 'react-toastify';

interface TodoFormModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setMode: Dispatch<SetStateAction<"add" | "edit" | "delete">>;
  todoItemId?: string | number;
  refreshTodoList: () => void;
  mode: "add" | "edit" | "delete";
}

const TodoFormModal = ({ setModalOpen, todoItemId, refreshTodoList, mode }: TodoFormModalProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [subTaskLength, setSubTaskLength] = useState(1);

    const defaultFormState = {
        name: '',
        description: '',
        date: '',
        category: '',
        hasSubTasks: false,
        subTasks: [''],
    };

    const [form, setForm] = useState(defaultFormState);

    const { name, description, date, category, hasSubTasks, subTasks } = form

    const [isLoading, setIsLoading] = useState(false);

    const id = crypto.randomUUID();
    const domId = useId();

    useEffect(() => {
        const preExistingData = LocalStorageService.get<IListStructure[]>();

        if (todoItemId) {
            const currentTodoItem = preExistingData?.find(item => item.id === todoItemId);
            if (currentTodoItem) {
                const isoDateFormat = currentTodoItem ? new Date(currentTodoItem?.date).toISOString().split('T')[0] : ''
                setSubTaskLength(currentTodoItem?.subTasks?.length ?? 1);
                setForm(prev => ({ ...prev, name: currentTodoItem?.name, hasSubTasks: currentTodoItem?.has_subtask, subTasks: currentTodoItem?.subTasks ?? [''], description: currentTodoItem?.description, date: isoDateFormat, category: currentTodoItem?.category }));
            }
        }
    }, [todoItemId]);
    
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid) return;
        try{
            setIsLoading(true);
            const preExistingData = LocalStorageService.get<IListStructure[]>();
            const data = {
                name,
                description,
                date,
                category,
                has_subtask: hasSubTasks,
                completed: false,
                ...(hasSubTasks && { subTasks })
            };

            if (todoItemId) {
                const updatedList = (preExistingData || []).map(item =>
                  item.id === todoItemId
                    ? { ...item, ...data }
                    : item
                );
              
                LocalStorageService.set(updatedList);
                toast.success("Successfully updated a To-do item.");
            } else {
                const payload = {
                  ...data,
                  id
                };
              
                LocalStorageService.set([
                  ...(preExistingData || []),
                  payload,
                ]);  
                toast.success("Successfully added a To-do item.");
            }
            
            setModalOpen(false);
            setForm(defaultFormState);
            refreshTodoList();
        }catch(e){
            console.log(e)
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        const validSubTasks = form.subTasks.map((task)=> task.trim()).filter(Boolean)
        setIsFormValid((!form.hasSubTasks || validSubTasks.length > 1) && form.date !== '' && form.name.trim() !== '' ? true : false);
    },[form.name, form.date, form.hasSubTasks, form.subTasks])

    const addSubTasks = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newSubTasks = [...subTasks];
        newSubTasks[index] = event.target.value;
        setForm((prev) => ({...prev, subTasks: newSubTasks}))
    }

    const removeSubTask = (index: number) =>{
        subTasks.splice(index, 1)
        setSubTaskLength((prev)=>prev - 1);
    }
    
    const handleDelete = () => {
        if (todoItemId) {
            try {
              const lists = LocalStorageService.get<IListStructure[]>() || [];
              const updatedLists = lists.filter((list) => list.id !== todoItemId);
              LocalStorageService.set(updatedLists);
              refreshTodoList();
              toast.info("To-do item has been successfully deleted!");
            } catch (err) {
                console.log(err);
                toast.error("To-do item could not be deleted!");
            }
        }
    };

  return (
    <div className='h-full flex items-center justify-center z-50'>
        <div className={`max-w-[600px] ${mode !== "delete" ? 'w-full' : ''} relative mx-auto`}>
            <div className={`-top-[20px] -right-[40px] absolute`} onClick={() => setModalOpen(false)}>
                <MdOutlineCancel className='text-[28px] text-theme-blue cursor-pointer bg-white rounded-full'/>
            </div>

            {(mode === "add" || mode === "edit") && 
            <div className='bg-white w-full max-h-[70vh] rounded-md relative overflow-scroll'>
                <p className='text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white'>{ `${mode === "edit" ? 'Edit' : 'Add'} Todo List`} </p>
                <form className='p-6 custom-scrollbar2' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-[20px]'>
                        <div className='w-full flex flex-col'>
                            <span className='pb-1'>Name<span className='text-red-500'>*</span></span>
                            <input type='text' value={name} placeholder='Enter Name' className='inputDiv rounded-md' onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
                        </div>
                        <div className='w-full flex flex-col'>
                            <span className='pb-1'>Description</span>
                            <textarea rows={4} value={description} placeholder='Enter Description' className='inputDiv rounded-md' onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}></textarea>
                        </div>
                        <div className='flex gap-[20px] w-full'>
                            <div className='flex flex-col w-full'>
                                <span>Due Date<span className='text-red-500'>*</span></span>
                                <input type='date' value={date} className='inputDiv rounded-md' onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}/>
                            </div>
                            <div className='flex flex-col w-full'>
                                <span>Category</span>
                                <input type='text' value={category} className='inputDiv rounded-md' placeholder='Enter Category' onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}/>
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-[5px]'>
                            <div className="flex items-center gap-[5px]">
                                <input type='checkbox' className='rounded-md' checked={hasSubTasks} onChange={e => setForm(prev => ({ ...prev, hasSubTasks: e.target.checked }))} id={`subtask-${domId}`} name='subtask' />
                                <label className='text-[15px] cursor-pointer' htmlFor={`subtask-${domId}`}>Has Subtasks? {hasSubTasks && <span className='text-red-500'>*</span>}</label>
                            </div>
                            {hasSubTasks && <div className='flex gap-[3px] items-center bg-theme-blue text-white rounded-md px-4 py-2 w-fit cursor-pointer' onClick={()=>{setSubTaskLength((prev)=>prev + 1); setForm((prev)=> ({...prev, subTasks:[...prev.subTasks, '']}))}}><MdAdd /></div>}
                        </div>
                        {
                            hasSubTasks ?
                            Array.from({ length: subTaskLength }).map((_, index) => (
                            <div key={index}>
                                <div className='flex items-center gap-[10px]'>
                                    <input type='text' value={subTasks[index]} className='inputDiv w-full rounded-md' placeholder='Enter SubTask' onChange={(e)=>addSubTasks(index, e)} />
                                    {
                                        index !== 0 &&
                                        <div className='flex gap-[3px] items-center bg-theme-blue text-white rounded-md px-4 py-2 w-fit cursor-pointer' onClick={()=>removeSubTask(index)}><FiMinus /></div>
                                    }
                                </div>
                            </div>
                            ))
                            :
                            <></>
                        }
                    </div>
                    <span className='text-[12px]'>(N:B: You have to fill all required <span className='text-red-500'>*</span> field to submit)</span>
                    <div className='flex justify-end w-full pt-4'>
                        <button className={`px-4 py-2 rounded-md text-white text-[14px] ${isFormValid ? 'bg-theme-blue cursor-pointer' : 'bg-[#cac9c9] cursor-not-allowed'}`}>
                            { isLoading ? 'Loading...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>}

            {mode === "delete" && 
            <div className='bg-white w-96 max-h-[80vh] rounded-md relative overflow-scroll custom-scrollbar2'>
                <p className='text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white'>{ `Delete Todo Item`} </p>
                <div className='p-6'>
                    <p>Are you sure you want to delete To-do Item</p>
                    <em>This action cannot be undone!</em>
                    <div className='flex justify-end w-full pt-4'>
                        <button onClick={handleDelete} className={`px-4 py-2 rounded-md text-white text-[14px] bg-red-600 hover:bg-red-500 cursor-pointer`}>
                            { isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    </div>
  )
}

export default TodoFormModal