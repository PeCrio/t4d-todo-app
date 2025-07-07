"use client";

import { IListStructure } from '@/types/ListTypes';
import { LocalStorageService } from '@/utils/LocalStorageService';
import React, { useState, Dispatch, SetStateAction, useId } from 'react';
import { MdOutlineCancel } from "react-icons/md";

interface AddTodoListProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddTodoList = ({ setModalOpen}: AddTodoListProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    // const [subTasks, setSubTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const id = useId();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        try{
            setIsLoading(true);
            e.preventDefault();
            const data = {
                name,
                description,
                date,
                category,
                // has_subtask: subTasks.length > 0,
                has_subtask: false,
                completed: false,
                id
            };
            const preExistingData = LocalStorageService.get<IListStructure[]>();

            LocalStorageService.set([
            ...(preExistingData || []),
            data,
            ]);
            setModalOpen(false);
        }catch(e){
            console.log(e)
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <div className='h-full flex items-center justify-center'>
        <div className='bg-white max-h-[80%] max-w-[600px] w-full rounded-md relative'>
            <div className='-top-[20px] -right-[40px] absolute' onClick={() => setModalOpen(false)}>
                <MdOutlineCancel className='text-[28px] text-theme-blue cursor-pointer bg-white rounded-full'/>
            </div>
            <p className='text-theme-blue font-semibold border-b px-6 py-4'>Add Todo List</p>
            <form className='p-6' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-[20px]'>
                    <div className='w-full flex flex-col'>
                        <span className='pb-1'>Name</span>
                        <input type='text' value={name} placeholder='Enter Name' className='inputDiv' onChange={(e)=> setName(e.target.value)} />
                    </div>
                    <div className='w-full flex flex-col'>
                        <span className='pb-1'>Description</span>
                        <textarea rows={4} value={description} placeholder='Enter Description' className='inputDiv' onChange={(e)=> setDescription(e.target.value)}></textarea>
                    </div>
                    <div className='flex gap-[20px] w-full'>
                        <div className='flex flex-col w-full'>
                            <span>Due Date</span>
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
                    <button className='bg-theme-blue px-4 py-2 rounded-md text-white text-[14px] cursor-pointer'>
                        { isLoading ? 'Loading...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddTodoList