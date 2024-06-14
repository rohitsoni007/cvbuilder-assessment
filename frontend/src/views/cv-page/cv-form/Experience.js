import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import AnimateButton from "ui-component/extended/AnimateButton";
import showNotification from "utils/notificationService";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import FormikInputField from "components/FormikInputField";
import FormikTextAreaField from "components/FormikTextAreaField";
import { useDispatch, useSelector } from "react-redux";
import { addResumeAction, editResumeAction } from "store/resumeActions";
import { addResume, editResume } from "utils/service";
// import { DatePicker } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function Experience({ activeStep, handleBack, handleNext }) {
  const theme = useTheme();
  const { selectedResume } = useSelector((state) => state.resume);
  const dispatch = useDispatch();

  console.log("~ selectedResume", selectedResume);

  const [initialValues, setInitialValues] = useState({
    experience: [
      {
        organization: "",
        location: "",
        position: "",
        ctc: "",
        joiningDate: "",
        leavingDate: "",
        technologies: "",
        description: "",
      },
    ],
    // submit: null,
  });

  useEffect(() => {
    if (selectedResume) {
      setInitialValues((prev) => {
        return {
          ...prev,
          experience: selectedResume?.experience?.length ? selectedResume?.experience: [
            {
              organization: "",
              location: "",
              position: "",
              ctc: "",
              joiningDate: "",
              leavingDate: "",
              technologies: "",
              description: "",
            },
          ],
        };
      });
    }
  }, [selectedResume]);

  const resumeValidationSchema = Yup.object().shape({
    experience: Yup.array()
    .of(
      Yup.object().shape({
       
        organization: Yup.string().max(255).required("Organization is required"),
        location: Yup.string().max(255).required("Location is required"),
        position: Yup.string().max(255).required("Position is required"),
        ctc: Yup.number().required("CTC is required"),
        joiningDate: Yup.date().required("Joining date is required"),
        leavingDate: Yup.date().required("Leaving date is required"),
        technologies: Yup.string().max(500).required("Technologies is required"),
        description: Yup.string().max(500).required("Description is required"),
      })
    ),
  });

  const handleForm = () => {
    handleNext();
  };
  return (
    <>
      <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
        Step {activeStep + 1}
      </Typography>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={resumeValidationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log("~ values", values);
            delete values.submit;
            let resp = null;
            console.log("~ selectedResume?._id", selectedResume?._id);

            let data = {
              experience: values?.experience || [],
            };
            if (selectedResume?._id) {
              await dispatch(
                editResumeAction({
                  _id: selectedResume?._id,
                  type: "experience",
                  data,
                })
              );
            } else {
              await dispatch(addResumeAction(data));
            }
            setStatus({ success: true });
            setSubmitting(false);
            handleNext();
          } catch (err) {
            console.error("~ err", err);
            setStatus({ success: false });
            setErrors({ submit: err?.response?.data?.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FieldArray
              name="experience"
              render={(arrayHelpers) => (
                <Grid container spacing={0.5}>
                  {values.experience && values.experience.length > 0 ? (
                    values.experience.map((friend, index) => (
                        // {/* <div key={index}> */}
                        <Grid
                          key={index}
                          container
                          sx={{ mt: 2, mb: 1, py: 1 }}
                          spacing={0.5}
                          style={{
                            border: "1px solid rgb(211, 211, 211)",
                            borderRadius: 25,
                            padding: 10,
                          }}
                        >
                          <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                            Experience - {index + 1}
                          </Typography>
                         
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`experience.${index}.organization`}
                              label="Organization"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`experience.${index}.location`}
                              label="Location"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`experience.${index}.position`}
                              label="Position"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`experience.${index}.ctc`}
                              label="ctc"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                              type="number"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                           
                            <DesktopDatePicker
                              label="Joining Date"
                              inputFormat="DD/YYYY"
                              views={["year", "month"]}
                              value={
                                values?.experience[index]?.joiningDate || ""
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `experience.${index}.joiningDate`,
                                  e
                                );
                                console.log(
                                  "~ values.experience[index]",
                                  values.experience[index]
                                );
                              }}
                              renderInput={(params) => {
                                let currentError = null;
                                let currentTouched = null;
                                let current = null;
                                `experience.${index}.joiningDate`.split('.').map(sel=>{
                                  if(current){
                                    current = current[sel]
                                    currentError = currentError?.[sel]
                                    currentTouched = currentTouched?.[sel]
                                  }else{
                                    current = values[sel]
                                    currentError = errors?.[sel]
                                    currentTouched = touched?.[sel]

                                  }
                                })
                                if(currentError && currentTouched){
                                  params.error = true
                                }else{
                                  params.error = false
                                }
                                return <TextField {...params} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DesktopDatePicker
                              label="Leaving Date"
                              inputFormat="DD/YYYY"
                              views={["year", "month"]}
                              value={
                                values?.experience[index]?.leavingDate || ""
                              }
                              onChange={(e) => {
                                console.log("~ e", e);
                                setFieldValue(
                                  `experience.${index}.leavingDate`,
                                  e
                                );
                              }}
                              renderInput={(params) => {
                                let currentError = null;
                                let currentTouched = null;
                                let current = null;
                                `experience.${index}.leavingDate`.split('.').map(sel=>{
                                  if(current){
                                    current = current[sel]
                                    currentError = currentError?.[sel]
                                    currentTouched = currentTouched?.[sel]
                                  }else{
                                    current = values[sel]
                                    currentError = errors?.[sel]
                                    currentTouched = touched?.[sel]

                                  }
                                })
                                if(currentError && currentTouched){
                                  params.error = true
                                }else{
                                  params.error = false
                                }
                                return <TextField {...params} />
                              }}
                            />
                            {/* <FormikInputField
                              name={`experience.${index}.leavingDate`}
                              label="leavingDate"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            /> */}
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`experience.${index}.technologies`}
                              label="technologies"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`experience.${index}.description`}
                              label="description"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            {values?.experience?.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                              >
                                - Remove
                              </Button>

                            )}
                            <Button
                              type="button"
                              onClick={() =>
                                arrayHelpers.insert(index + 1, {
                                  organization: "",
                                  location: "",
                                  position: "",
                                  ctc: "",
                                  joiningDate: "",
                                  leavingDate: "",
                                  technologies: "",
                                  description: "",
                                })
                              } // insert an empty string at a position
                            >
                              + Add
                            </Button>
                          </Grid>
                        </Grid>
                    ))
                  ) : (
                    <Button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          organization: "",
                          location: "",
                          position: "",
                          ctc: "",
                          joiningDate: "",
                          leavingDate: "",
                          technologies: "",
                          description: "",
                        })
                      }
                    >
                      + Add
                    </Button>
                  )}
                </Grid>
              )}
            />

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button type="submit" disabled={isSubmitting} sx={{ mr: 1 }}>
                Next
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}
