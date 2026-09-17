import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      onClick={() => navigate(`/description/${job._id}`)}
      className="app-card flex h-full flex-col rounded-md p-5 shadow-xl cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0 16px 30px rgba(0, 0, 0, 0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <div>
        <h1 className="font-medium text-lg">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500">India</p>
      </div>
      <div>
        <h1 className="my-2 line-clamp-2 text-lg font-bold">{job?.title}</h1>
        <p className="min-h-[4.5rem] line-clamp-3 text-sm text-gray-300">
          {job?.description}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Position
        </Badge>
        <Badge className="text-red-700 font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-green-700 font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </motion.div>
  );
};

export default LatestJobCards;
