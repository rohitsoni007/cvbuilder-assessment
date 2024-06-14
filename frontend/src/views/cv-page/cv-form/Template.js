import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTemplateData } from 'store/resumeSlice';

export default function Template({ activeStep, handleBack, handleNext, submitted, setSubmitted }) {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [submitted, setSubmitted] = useState(false);
    const { selectedResume, selectedTemplate } = useSelector((state) => state.resume);
    console.log('~ selectedResume', selectedResume);
    console.log('~ selected', selected);

    const handleSubmit = () => {
        setSubmitted(true);
        if(selected == 0){
            return;
        }
        handleNext();

    }
    useEffect(() => {
     if(selectedResume?.template){
        setSelected(selectedResume?.template);
        dispatch(selectedTemplateData(selectedResume?.template));
     }
    }, [selectedResume])
    

    
    const handleChange = (event) => {
        setSelected(event.target.value);
        dispatch(selectedTemplateData(event.target.value));
      };

  return (
    <>
        {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
            Step {activeStep + 1}
        </Typography> */}
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Template</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selected}
                label="Select Template"
                onChange={handleChange}
            >
                <MenuItem value={1}>Template 1</MenuItem>
                <MenuItem value={2}>Template 2</MenuItem>
            </Select>
            {(selected == 0 && submitted) && (
                <FormHelperText error>
                Please select a template
                </FormHelperText>
            )}
        </FormControl>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {/* <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button> */}
              {/* {!selectedTemplate && (
              <Box sx={{ flex: "1 1 auto" }} />
              <Button type="button" disabled={isSubmitting} sx={{ mr: 1 }} onClick={handleSubmit}>
                Continue
              </Button>
              )} */}
            </Box>
    </>
  )
}
