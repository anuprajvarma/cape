import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { FaXmark } from "react-icons/fa6";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../redux/slices/LoginModalSlice";

export const LoginModal = () => {
  const isOpen = useSelector((state: RootState) => state.checkModal);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-30 focus:outline-hidden"
        onClose={() => dispatch(setIsOpen(false))}
        __demoMode
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center bg-white/5 backdrop-blur-sm">
          <div className="flex flex-col gap-4 items-center justify-center bg-brand-slate-1/20 rounded-[20px]">
            <DialogPanel transition className="flex h-full flex-col gap-4">
              <button
                onClick={() => signIn("google")}
                className="flex gap-2 items-center rounded-sm cursor-pointer font-semibold text-md sm:text-xl bg-lightBlue hover:bg-lightBlue/80 transition duration-300 py-4 px-8 sm:py-8 sm:px-16"
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
};
