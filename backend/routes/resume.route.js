var express = require("express");
var router = express.Router();
const resumeController = require("../controllers/resume.controller");
const validate = require("../middlewares/validate.middleware");
const handleResponse = require("../middlewares/handleResponse.middleware");
const { addValidation, getOneValidation, editValidation } = require("../validations/resume.validation");
const authorize = require("../middlewares/authorize.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/", authorize,  validate(addValidation), resumeController.add, handleResponse);
router.put("/:resumeId/:type", authorize, validate(editValidation), resumeController.edit, handleResponse);
router.delete("/:resumeId", authorize, resumeController.deleteOne, handleResponse);
router.get("/count", authorize, resumeController.getCount, handleResponse);
router.get("/:resumeId", authorize, validate(getOneValidation), resumeController.getOne, handleResponse);
router.get("/", authorize, resumeController.getAll, handleResponse);
router.post("/image", authorize, upload.single('image'), resumeController.uploadImage, handleResponse);

module.exports = router;
