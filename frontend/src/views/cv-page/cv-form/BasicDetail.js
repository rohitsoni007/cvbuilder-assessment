import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import AnimateButton from "ui-component/extended/AnimateButton";
import showNotification from "utils/notificationService";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";
import FormikInputField from "components/FormikInputField";
import FormikTextAreaField from "components/FormikTextAreaField";
import { useDispatch, useSelector } from "react-redux";
import { addResumeAction, editResumeAction } from "store/resumeActions";
import { addResume, addResumeImage, editResume } from "utils/service";
import Template from "./Template";
import { useRef } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { selectedResumeData, selectedTemplateData } from "store/resumeSlice";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  position: 'relative',
  color: theme.palette.text.secondary,
}));


export default function BasicDetail({ activeStep, handleBack, handleNext }) {
  const theme = useTheme();
  const { selectedResume, selectedTemplate } = useSelector((state) => state.resume);
  const dispatch = useDispatch();
  const imageRef = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState(null);
  console.log("~ selectedResume", selectedResume, selectedTemplate);

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    introduction: "",
    submit: null,
  });

  useEffect(() => {
    if (selectedResume) {
      setInitialValues((prev) => {
        return {
          ...prev,
          name: selectedResume?.name || "",
          email: selectedResume?.email || "",
          phone: selectedResume?.phone || "",
          street: selectedResume?.address?.street || "",
          city: selectedResume?.address?.city || "",
          state: selectedResume?.address?.state || "",
          pincode: selectedResume?.address?.pincode || "",
          introduction: selectedResume?.introduction || "",
        };
      });
    }
  }, [selectedResume]);

  const resumeValidationSchema = Yup.object().shape({
    name: Yup.string().max(255).required("Name is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    phone: Yup.string().max(255).required("Phone is required"),
    street: Yup.string().max(255).required("Address is required"),
    city: Yup.string().max(255).required("City is required"),
    state: Yup.string().max(255).required("State is required"),
    pincode: Yup.number().required("Pincode is required"),
    introduction: Yup.string().max(1000).required("Introduction is required"),
  });

  const handleForm = () => {
    handleNext();
  };

  
  const handleFile = async(e) => {
    const  { files, value } = e.target
    setImage(URL.createObjectURL(e.target.files[0]));

    let formData = new FormData();
    for (let item of files){
      formData.append('image', item);
    }
    let res = await addResumeImage(formData, selectedResume?._id);
    if(res){
      dispatch(selectedResumeData(res?.data?.data?.updatedResume))
      dispatch(selectedTemplateData(res?.data?.data?.updatedResume?.template))
    }
  };

  const handleClick = () => {
    imageRef.current.click();

  }

  const deleteImage = () => {
    imageRef.current.value = ''
    setImage(null)
  }

  const handleLiveChanges = (e) => {
    const { name, value } = e.target;
    let newData = {}
    if(['street','city','state','pincode'].includes(name)){
      newData = {
        ...selectedResume,
        address:{
          ...selectedResume?.address,
          [name]: value
        }
      }

    }else{

      newData = {
        ...selectedResume,
        [name]: value
      }
    }
    dispatch(selectedResumeData(newData))
    
  }

  return (
    <>
      <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
        Step {activeStep + 1}
      </Typography>
      <Template
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleNext}
        setSubmitted={setSubmitted}
        submitted={submitted}
      />
      
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
              name: values?.name || "",
              email: values?.email || "",
              phone: values?.phone || "",
              address: {
                street: values?.street || '',
                city: values?.city || '',
                state: values?.state || '',
                pincode: values?.pincode || '',
                
              },
              introduction: values?.introduction || "",
              template: selectedTemplate
            }
            if (selectedResume?._id) {
              await dispatch(
                editResumeAction({_id:selectedResume?._id, type: "basic", data})
                // resp = editResume()
                );
              } else {
                // resp = addResume()
              await dispatch(addResumeAction(data));
            }
            // if (resp?.data?.success) {
              // showNotification('success',resp.data.message)
              setStatus({ success: true });
              setSubmitting(false);
              handleNext();
              // navigate("/");
            // } else {
              // showNotification('error',resp?.response?.data?.message)
              
            // }
          } catch (err) {
            console.error('~ err', err);
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
          <form noValidate onSubmit={
            e=>{
              e.preventDefault();
              setSubmitted(true);
              if(selectedTemplate){
                handleSubmit(e);
              }

            }
            }>
            
            <Grid container>
              <Grid item sm={12}>
                <Item >
                  <Avatar onClick={handleClick} src={image || `${process.env.REACT_APP_API_URL}/${selectedResume?.image}`} style={{ height: 100, width: 100, cursor:'pointer'}}/>
                  <input type="file" onChange={handleFile} ref={imageRef} style={{display: 'none'}}/>
                  {/* {(image || selectedResume?.image) && (
                    <CancelIcon onClick={deleteImage} style={{cursor:'pointer', position:'absolute', left: 85, top:0}} />                
                  )} */}
                </Item>

              </Grid>
            </Grid>
            <FormikInputField
              name="name"
              label="Name"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={(e)=>{
                handleChange(e)
                handleLiveChanges(e)
              }}
            />
            <FormikInputField
              name="email"
              label="Email"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={(e)=>{
                handleChange(e)
                handleLiveChanges(e)
              }}
            />
            <FormikInputField
              name="phone"
              label="Phone"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={(e)=>{
                handleChange(e)
                handleLiveChanges(e)
              }}
              type="number"
            />
            <Grid container spacing={0.5}>
              <Grid item xs={12} sm={6}>
                <FormikInputField
                  name="street"
                  label="Address"
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(e)=>{
                    handleChange(e)
                    handleLiveChanges(e)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikInputField
                  name="city"
                  label="City"
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(e)=>{
                    handleChange(e)
                    handleLiveChanges(e)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikInputField
                  name="state"
                  label="State"
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(e)=>{
                    handleChange(e)
                    handleLiveChanges(e)
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikInputField
                  name="pincode"
                  label="Pincode"
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={(e)=>{
                    handleChange(e)
                    handleLiveChanges(e)
                  }}
                  type="number"
                />
              </Grid>
            </Grid>
            <FormikTextAreaField
              name="introduction"
              label="Introduction"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={(e)=>{
                handleChange(e)
                handleLiveChanges(e)
              }}
            />

            {/* {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )} */}

            {/* <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box> */}
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
