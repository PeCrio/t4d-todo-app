"use client";

import { IListStructure } from '@/types/ListTypes';
import { LocalStorageService } from '@/utils/LocalStorageService';
import React, { useState, Dispatch, SetStateAction, useId, useEffect } from 'react';
import { MdOutlineCancel } from "react-icons/md";

interface TodoFormModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  todoItemId?: string | number;
  refreshTodoList: () => void;
  edit?: boolean;
}

const TodoFormModal = ({ setModalOpen, todoItemId, refreshTodoList, edit }: TodoFormModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    // const [subTasks, setSubTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const id = useId();

    useEffect(() => {
        const preExistingData = LocalStorageService.get<IListStructure[]>();
        console.log(preExistingData?.find(item => item.id === todoItemId))
        if (todoItemId) {
            const currentTodoItem = preExistingData?.find(item => item.id === todoItemId);
            const isoDateFormat = currentTodoItem ? new Date(currentTodoItem?.date).toISOString().split('T')[0] : ''
            setName(currentTodoItem?.name || '')
            setDescription(currentTodoItem?.description || '')
            setDate(isoDateFormat)
            setCategory(currentTodoItem?.category || '')
        }
    }, [todoItemId]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        try{
            setIsLoading(true);
            e.preventDefault();
            
            const preExistingData = LocalStorageService.get<IListStructure[]>();
            const data = {
                name,
                description,
                date,
                category,
                // has_subtask: subTasks.length > 0,
                has_subtask: false,
                completed: false,
            };

            if (todoItemId) {
                const updatedList = (preExistingData || []).map(item =>
                  item.id === todoItemId
                    ? { ...item, ...data }
                    : item
                );
              
                LocalStorageService.set(updatedList);
            } else {
                const payload = {
                  ...data,
                  id
                };
              
                LocalStorageService.set([
                  ...(preExistingData || []),
                  payload,
                ]);  
            }

            setModalOpen(false);
            refreshTodoList();
        }catch(e){
            console.log(e)
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        setIsFormValid(date !== '' && name.trim() !== '' ? true : false);
    },[name, date])


  return (
    <div className='h-full flex items-center justify-center'>
        <div className='bg-white max-h-[80%] max-w-[600px] w-full rounded-md relative'>
            <div className='-top-[20px] -right-[40px] absolute' onClick={() => setModalOpen(false)}>
                <MdOutlineCancel className='text-[28px] text-theme-blue cursor-pointer bg-white rounded-full'/>
            </div>
            <p className='text-theme-blue font-semibold border-b px-6 py-4'>{ `${edit ? 'Edit' : 'Add'} Todo List`} </p>
            <form className='p-6' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-[20px]'>
                    <div className='w-full flex flex-col'>
                        <span className='pb-1'>Name<span className='text-red-500'>*</span></span>
                        <input type='text' value={name} placeholder='Enter Name' className='inputDiv' onChange={(e)=> setName(e.target.value)} />
                    </div>
                    <div className='w-full flex flex-col'>
                        <span className='pb-1'>Description</span>
                        <textarea rows={4} value={description} placeholder='Enter Description' className='inputDiv' onChange={(e)=> setDescription(e.target.value)}></textarea>
                    </div>
                    <div className='flex gap-[20px] w-full'>
                        <div className='flex flex-col w-full'>
                            <span>Due Date<span className='text-red-500'>*</span></span>
                            <input type='date' value={date} className='inputDiv' onChange={(e)=> setDate(e.target.value)}/>
                        </div>
                        <div className='flex flex-col w-full'>
                            <span>Category</span>
                            <input type='text' value={category} className='inputDiv' placeholder='Enter Category' onChange={(e)=> setCategory(e.target.value)}/>
                        </div>
                    </div>
                    <div className='flex gap-[5px]'>
                        <input type='checkbox' id='subtask' />
                        <label className='text-[15px] cursor-pointer' htmlFor='subtask'>Has Subtasks?</label>
                    </div>
                </div>
                <div className='flex justify-end w-full pt-4'>
                    <button className={`px-4 py-2 rounded-md text-white text-[14px] ${isFormValid ? 'bg-theme-blue cursor-pointer' : 'bg-[#cac9c9] cursor-not-allowed'}`}>
                        { isLoading ? 'Loading...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default TodoFormModal