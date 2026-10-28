"use client";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = () => {
  return (
    <ToastContainer
      closeButton={false}
      transition={Slide}
      theme="colored"
      position="top-right"
      autoClose={2000}
      stacked
      toastStyle={{
        backdropFilter: "blur(50px)",
        backgroundColor: "rgba(37, 37, 37, 0.1)",
        opacity: "5px",
        border: "1px solid #414141",
        borderRadius: "50px",
        color: "#ffffff",
        padding: "0px 20px",
      }}
    />
  );
};

export default Toaster;
