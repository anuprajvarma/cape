import { setCourseLinkModal } from "../redux/slices/CourseLinkModal";
import { setCourseLink } from "../redux/slices/CourseLink";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IoMdShareAlt } from "react-icons/io";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { youtubeApiKey } from "../utils/reusableConstant";
import { videoTitleSection } from "@/types";

const apikey = youtubeApiKey();

export const VideoTitleSection = ({
  id,
  videoTitle,
  videoId,
  playlists,
  playlistLengths,
  completedChapters,
  setPlaylistLengths,
}: videoTitleSection) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchLengths = async () => {
      const newLengths: Record<string, string> = {};
      await Promise.all(
        playlists.map(async (item) => {
          const id = item.snippet?.playlistId;
          if (id) {
            const lenthRes = await fetch(
              `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${apikey}`,
            );

            const data = await lenthRes.json();
            if (data.items[0]) {
              newLengths[id] = data.items[0]?.contentDetails?.itemCount || 0;
            }
          }
        }),
      );

      setPlaylistLengths(newLengths);
    };

    if (playlists?.length > 0) {
      fetchLengths();
    }
  }, [playlists]);

  return (
    <div className="flex gap-2 justify-between bg-mediumSlaty border-lightSlaty p-1 sm:p-2 rounded-lg">
      <p className="text-lg font-semibold text-white line-clamp-1">
        {videoTitle}
      </p>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="flex gap-8 items-center"
              onClick={() => {
                dispatch(setCourseLinkModal(true));
                dispatch(
                  setCourseLink(
                    `https://cape-lyart.vercel.app/course/${id}/${videoId}`,
                  ),
                );
              }}
            >
              <div className="flex lg:hidden gap-2 font-medium text-slaty/80">
                <p className="text-slaty sm:flex hidden">Progress -</p>
                <div>
                  {typeof id === "string" && playlistLengths[id] && (
                    <p>{`${completedChapters?.length}/${playlistLengths[id]}`}</p>
                  )}
                </div>
              </div>
              <IoMdShareAlt className="text-2xl hover:text-slaty transition duration-300 w-7 h-7" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              className="bg-lightSlaty text-slaty px-3 py-1 text-sm rounded shadow-md z-20"
            >
              Share
              <Tooltip.Arrow className="fill-lightSlaty" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};
