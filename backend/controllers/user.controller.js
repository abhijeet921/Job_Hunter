import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToS3 } from "../utils/s3.js";

//registration
export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;
    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const file = req.file;
    let profilePhotoUrl = null;

    if (file) {
      try {
        const uploaded = await uploadToS3(file, "job-portal/profile-photos");
        profilePhotoUrl =
          typeof uploaded === "string" ? uploaded : uploaded?.url;
      } catch (error) {
        console.error("Profile photo upload error:", error);
        return res.status(500).json({
          message: `Photo upload failed: ${error.message}`,
          success: false,
        });
      }
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile: {
        profilePhoto: profilePhotoUrl || null,
      },
    });
    return res
      .status(200)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Registration failed",
      success: false,
      error: error.message,
    });
  }
};

//login

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    //check role is correct as not

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doen't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcom back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

//logout

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//save or remove a job from the authenticated user's saved jobs
export const toggleSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const savedJobIndex = user.savedJobs.findIndex(
      (savedJob) => savedJob.toString() === jobId,
    );

    if (savedJobIndex === -1) {
      user.savedJobs.push(jobId);
    } else {
      user.savedJobs.splice(savedJobIndex, 1);
    }

    await user.save();

    return res.status(200).json({
      message:
        savedJobIndex === -1
          ? "Job saved for later"
          : "Job removed from saved jobs",
      saved: savedJobIndex === -1,
      savedJobs: user.savedJobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Could not update saved job",
      success: false,
    });
  }
};

//updateprofile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const profilePhotoFile = req.files?.profilePhoto?.[0] || req.file;
    const resumeFile = req.files?.resume?.[0];

    let profilePhotoUrl = null;
    let resumeUrl = null;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (profilePhotoFile) {
      try {
        profilePhotoUrl = await uploadToS3(
          profilePhotoFile,
          "job-portal/profile-photos",
        );
      } catch (error) {
        console.error("Profile photo upload error:", error);
        return res.status(500).json({
          message: "Profile photo upload failed",
          success: false,
          error: error.message,
        });
      }
    }

    if (resumeFile) {
      try {
        resumeUrl = await uploadToS3(resumeFile, "job-portal/resumes");
      } catch (error) {
        console.error("Resume upload error:", error);
        return res.status(500).json({
          message: "Resume upload failed",
          success: false,
          error: error.message,
        });
      }
    }

    let skillsArray = null;
    if (skills) {
      skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    if (profilePhotoUrl) {
      user.profile.profilePhoto = profilePhotoUrl;
    }

    if (resumeUrl) {
      user.profile.resume = resumeUrl;
      user.profile.resumeOriginalName = resumeFile.originalname;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Profile update failed",
      success: false,
      error: error.message,
    });
  }
};
