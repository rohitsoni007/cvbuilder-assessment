import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

export default function FormikInputField({
  name,
  label,
  touched,
  values,
  errors,
  handleBlur,
  handleChange,
  type,
  endAdornment
}) {
    const theme = useTheme();
    let current = null
    let currentError = null
    let currentTouched = null
    name.split('.').map(item=>{
      if(current){
        current = current[item]
        currentError = currentError?.[item]
        currentTouched = currentTouched?.[item]
      }else{
        current = values[item]
        currentError = errors?.[item]
        currentTouched = touched?.[item]

      }
    })

    
  return (
    <FormControl
      fullWidth
      error={Boolean(touched[name] && errors[name])}
      sx={{ ...theme.typography.customInput }}
    >
      <InputLabel htmlFor={`outlined-adornment-${name}`}>{label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${name}`}
        type={type ? type: 'text'}
        value={current}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        label={label}
        endAdornment={endAdornment?endAdornment:<></>}
        inputProps={{}}
      />
      {currentTouched && currentError && (
        <FormHelperText error id={`standard-weight-helper-text-${name}`}>
          {currentError}
        </FormHelperText>
      )}
    </FormControl>
  );
}
