import React from "react";
import Image from "next/image";

const PlalistVideoCard = () => {
  return (
    <div className="flex gap-2 p-1  items-center">
      <div className="flex w-[10rem] h-[4rem] relative">
        <Image
          src="/code.jpg"
          alt="code"
          quality={100}
          sizes="80px"
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="line-clamp-2 text-sm font-semibold">
          React js Tutorial in Hindi lkasdfksfkj alskfj sf ls alkjfasf af as fd
          sadf{" "}
        </p>
        <p className="text-xs">CodeWithHarry</p>
      </div>
      <div className="p-1">
        <input type="checkbox" />
      </div>
    </div>
  );
};

export default PlalistVideoCard;
