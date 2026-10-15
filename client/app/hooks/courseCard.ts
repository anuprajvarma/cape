import { CourseCardType } from "@/types";
import {
  deleteBookmarkCourse,
  saveBookmarkCourse,
  saveEnrolledCourse,
} from "../utils/backendApiCalls";
import { useSessionsDetails } from "./sesionAndRouterDetail";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsOpen } from "../redux/slices/LoginModalSlice";

export const useCourseCardLogic = ({
  getDataCheck,
  setGetDataCheck,
}: {
  getDataCheck: boolean;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { session } = useSessionsDetails();
  const dispatch = useDispatch();

  const handleEnrolled = async ({
    title,
    channelTitle,
    thumbnails,
    description,
    id,
    indexOrder,
  }: CourseCardType) => {
    if (session.status === "authenticated") {
      const data = await saveEnrolledCourse({
        title,
        channelTitle,
        thumbnails,
        id,
        description,
        indexOrder: indexOrder,
        email: session.data?.user?.email ?? "",
      });
      if (data.isExist) {
        toast.success("you are already enrolled", {
          hideProgressBar: true,
        });
      } else {
        toast.success("course is enrolled", {
          hideProgressBar: true,
        });
      }
    } else {
      dispatch(setIsOpen(true));
    }
  };

  const handleDeletBookmarkCourse = async ({ id }: { id: string }) => {
    const data = await deleteBookmarkCourse({
      email: session.data?.user?.email ?? "",
      id,
    });
    if (data.deleteBookmarCourseHandler) {
      toast.success("course is unmark", {
        hideProgressBar: true,
      });
    }
    setGetDataCheck(!getDataCheck);
  };

  const handleBookmark = async ({
    title,
    channelTitle,
    thumbnails,
    id,
    getDataCheck,
    setGetDataCheck,
  }: CourseCardType) => {
    if (session.status === "authenticated") {
      const data = await saveBookmarkCourse({
        title,
        channelTitle,
        thumbnails,
        id,
        email: session.data?.user?.email ?? "",
      });
      if (data.isExist) {
        console.log(data);
        toast.success("course is already bookmark", {
          hideProgressBar: true,
        });
      } else {
        console.log(data.isExist);
        toast.success("course is bookmarke", {
          hideProgressBar: true,
        });
      }
      setGetDataCheck(!getDataCheck);
    } else {
      dispatch(setIsOpen(true));
    }
  };
  return { handleEnrolled, handleDeletBookmarkCourse, handleBookmark };
};
