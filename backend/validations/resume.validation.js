const Joi = require("joi");

const addValidation = {
  body: {
    name: Joi.string().max(255).required(),
    email: Joi.string().max(255).required(),
    phone: Joi.string().max(255).required(),
    address: Joi.object({
      street: Joi.string().max(255).allow("", null).optional(),
      city: Joi.string().max(255).allow("", null).optional(),
      state: Joi.string().max(255).allow("", null).optional(),
      pincode: Joi.string().max(255).allow("", null).optional(),
    })
      .allow("", null)
      .optional(),
    introduction: Joi.string().max(255).allow("", null).optional(),
  },
};

const editValidation = {
  params: {
    resumeId: Joi.string().hex().length(24).required(),
    type: Joi.string()
      .valid(
        "basic",
        "education",
        "experience",
        "projects",
        "skills",
        "socialProfiles"
      )
      .required(),
    name: Joi.alternatives().conditional("type", {
        is: "basic",
        then: Joi.string().max(255).required(),
    }),
    email: Joi.alternatives().conditional("type", {
        is: "basic",
        then: Joi.string().email().max(255).required(),
    }),
    phone: Joi.alternatives().conditional("type", {
        is: "basic",
        then: Joi.number().required(),
    }),
    address: Joi.alternatives().conditional("type", {
        is: "basic",
        then: Joi.string().max(255).required(),
    }),
    introduction: Joi.alternatives().conditional("type", {
        is: "basic",
        then: Joi.string().max(255).required(),
    }),
    template: Joi.alternatives().conditional("type", {
        is: "basic",
        then: Joi.number().valid(1, 2).required(),
    }),
    education: Joi.alternatives().conditional("type", {
        is: "education",
        then: Joi.array().items({
          degree: Joi.string().max(255).allow('', null).optional(),
          institute: Joi.string().max(255).allow('', null).optional(),
          percent: Joi.string().max(255).allow('', null).optional(),
          completedDate: Joi.date().iso().allow('', null).optional(),
        }).optional(),
      }),
    experience: Joi.alternatives().conditional("type", {
        is: "experience",
        then: Joi.array().items({
          organization: Joi.string().max(255).allow('', null).optional(),
          location: Joi.string().max(255).allow('', null).optional(),
          position: Joi.string().max(255).allow('', null).optional(),
          ctc: Joi.number().allow('', null).optional(),
          joiningDate: Joi.date().iso().allow('', null).optional(),
          leavingDate: Joi.date().iso().allow('', null).optional(),
          technologies: Joi.string().max(255).allow('', null).optional(),
          description: Joi.string().max(1000).allow('', null).optional(),
        }).optional(),
    }),
    projects: Joi.alternatives().conditional("type", {
        is: "projects",
        then: Joi.array().items({
          title: Joi.string().max(255).allow('', null).optional(),
          size: Joi.string().max(255).allow('', null).optional(),
          duration: Joi.number().max(255).allow('', null).optional(),
          technologies: Joi.string().max(255).allow('', null).optional(),
          description: Joi.string().max(1000).allow('', null).optional(),
        }).optional(),
    }),
    skills: Joi.alternatives().conditional("type", {
        is: "skills",
        then: Joi.array().items({
          name: Joi.string().max(255).allow('', null).optional(),
          perfection: Joi.string().max(255).allow('', null).optional(),
        }).optional(),
    }),
    socialProfiles: Joi.alternatives().conditional("type", {
        is: "socialProfiles",
        then: Joi.array().items({
          platform: Joi.string().max(255).allow('', null).optional(),
          link: Joi.string().max(255).allow('', null).optional(),
        }).optional(),
    }),
  },
};

const getOneValidation = {
  params: {
    resumeId: Joi.string().hex().length(24).required(),
  },
};

module.exports = {
  addValidation,
  getOneValidation,
  editValidation,
};
