import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setAllJobs, setSearchQuery } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

//const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const Browse = () => {
  useGetAllJobs();
  const allJobs = useSelector((store) => store.job?.allJobs ?? []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchQuery(""));
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Navbar />
      <div className="mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="my-10 text-xl font-bold"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          Search Result {allJobs.length}
        </motion.h1>
        <motion.div
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {allJobs.map((job) => {
            return (
              <motion.div
                key={job._id}
                className="h-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Job job={job} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Browse;
