import { Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "@/redux/jobSlice";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchQuery(query));
    navigate("/browse");
  };
  return (
    <motion.div
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.12 },
        },
      }}
    >
      <div className="flex flex-col gap-5 px-4 py-8 sm:my-10 sm:px-6">
        <motion.span
          className="mx-auto mt-2 rounded-full bg-gray-300 px-6 py-2 text-sm font-medium text-[#F83002] sm:px-10 sm:text-base"
          variants={{
            hidden: { opacity: 0, y: -16 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          No. 1 Job Hunt Website
        </motion.span>

        <motion.h1
          className="text-4xl font-bold leading-tight sm:text-5xl"
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Search, Apply & <br />
          Get Your <span className="text-[#6A38C2]">Dream Job</span>
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Discover opportunities that match your skills, connect with growing
          companies, and take the next confident step in your career.
        </motion.p>
        <motion.div
          className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border-gray-200 bg-gray-300 pl-3 shadow-lg"
          variants={{
            hidden: { opacity: 0, scale: 0.96 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <input
            type="text"
            placeholder="Find your deram job"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full h-5 text-black"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full bg-[#6A38C2] cursor-pointer hover:bg-[#4c17a8]"
          >
            <Search className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
