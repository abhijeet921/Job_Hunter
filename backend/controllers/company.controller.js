import { Company } from "../models/company.model.js";
import { uploadToS3 } from "../utils/s3.js";

//regrestration of company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(200).json({
      message: "company register successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//get company
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Compines not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//get company by id

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//update company

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(website && { website }),
      ...(location && { location }),
    };

    if (file) {
      try {
        updateData.logo = await uploadToS3(file, "job-portal/company-logos");
      } catch (error) {
        console.error("Company logo upload error:", error);
        return res.status(500).json({
          message: "Company logo upload failed",
          success: false,
          error: error.message,
        });
      }
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company information updated",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Company update failed",
      success: false,
      error: error.message,
    });
  }
};
