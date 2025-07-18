import React from 'react'

const DeletePrompt = ({isLoading, handleDelete}: {isLoading: boolean, handleDelete: () => void}) => {
  return (
    <div className="bg-white w-96 max-h-[80vh] rounded-md relative overflow-scroll custom-scrollbar2">
        <p className="text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white">
            {`Delete Todo Item`}{" "}
        </p>
        <div className="p-6">
            <p>Are you sure you want to delete To-do Item</p>
            <em>This action cannot be undone!</em>
            <div className="flex justify-end w-full pt-4">
            <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded-md text-white text-[14px] bg-red-600 hover:bg-red-500 cursor-pointer`}
            >
                {isLoading ? "Deleting..." : "Delete"}
            </button>
            </div>
        </div>
    </div>
  )
}

export default DeletePrompt