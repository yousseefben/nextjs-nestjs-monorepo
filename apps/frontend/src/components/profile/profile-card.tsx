import Image from "next/image";
import React from "react";

type PorfileCardType = {
  fullName: string;
  email: string;
  avatar: string;
};
const ProfileCard = ({ fullName, email, avatar }: PorfileCardType) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto">
      <div className="flex flex-col items-center pb-10 ">
        <div className="w-24 h-24 mb-3 rounded-full shadow-lg  relative">
          <Image src={avatar} alt="avatar" fill />
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {fullName}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {email}
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
