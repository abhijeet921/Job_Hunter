import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCards";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
  const { allJobs, searchQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchQuery) {
      const salaryRange = searchQuery.match(
        /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)(?:k|lpa)?$/i,
      );
      const filteredJobs = allJobs.filter((job) => {
        if (salaryRange) {
          const salary = Number(job?.salary);
          const minimumSalary = Number(salaryRange[1]);
          const maximumSalary = Number(salaryRange[2]);

          return (
            Number.isFinite(salary) &&
            salary >= minimumSalary &&
            salary <= maximumSalary
          );
        }

        return (
          job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(job?.salary ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchQuery]);

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="w-full md:w-64 md:shrink-0">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1 pb-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filterJobs.map((job) => (
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
