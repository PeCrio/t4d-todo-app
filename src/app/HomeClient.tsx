"use client";

import { useCallback, useEffect, useState } from "react";
import { IListStructure } from "@/types/ListTypes";
import StatusDiv from "@/components/StatusDiv";
import TodoFormModal from "@/components/TodoFormModal";
import { LocalStorageService } from "@/utils/LocalStorageService";
import { useFilter } from "@/store/FilterContext";
import { getISODateFormat } from "@/utils/Formatters";
import { toast } from "react-toastify";
import { useTag } from "@/store/TagContext";
import { WeatherPredictionsByDate } from "@/components/WeatherPredictionsByDate";
import { dummyData } from "@/data/dummy-list";
import { DynamicIcons } from "@/components/ui/DynamicIcons";
import { Overlay } from "@/components/ui";

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
        setTimeout(() => {
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
        }, 500);
    }, [selectedTag, selectedFilterQuery]);

    useEffect(() => {
        refreshTodoList();
    }, [selectedTag, selectedFilterQuery, refreshTodoList]);

    const addNewTask = () => {
        setMode("add");
        setModalOpen(true);
    }

    const queries = ['Today', 'Pending', 'All Tasks', 'Past Due-Date'];

    return (
        <div className="w-full">
            <main className="w-full py-4">
                <div className="flex justify-end gap-[20px]">
                    <div
                        className="flex items-center cursor-pointer gap-[10px] bg-theme-blue text-white w-fit p-2 px-4 rounded-sm hover:scale-95"
                        onClick={() => setWeatherModalOpen(true)}
                    >
                        <span><DynamicIcons iconName="fluent:weather-hail-night-48-regular" /></span>
                        <span>Get Weather Predictions</span>
                    </div>
                    <div
                        className="flex items-center cursor-pointer gap-[10px] bg-theme-blue text-white w-fit p-2 px-4 rounded-sm hover:scale-95"
                        onClick={addNewTask}
                    >
                        <span><DynamicIcons iconName="bitcoin-icons:plus-filled" /></span>
                        <span>Add New Task</span>
                    </div>
                </div>
                <div className="flex items-center justify-between todo-task-div">
                    {queries.map((query) => (
                        <span
                            key={query}
                            onClick={() => setSelectedFilterQuery(query)}
                            className={`${query.toLowerCase() === selectedFilterQuery?.toLowerCase() ? 'text-theme-orange font-semibold' : 'text-theme-blue'}`}
                        >
                            {query}
                        </span>
                    ))}
                </div>
                <div>
                    <p className="text-xl text-theme-blue font-semibold py-4">Todo Lists</p>
                    {pageLoading ? (
                        <div className="w-full relative h-[40vh]">
                            <div className="loader w-full m-auto"></div>
                        </div>
                    ) : allTodoList && allTodoList.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                            <StatusDiv data={todo} status="Todo" refreshTodoList={refreshTodoList} />
                            <StatusDiv data={completed} status="Completed" refreshTodoList={refreshTodoList} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                            No data found
                        </div>
                    )}
                </div>
            </main>
            {
                modalOpen ?
                <Overlay isOpen={modalOpen}>
                    <TodoFormModal
                        setModalOpen={setModalOpen}
                        refreshTodoList={refreshTodoList}
                        mode={mode}
                        setMode={setMode}
                        modalOpen={modalOpen}
                    />
                </Overlay> : <></>
            }
            {
                weatherModalOpen &&
                <Overlay isOpen={weatherModalOpen}>
                    <WeatherPredictionsByDate
                        setModalOpen={setWeatherModalOpen}
                        modalOpen={weatherModalOpen}
                    />
                </Overlay>
            }
        </div>
    );
};
