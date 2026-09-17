import { Bookmark } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [isSaved, setIsSaved] = useState(
    user?.savedJobs?.some((savedJob) => savedJob.toString() === job?._id),
  );
  const [isSaving, setIsSaving] = useState(false);
  //const jobId = "nhuibtuit";

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifferene = currentTime - createdAt;
    return Math.floor(timeDifferene / (1000 * 24 * 60 * 60));
  };

  const saveJobHandler = async () => {
    if (!user) {
      toast.error("Please log in to save jobs");
      navigate("/login");
      return;
    }

    try {
      setIsSaving(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/saved-jobs/${job?._id}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        setIsSaved(res.data.saved);
        dispatch(setUser({ ...user, savedJobs: res.data.savedJobs }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save this job");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="app-card flex h-full flex-col rounded-md p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text -sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}{" "}
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={saveJobHandler}
          disabled={isSaving}
          aria-label={isSaved ? "Remove saved job" : "Save job for later"}
        >
          <Bookmark className={isSaved ? "fill-cyan-300 text-cyan-300" : ""} />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-1 " vatient="outline" size="icon ">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>

        <div>
          <h1 className="font-medium text-lg ">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>
      <div>
        <h1 className="my-2 line-clamp-2 text-lg font-bold">{job?.title}</h1>
        <p className="min-h-[4.5rem] line-clamp-3 text-sm text-gray-300">
          {job?.description}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
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

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          varient="outline"
        >
          Details
        </Button>
        <Button
          className="bg-[#7209b7]"
          onClick={saveJobHandler}
          disabled={isSaving}
        >
          {isSaved ? "Saved for later" : "Save for later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
