import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { PopoverContent, Popover, PopoverTrigger } from "../ui/popover";
import { BriefcaseBusiness, LogOut, Menu, User2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="mt-2 p-0.3 rounded-4xl ">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400/15 text-cyan-300 shadow-lg shadow-cyan-950/30">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold sm:text-2xl">
            Job <span className="text-[#F83002]">Hunter </span>
          </h1>
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          <ul className="hidden items-center gap-5 font-medium md:flex">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="hover:underline cursor-pointer"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="hover:underline cursor-pointer"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:underline cursor-pointer">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:underline cursor-pointer">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:underline cursor-pointer">
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="bg-[#6A38C2] hover:bg-[#441596]"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="outline"
                  className="bg-[#6A38C2] hover:bg-[#441596] "
                >
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="size-10 cursor-pointer rounded-full ring-2 ring-white ring-offset-2 ring-offset-slate-900">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-50">
                <div className="flex gap-5 space-y-2">
                  <Avatar className="size-10 cursor-pointer rounded-full ring-2 ring-white ring-offset-2 ring-offset-slate-900">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                  <div>
                    <h4 className="font-medium ">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-600 my-2 ">
                  {user && user.role === "student" && (
                    <div className="flex w-fit items-center gap-2">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex w-fit items-center gap-2">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                  <div />
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <div className="absolute left-4 right-4 top-16 z-50 rounded-xl border border-cyan-200/20 bg-slate-900 p-4 shadow-xl md:hidden">
            <ul className="flex flex-col gap-3 font-medium">
              {(user?.role === "recruiter"
                ? [
                    ["Companies", "/admin/companies"],
                    ["Jobs", "/admin/jobs"],
                  ]
                : [
                    ["Home", "/"],
                    ["Jobs", "/jobs"],
                    ["Browse", "/browse"],
                  ]
              ).map(([label, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {!user && (
                <li className="flex gap-2 border-t border-slate-700 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button className="w-full bg-[#6A38C2]">Signup</Button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
