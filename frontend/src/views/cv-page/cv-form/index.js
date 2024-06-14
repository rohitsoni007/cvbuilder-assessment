import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Button, CircularProgress, FormHelperText, Paper, StepButton, Typography } from "@mui/material";
import BasicDetail from "./BasicDetail";
import Education from "./Education";
import Experience from "./Experience";
import Project from "./Project";
import Skill from "./Skill";
import SocialProfile from "./SocialProfile";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getOneResumeAction } from "store/resumeActions";
import { useEffect } from "react";
import { forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
// import Template from "./Template";
// import Stripe from "./Stripe";
import { addStripeIntent, confirmStripeCheckout } from "utils/service";
import { useState } from "react";

const steps = [
  "Basic Details",
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Social Profiles",
];

const CVForm = forwardRef((props, ref) =>{
  let { id } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();

  const [paymentError, setPaymentError] = useState('')

  const isStripe = searchParams.get("stripe");
  const stripeSessionId = searchParams.get("session_id");

  useEffect(() => {
    if(isStripe == 'confirm-payment' && stripeSessionId){

      setIsSubmitting(true);
      setPaymentError('');

      const checkPayment = async() => {
        let data = {
          sessionId: stripeSessionId
        }
        let check = await confirmStripeCheckout(data);
        if(check?.data?.data?.order?.status=='complete'){

          console.log('~ check.data.data.order.status', check.data.data.order.status);
          setIsSubmitting(false);
          
          handlePrint();
          console.log('~ loca', window.location.pathname);
          navigate(window.location.pathname)
        }else{
          setPaymentError('Unable to complete payment');
        }


      }
      checkPayment();

      //confirm
    }else if(isStripe == 'cancel-payment'){
      setPaymentError('You have clicked cancelled, try again later')
    }
  }, [isStripe, stripeSessionId])
  

  console.log('~ isStripe', isStripe);
  console.log('~ searchParams', stripeSessionId);
  console.log('~ id', id);

  
  

  const [activeStep, setActiveStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);
  const [completed, setCompleted] = React.useState({
    // 0:true,
    // 1:true,
    // 2:true,
    // 3:true,
    // 4:true,
    // 5:true,
  });

  useEffect(() => {
    if(id){
      setCompleted({
        0:true,
        1:true,
        2:true,
        3:true,
        4:true,
        5:true,
      })
      dispatch(getOneResumeAction(id))
    }
  }, [id])

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    // const newActiveStep =
    //   isLastStep() && !allStepsCompleted()
    //     ? steps.findIndex((step, i) => !(i in completed))
    //     : activeStep + 1;
    // setActiveStep(activeStep + 1);
    // handleComplete();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;

    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

    const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const handleDownload = async() => {
    if(!isSubmitting){

      setIsSubmitting(true);
      let res = await addStripeIntent({resumeId: id});
      if(res){
  
        console.log('~ e download~ ', res?.data?.data?.url);
        window.location.href = res?.data?.data?.url;
        console.log('~ e after~ ', res?.data?.data?.url);
        setIsSubmitting(false);
      }
    }
    // handlePrint();
  };

  

  console.log("~ activeStep", activeStep);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }} variant="h4">
              Download & Edit Resume
            </Typography>
            <Box>
                Buy Pdf @ $1 per download
            </Box>
            <Box>
                Payment Method: Stripe
            </Box>
            {/* <Stripe /> */}
            <Box sx={{ display: 'flex' }}>
              {isSubmitting && (
                <CircularProgress style={{textAlign:'center', marginLeft: 170}} />
              )}
            </Box>
            {(!isSubmitting  && paymentError) && (
              <Box>
              <FormHelperText error>
                  {paymentError}
                  </FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  onClick={handleDownload} 
                  disableElevation disabled={isSubmitting} fullWidth size="large" type="button" variant="contained" color="secondary">
                  Pay & Download
                </Button>
              </AnimateButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Edit</Button>
            </Box>
          </>
        ) : (
          <>
          {/* {
            activeStep == 0 && (
                <Template
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          } */}
          {
            activeStep == 0 && (
                <BasicDetail
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          }
          {
            activeStep == 1 && (
                <Education
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          }
          {
            activeStep == 2 && (
                <Experience
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          }
          {
            activeStep == 3 && (
                <Project
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          }
          {
            activeStep == 4 && (
                <Skill
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          }
          {
            activeStep == 5 && (
                <SocialProfile
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleComplete}
                />
            )
          }
          </>
        )}
      </div>
    </Box>
  );
})

export default CVForm