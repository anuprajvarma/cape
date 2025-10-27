import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { FaXmark } from "react-icons/fa6";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../redux/slices/LoginModalSlice";

export default function LoginModal() {
  const isOpen = useSelector((state: RootState) => state.checkModal);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-30 focus:outline-none"
        onClose={() => dispatch(setIsOpen(false))}
        __demoMode
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center">
          <div className="flex flex-col gap-4 items-center justify-center p-4 bg-mediumSlaty  border border-lightSlaty w-[25rem] h-[15rem] rounded-lg">
            <button
              onClick={() => dispatch(setIsOpen(false))}
              className="w-full flex justify-end"
            >
              <FaXmark />
            </button>
            <DialogPanel transition className="flex h-full flex-col gap-4">
              <DialogTitle
                as="h3"
                className="flex items-center justify-center text-xl font-semibold text-white"
              >
                Sign In
              </DialogTitle>
              <button
                onClick={() => signIn("google")}
                className="px-6 py-3 flex gap-2 items-center rounded-[8px] cursor-pointer font-semibold text-sm bg-lightBlue hover:bg-lightBlue/80 transition duration-300"
              >
                <p>Sign in</p>
                <FaArrowRight />
              </button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
