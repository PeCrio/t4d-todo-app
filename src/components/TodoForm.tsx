
"use client";

import { Input, Button } from "./ui";
import { TodoFormState } from "@/types/WeatherTypes";

interface TodoFormProps {
  form: TodoFormState; 
  setForm: React.Dispatch<React.SetStateAction<TodoFormState>>; 
  domId: string;
  subTaskLength: number;
  setSubTaskLength: React.Dispatch<React.SetStateAction<number>>;
  addSubTasks: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSubTask: (index: number) => void;
}

export const TodoForm = ({
  form,
  setForm,
  domId,
  subTaskLength,
  setSubTaskLength,
  addSubTasks,
  removeSubTask,
}: TodoFormProps) => {
  const { name, description, date, tag, hasSubTasks, subTasks } = form;

  return (
    <div className="flex flex-col gap-[20px]">
      <Input
        label="Name"
        type="text"
        value={name}
        placeholder="Enter Name"
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        required
      />

      <div className="w-full flex flex-col">
        <span className="pb-1">Description</span>
        <textarea
          rows={4}
          value={description}
          placeholder="Enter Description"
          className="inputDiv rounded-md"
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        ></textarea>
      </div>

      <div className="flex gap-[20px] w-full">
        <Input
          label="Due Date"
          type="date"
          value={date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          required
        />
        <Input
          label="Tag"
          type="text"
          value={tag}
          placeholder="Enter Tag"
          onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-[5px]">
          <div className="flex items-center gap-[5px]">
            <input
              type="checkbox"
              className="rounded-md"
              checked={hasSubTasks}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hasSubTasks: e.target.checked }))
              }
              id={`subtask-${domId}`}
              name="subtask"
            />
            <label className="text-[15px] cursor-pointer" htmlFor={`subtask-${domId}`}>
              Has Subtasks? {hasSubTasks && <span className="text-red-500">*</span>}
            </label>
          </div>
          {hasSubTasks && (
            <Button
              type="button"
              onClick={() => {
                setSubTaskLength((prev) => prev + 1);
                setForm((prev) => ({ ...prev, subTasks: [...prev.subTasks, ""] }));
              }}
              className="flex gap-[3px] items-center bg-theme-blue text-white rounded-md px-4 py-2 w-fit cursor-pointer"
              iconName="gridicons:plus"
            >
              Add Subtask
            </Button>
          )}
        </div>
        {hasSubTasks && subTaskLength > 0 ? (
          Array.from({ length: subTaskLength }).map((_, index) => (
            <div key={index} className="flex gap-[10px] flex-col py-2">
              <div className="flex items-center gap-[10px]">
                <Input
                  type="text"
                  value={subTasks[index]}
                  className="w-full rounded-md"
                  placeholder="Enter SubTask"
                  onChange={(e) => addSubTasks(index, e)}
                />
                <Button
                  type="button"
                  onClick={() => removeSubTask(index)}
                  variant="danger"
                  className="flex gap-[3px] items-center rounded-md px-4 py-2 w-fit cursor-pointer"
                  iconName="cil:minus"
                ></Button>                
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
