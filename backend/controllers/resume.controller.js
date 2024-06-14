const Resume = require("../models/resume.model");
const { createResponse } = require("../utils/commonFunctions.util");
const { MESSAGES } = require("../utils/constant.util");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY, GOOGLE_CLIENT_ID } = process.env;

const _resume = {};

_resume.add = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email, phone, address, introduction, template } = req.body;

    const dataToAdd = {
      name,
      email,
      phone,
      address,
      introduction,
      template,
      addedBy: _id,
    };

    let resume = await new Resume(dataToAdd).save();

    const resp = {
      resume,
    };

    createResponse(req, true, MESSAGES.ADDED("Resume"), resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};


_resume.uploadImage = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { resumeId } = req.query;

    if(!req.file){
      throw {message:'Unable to upload'}
    }
    let { filename } = req.file;


    let fullFileName = 'images/'+ filename;
    
    let resume =null;
    if(!resumeId){
      const dataToAdd = {
        // name,
        // email,
        // phone,
        // address,
        // introduction,
        // template,
        image: fullFileName,
        addedBy: _id,
      };
  
      resume = await new Resume(dataToAdd).save();
    }else{
      resume = await Resume.findById(resumeId);
      if(resume){
        resume.image = fullFileName;
        resume = await resume.save();
      }
    }

    const resp = {
      updatedResume: resume,
    };

    createResponse(req, true, MESSAGES.UPDATED("Resume"), resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};

_resume.edit = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { resumeId, type } = req.params;
    const {
      name,
      email,
      phone,
      address,
      introduction,
      education,
      experience,
      projects,
      skills,
      socialProfiles,
      template
    } = req.body;

    let resume = await Resume.findById(resumeId).lean();

    if (!resume) {
      throw { message: "Not Found" };
    }

    let dataToUpdate = {};
    if (type == "basic") {
      dataToUpdate = {
        name,
        email,
        phone,
        address,
        introduction,
        template
      };
    }

    if (type == "education") {
      dataToUpdate = {
        education,
      };
    }

    if (type == "experience") {
      dataToUpdate = {
        experience,
      };
    }

    if (type == "projects") {
      dataToUpdate = {
        projects,
      };
    }

    if (type == "skills") {
      dataToUpdate = {
        skills,
      };
    }

    if (type == "socialProfiles") {
      dataToUpdate = {
        socialProfiles,
      };
    }

    dataToUpdate["updatedBy"] = _id;

    let options = { new: true };

    let updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      dataToUpdate,
      options
    );

    const resp = {
      updatedResume,
    };

    createResponse(req, true, MESSAGES.UPDATED("Resume"), resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};

_resume.deleteOne = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { resumeId } = req.params;
    
    let resume = await Resume.findById(resumeId).lean();

    if (!resume) {
      throw { message: MESSAGES.NO_DATA };
    }

    let dataToUpdate = {
      isDeleted: true,
      deletedBy: _id
    }

    let options = { new: true };

    let updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      dataToUpdate,
      options
    );

    const resp = {
      updatedResume,
    };

    createResponse(req, true, MESSAGES.DELETED("Resume"), resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};




_resume.getOne = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { resumeId } = req.params;

    let resume = await Resume.findById(resumeId).lean();

    if (!resume) {
      throw { message: "Not Found" };
    }

    const resp = {
      resume,
    };

    createResponse(req, true, "", resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};

_resume.getAll = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let { limit, page } = req.query;

    let find = {
      isDeleted: false,
      addedBy: _id,
    };

    let rows = [];

    const count = await Resume.countDocuments(find);

    if (limit) {
      limit = limit || 10;
      page = page || 1;

      const skip = (page - 1) * limit;

      rows = await Resume.find(find)
        .select({
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
        })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean();
    } else {
      rows = await Resume.find(find)
        .select({
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
        })
        .sort({ createdAt: -1 })
        .lean();
    }

    const resp = {
      rows,
      count,
    };

    createResponse(req, true, "", resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};

_resume.getCount = async (req, res, next) => {
  try {
    const { _id } = req.user;

    let find = {
      isDeleted: false,
      addedBy: _id,
    };

    const count = await Resume.countDocuments(find);

    const resp = {
      count,
    };

    createResponse(req, true, "", resp);
    return next();
  } catch (error) {
    createResponse(req, false, error.message || MESSAGES.ERROR);
    return next();
  }
};

module.exports = _resume;
