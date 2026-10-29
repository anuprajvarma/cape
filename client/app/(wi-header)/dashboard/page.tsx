"use client";

import React, { useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CourseLinkModal } from "../../component/CourseLinkModal";
import { SortEnrolledCourses } from "../../component/SortEnrolledCourses";
import { useDashboard } from "../../hooks/dashboard";

const Dashboard: React.FC = () => {
  const [getDataCheck, setGetDataCheck] = useState<boolean>(false);
  const { handleDragEnd, enrolledCoursePlaylist, checkDataExist, dataLoading } =
    useDashboard({ getDataCheck });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <>
      <CourseLinkModal />
      <div className="w-full h-full py-8 px-4 text-black flex justify-center mt-16">
        <div className="w-280 h-full flex flex-col gap-8 items-center justify-center">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={enrolledCoursePlaylist.map((item) => item.playlistId)}
              strategy={verticalListSortingStrategy}
            >
              {enrolledCoursePlaylist.length > 0 ? (
                enrolledCoursePlaylist.map((data) => (
                  <SortEnrolledCourses
                    key={data.playlistId}
                    id={data.playlistId}
                    data={data}
                    setGetDataCheck={setGetDataCheck}
                    getDataCheck={getDataCheck}
                  />
                ))
              ) : checkDataExist ? (
                <p className="text-xl text-center text-brand-slate-1">
                  You have not enrolled in any courses.
                </p>
              ) : dataLoading ? (
                <p className="text-xl text-center text-slaty">Loading...</p>
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <p className="text-xl text-center text-brand-slate-1">
                    You are not Sign in
                  </p>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
