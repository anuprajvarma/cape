import { Dialog, DialogPanel } from "@headlessui/react";
import React from "react";
// import { FaArrowRight } from "react-icons/fa";
// import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { IoIosLink } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCourseLinkModal } from "../redux/slices/CourseLinkModal";

export default function CourseLinkModal() {
  const isOpen = useSelector((state: RootState) => state.CourseLinkModal);
  const courseLink = useSelector((state: RootState) => state.CourseLink);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-30 focus:outline-none"
        onClose={() => dispatch(setCourseLinkModal(false))}
        __demoMode
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center">
          <div className="flex flex-col gap-4 items-center justify-center p-4 bg-mediumSlaty  border border-lightSlaty w-[15rem] h-[8rem] rounded-lg">
            <button
              onClick={() => dispatch(setCourseLinkModal(false))}
              className="w-full flex justify-end"
            >
              <FaXmark />
            </button>
            <DialogPanel
              transition
              className="flex w-full h-full flex-col gap-4"
            >
              <button
                onClick={async () => {
                  console.log("Course Link:", courseLink);
                  try {
                    await navigator.clipboard.writeText(courseLink);
                  } catch (err) {
                    console.error("Failed to copy: ", err);
                  }
                  toast.success("Link copied", {
                    hideProgressBar: true,
                  });
                  dispatch(setCourseLinkModal(false));
                }}
                className="py-3 text-white text-center flex gap-2 items-center justify-center w-full rounded-[8px] cursor-pointer font-semibold border border-lightSlaty hover:bg-lightSlaty text-sm transition duration-300"
              >
                <IoIosLink size={17} />
                <p>Copy link</p>
              </button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
