import React from "react";
import EnrolledCard from "../component/EnrolledCard";

const Dashboard = () => {
  return (
    <div className="w-full -z-20 py-[2rem] px-4 text-black border-t border-slaty flex justify-center">
      <div className="w-[70rem] flex flex-col gap-12">
        <EnrolledCard />
        <EnrolledCard />
        <EnrolledCard />
        <EnrolledCard />
        <EnrolledCard />
        <EnrolledCard />
      </div>
    </div>
  );
};

export default Dashboard;
