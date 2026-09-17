import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const resumeFileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setResumeFile(file || null);
  };

  const profilePhotoChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setProfilePhotoFile(file || null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname || "");
    formData.append("email", input.email || "");
    formData.append("phoneNumber", input.phoneNumber || "");
    formData.append("bio", input.bio || "");
    formData.append("skills", input.skills || "");
    if (profilePhotoFile) {
      formData.append("profilePhoto", profilePhotoFile);
    }
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
    setOpen(false);
    console.log(input);
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Update Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">
                  Name:
                </Label>
                <Input
                  id="name"
                  name="fullname"
                  type="text"
                  onChange={changeEventHandler}
                  value={input.fullname}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">
                  Email:
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={changeEventHandler}
                  value={input.email}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold"></Label>
                <Input
                  id="number"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  name="phoneNumber"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">
                  Bio:
                </Label>
                <Input
                  id="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  name="bio"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">
                  Skills:
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  onChange={changeEventHandler}
                  value={input.skills}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profilePhoto" className="text-right font-bold">
                  Photo:
                </Label>
                <Input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  onChange={profilePhotoChangeHandler}
                  accept="image/*"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resume" className="text-right font-bold">
                  Resume:
                </Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  onChange={resumeFileChangeHandler}
                  accept="application/pdf"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button type="submit" className="w-full my-4">
                  Update
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
