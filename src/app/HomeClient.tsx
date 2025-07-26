"use client";

import { useCallback, useEffect, useState } from "react";
import { IListStructure } from "@/types/ListTypes";
import StatusDiv from "@/components/StatusDiv";
import TodoFormModal from "@/components/TodoFormModal";
import { LocalStorageService } from "@/utils/LocalStorageService";
import { useFilter } from "@/store/FilterContext";
import { getISODateFormat } from "@/utils/Formatters";
import { useTag } from "@/store/TagContext";
import { WeatherPredictionsByDate } from "@/components/WeatherPredictionsByDate";
import { dummyData } from "@/data/dummy-list";
import { DynamicIcons } from "@/components/ui/DynamicIcons";
import { Overlay } from "@/components/ui";
import { toast } from "react-toastify";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const HomeClient = () => {
    const [completed, setCompleted] = useState<IListStructure[]>([]);
    const [todo, setTodo] = useState<IListStructure[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [weatherModalOpen, setWeatherModalOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [allTodoList, setAllTodoList] = useState<IListStructure[]>([]);
    const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add');
    const { setSelectedFilterQuery, selectedFilterQuery } = useFilter();
    const { selectedTag } = useTag();

    useEffect(() => {
        const existing = LocalStorageService.get<IListStructure[]>();
        if (!existing || existing.length === 0) {
            LocalStorageService.set(dummyData);
        }
    }, []);

    const refreshTodoList = useCallback(() => {
        setPageLoading(true);
        try {
            const stored = LocalStorageService.get<IListStructure[]>() ?? [];
            let locallySavedData = stored;

            if (selectedTag) {
                locallySavedData = locallySavedData.filter((list) => list.tag === selectedTag);
            }

            if (selectedFilterQuery) {
                const today = getISODateFormat(new Date());

                if (selectedFilterQuery.toLowerCase() === 'today') {
                    locallySavedData = locallySavedData.filter((list) => getISODateFormat(list.date) === today);
                } else if (selectedFilterQuery.toLowerCase() === 'past due-date') {
                    locallySavedData = locallySavedData.filter((list) => getISODateFormat(list.date) < today);
                } else if (selectedFilterQuery.toLowerCase() === 'pending') {
                    locallySavedData = locallySavedData.filter((list) => !list.completed);
                }
            }

            if (locallySavedData) {
                setAllTodoList(locallySavedData);
                setCompleted(locallySavedData.filter((list) => list.completed));
                setTodo(locallySavedData.filter((list) => !list.completed));
            }
        } catch (err) {
            toast.error((err as Error).message || "An error occurred while refreshing the list.");
        } finally {
            setPageLoading(false);
        }
        // setTimeout(() => {
        // }, 500);
    }, [selectedTag, selectedFilterQuery]);

    useEffect(() => {
        refreshTodoList();
    }, [selectedTag, selectedFilterQuery, refreshTodoList]);

    const addNewTask = () => {
        setMode("add");
        setModalOpen(true);
    }

    const queries = ['Today', 'Pending', 'All Tasks', 'Past Due-Date'];
    
    const handleTaskDrag = (id: string | number) => {
        try {
            const todos = LocalStorageService.get<IListStructure[]>();
            const updatedTodos = todos?.map(todo => {
                if (todo.id === id) {
                    toast.success(`Status changed — ${!todo.completed ? "task completed!" : "task is yet to be completed."}`);
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            });
            
            LocalStorageService.set(updatedTodos);
            refreshTodoList();
        } catch (err) {
            toast.error((err as Error).message);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="w-full">
                <main className="w-full py-4">
                    <div className="flex justify-end gap-[20px]">
                        <div
                            className="flex items-center cursor-pointer gap-[10px] bg-theme-blue text-white w-fit p-2 px-4 rounded-md hover:scale-95 transition-all duration-300 ease-in-out"
                            data-testid="open-weather-modal"
                            onClick={() => setWeatherModalOpen(true)}
                        >
                            <span><DynamicIcons iconName="fluent:weather-hail-night-48-regular" /></span>
                            <span>Get Weather Predictions</span>
                        </div>
                        <div
                            data-testid="todo-open-modal"
                            className="flex items-center cursor-pointer gap-[10px] bg-theme-blue text-white w-fit p-2 px-4 rounded-md hover:scale-95 transition-all duration-300 ease-in-out"
                            onClick={addNewTask}
                        >
                            <span><DynamicIcons iconName="bitcoin-icons:plus-filled" /></span>
                            <span>Add New Task</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:gap-6 flex-wrap pt-5">
                        {queries.map((query) => (
                            <span
                                key={query}
                                onClick={() => setSelectedFilterQuery(query)}
                                className={`cursor-pointer text-base sm:text-lg font-semibold p-6 whitespace-nowrap flex-1 min-w-[120px] h-[120px] flex items-center justify-center border border-theme-blue rounded-lg hover:scale-95 transition-all duration-300 ease-in-out ${query.toLowerCase() === selectedFilterQuery?.toLowerCase() ? 'text-theme-orange font-semibold' : 'text-theme-blue'}`}
                            >
                                {query}
                            </span>
                        ))}
                    </div>
                    <div>
                        <p className="text-xl text-theme-blue font-semibold pt-8 mb-3 border-b">Todo List</p>
                        {pageLoading ? (
                            <div className="w-full relative h-[40vh]">
                                <div className="loader w-full m-auto"></div>
                            </div>
                        ) : allTodoList && allTodoList.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                                <StatusDiv modalOpen={modalOpen} data={todo} completed={false} status="Todo" refreshTodoList={refreshTodoList} handleTaskDrag={handleTaskDrag} />
                                <StatusDiv modalOpen={modalOpen} data={completed} completed={true} status="Completed" refreshTodoList={refreshTodoList} handleTaskDrag={handleTaskDrag} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <p className="text-base font-semibold">No data found</p>
                            </div>
                        )}
                    </div>
                </main>
                <Overlay isOpen={modalOpen}>
                    <TodoFormModal
                        setModalOpen={setModalOpen}
                        refreshTodoList={refreshTodoList}
                        mode={mode}
                        setMode={setMode}
                        modalOpen={modalOpen}
                    />
                </Overlay>
                <Overlay isOpen={weatherModalOpen}>
                    <WeatherPredictionsByDate
                        setModalOpen={setWeatherModalOpen}
                        modalOpen={weatherModalOpen}
                    />
                </Overlay>
            </div>
        </DndProvider>
    );
};
