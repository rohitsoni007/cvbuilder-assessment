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
// import AnimateButton from "ui-component/extended/AnimateButton";
// import showNotification from "utils/notificationService";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import FormikInputField from "components/FormikInputField";
import FormikTextAreaField from "components/FormikTextAreaField";
import { useDispatch, useSelector } from "react-redux";
import { addResumeAction, editResumeAction } from "store/resumeActions";
// import { addResume, editResume } from "utils/service";

export default function SocialProfile({ activeStep, handleBack, handleNext }) {
  const theme = useTheme();
  const { selectedResume } = useSelector((state) => state.resume);
  const dispatch = useDispatch();

  console.log("~ selectedResume", selectedResume);

  const [initialValues, setInitialValues] = useState({
    socialProfiles: [
      {
        platform: "",
        link: "",
      },
    ],
    // submit: null,
  });

  useEffect(() => {
    if (selectedResume) {
      setInitialValues((prev) => {
        return {
          ...prev,
          socialProfiles: selectedResume?.socialProfiles?.length ? selectedResume?.socialProfiles: [
            {
              platform: "",
              link: "",
            },
          ],
        };
      });
    }
  }, [selectedResume]);

  const resumeValidationSchema = Yup.object().shape({
    socialProfiles: Yup.array()
    .of(
      Yup.object().shape({
        platform: Yup.string().max(255).required("Platform is required"),
        link: Yup.string().max(10000).required("Link is required"),
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
              socialProfiles: values?.socialProfiles || [],
            };
            if (selectedResume?._id) {
              await dispatch(
                editResumeAction({
                  _id: selectedResume?._id,
                  type: "socialProfiles",
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
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <FieldArray
              name="socialProfiles"
              render={(arrayHelpers) => (
                <Grid container spacing={0.5}>
                  {values.socialProfiles && values.socialProfiles.length > 0 ? (
                    values.socialProfiles.map((friend, index) => (
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
                            Social Profiles - {index + 1}
                          </Typography>

                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`socialProfiles.${index}.platform`}
                              label="Platform"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormikInputField
                              name={`socialProfiles.${index}.link`}
                              label="Link"
                              touched={touched}
                              errors={errors}
                              values={values}
                              handleBlur={handleBlur}
                              handleChange={handleChange}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12}>
                          {values?.socialProfiles?.length > 1 && (
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
                                  platform: "",
                                  link: "",
                                })
                              }
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
                          platform: "",
                          link: "",
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
