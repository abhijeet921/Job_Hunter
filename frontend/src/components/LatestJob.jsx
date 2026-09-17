import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const LatestJob = () => {
  const { allJobs } = useSelector((store) => store.job);
  return (
    <motion.div
      className="mx-auto my-16 max-w-7xl px-4 sm:my-20 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold sm:text-4xl">
        <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
      </h1>
      <div className="my-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allJobs.length <= 0 ? (
          <span>No Job Availabel</span>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </motion.div>
  );
};

export default LatestJob;
