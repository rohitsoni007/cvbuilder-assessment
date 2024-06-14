import {
  Box,
  Button,
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
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { selectedResumeData } from "store/resumeSlice";

export default function Education({ activeStep, handleBack, handleNext }) {
  const theme = useTheme();
  const { selectedResume } = useSelector((state) => state.resume);
  const dispatch = useDispatch();

  console.log("~ selectedResume", selectedResume);

  const [initialValues, setInitialValues] = useState({
    education: [
      {
        degree: "",
        institute: "",
        percent: "",
        completedDate: ""
      }
    ],
    // submit: null,
  });


  useEffect(() => {
    if (selectedResume) {
      setInitialValues((prev) => {
        return {
          ...prev,
          education: selectedResume?.education?.length ? selectedResume?.education : [{
            degree: "",
            institute: "",
            percent: "",
            completedDate: ""
          }],
        };
      });
    }
  }, [selectedResume]);

  const resumeValidationSchema = Yup.object().shape({
    education: Yup.array()
    .of(
      Yup.object().shape({
        degree: Yup.string().max(255).required("Degree is required"),
        institute: Yup.string().max(255).required("Institute is required"),
        percent: Yup.number().max(100).required("Percent is required"),
        completedDate: Yup.date().required("Completed date is required"),
      })
    )
    
  });

  const handleForm = () => {
    handleNext();
  };

  const handleLiveChanges = (arr, index, e) => {

    const { name, value } = e;

    let copyArr = arr.map(item => {
      return {...item}
    })
    copyArr[index][name] = value
    let newData = {
        ...selectedResume,
        education: copyArr
        }
      

    dispatch(selectedResumeData(newData))
    
  }
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
              education: values?.education || [],
            };
            if (selectedResume?._id) {
              await dispatch(
                editResumeAction({
                  _id: selectedResume?._id,
                  type: "education",
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
          validateForm
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FieldArray
              name="education"
              render={(arrayHelpers) => (
                <Grid container spacing={0.5}>
                  {values.education && values.education.length > 0 ? (
                    values.education.map((friend, index) => (
                      
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
                            Education - {index +1}
                          </Typography>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`education.${index}.degree`}
                              label="Degree"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`education.${index}.institute`}
                              label="Institute"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`education.${index}.percent`}
                              label="Percent"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <DesktopDatePicker
                              label="Completed Date"
                              inputFormat="DD/YYYY"
                              views={['year', 'month']}
                              value={values?.education[index]?.completedDate || ''}
                              onChange={(e)=> {
                                setFieldValue(`education.${index}.completedDate`, e)
                              }}
                              renderInput={(params) => {
                                let currentError = null;
                                let currentTouched = null;
                                let current = null;
                                `education.${index}.completedDate`.split('.').map(sel=>{
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
                                return <TextField {...params} style={{width:'100%'}}/>
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                          {values?.education?.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              - Remove
                            </Button>
                          )}
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.insert(index+1, {
                                degree: "",
                                institute: "",
                                percent: "",
                                completedDate: ""
                              })} // insert an empty string at a position
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
                          degree: "",
                          institute: "",
                          percent: "",
                          completedDate: ""
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
