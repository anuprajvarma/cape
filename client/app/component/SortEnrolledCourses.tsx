import { SortItemPropType } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import dynamic from "next/dynamic";
import { useSortable } from "@dnd-kit/sortable";

const EnrolledCard = dynamic(() => import("../component/EnrolledCard"), {
  ssr: false,
});

export const SortEnrolledCourses = ({
  id,
  data,
  setGetDataCheck,
  getDataCheck,
}: SortItemPropType) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EnrolledCard
        title={data.title}
        channelTitle={data.channelTitle}
        thumbnail={data.thumbnail}
        chapterLength={data.chapterLength}
        playlistId={data.playlistId}
        playlistDescription={data.playlistDescription}
        channelImage={data.channelImage}
        setGetDataCheck={setGetDataCheck}
        getDataCheck={getDataCheck}
      />
    </div>
  );
};
