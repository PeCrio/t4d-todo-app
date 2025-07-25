import { useDrag } from "react-dnd";
import { useRef } from "react";
import { IListStructure } from "@/types/ListTypes";
import { formatToLongDate } from "@/utils/Formatters";
import SingleWeatherDetails from "./SingleWeatherDetails";
import { DynamicIcons } from "./ui";

interface DraggableListItemProps {
  item: IListStructure;
  index: number;
  completed: boolean;
  isPopupOpen: boolean;
  handlePopUpToggle: (index: number) => void;
  updateTodo: (id: string | number) => void;
  updateStatus: (id: string | number) => void;
  openDeleteModal: (id: string | number) => void;
}

const DraggableListItem = ({
  item,
  index,
  completed,
  isPopupOpen,
  handlePopUpToggle,
  updateTodo,
  updateStatus,
  openDeleteModal
}: DraggableListItemProps) => {
  const itemRef = useRef<HTMLUListElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TODO_ITEM",
    item: { id: item.id, completed },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(itemRef);

  return (
    <ul
      ref={itemRef}
      className={`cursor-grab p-2 pr-6 bg-white my-3 relative rounded-md ${
        isDragging ? "cursor-grab opacity-50 border-2 border-dashed border-gray-600" : ""
      }`}
    >
      <span
        className="absolute right-[5px] top-[8px] cursor-pointer p-1 rounded-full hover:bg-gray-200 transition-all duration-300 ease-in-out"
        onClick={() => handlePopUpToggle(index)}
      >
        <DynamicIcons iconName="pepicons-pencil:dots-y" />
      </span>

      {isPopupOpen ? (
        <div
          className={`bg-white rounded-md px-4 p-2 absolute z-[1] top-[35px] -right-[5px] shadow-md gap-[5px] flex flex-col list_popup`}
          onClick={() => handlePopUpToggle(index)}
        >
          <div
            className="cursor-pointer hover:text-[#f1884d] w-fit"
            onClick={() => updateTodo(item.id)}
          >
            Edit
          </div>
          <div
            className="cursor-pointer hover:text-[#f1884d] w-fit"
            onClick={() => updateStatus(item.id)}
          >
            {item.completed ? "Unmark as done" : "Mark as done"}
          </div>
          <div
            className="cursor-pointer hover:text-[#f1884d] w-fit"
            onClick={() => openDeleteModal(item.id)}
          >
            Delete
          </div>
        </div>
      ) : null}

      <li>
        <p className="font-semibold">{item.name}</p>
        <span>{item.description || "Nil"}</span>
        <br />
        <span className="flex gap-[5px] items-center">
          <DynamicIcons iconName="pixel:calender-solid" width={20} height={20} />
          <span className="font-semibold">{formatToLongDate(item.date)}</span>
        </span>
        <ul>
          {item.has_subtask &&
            item.subTasks?.map((sub, subIndex) => (
              <li key={subIndex} className="list-disc ml-5">
                {sub}
              </li>
            ))}
        </ul>
        {item.weather && <SingleWeatherDetails weather={item.weather} />}
        {item.tag && (
          <span className="pt-4 text-[14px] text-theme-orange">#{item.tag}</span>
        )}
      </li>
    </ul>
  );
};

export default DraggableListItem;
