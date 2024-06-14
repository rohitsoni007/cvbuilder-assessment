import { useState, useEffect, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';


import * as Yup from 'yup';
import { Formik } from 'formik';

import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import Facebook from 'assets/images/icons/facebook.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
// import { strengthColor, strengthIndicator } from 'utils/password-strength';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signUp, socialLogin } from 'utils/service';
import showNotification from 'utils/notificationService';
import { useGoogleLogin } from '@react-oauth/google';
import { setToken } from 'utils/session';
import FormikInputField from 'components/FormikInputField';
import { useLogin } from 'react-facebook';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const googleHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('tokenResponse', tokenResponse)
        
        let data = {
          code: tokenResponse?.code
        }
  
        let resp = await socialLogin('google',data);
        if(resp){
          setToken(resp?.data?.data?.token)
          showNotification('success',resp.data.message)
          navigate("/");
        }
      } catch (error) {
        console.log('error', error);
      }
    },
    flow: 'auth-code',
  });

  const { login: fbLogin, status, isLoading, error} = useLogin();
  
  async function handleFBLogin() {
    try {
      const response = await fbLogin({
        scope: 'email',
      });

      let data = {
        code: response.authResponse.accessToken,
      }
      
      console.log('facebook response',response.status);

      let resp = await socialLogin('facebook', data);
      if(resp){
        setToken(resp?.data?.data?.token)
        showNotification('success',resp.data.message)
        navigate("/");
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  return (
    <>
      
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              variant="outlined"
              fullWidth
              onClick={googleHandler}
              size="large"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign up with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              id="facebook"
              onClick={handleFBLogin}
              size="large"
              variant="outlined"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Facebook} alt="facebook" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign Up with Facebook
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Button
              variant="outlined"
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`
              }}
              disableRipple
              disabled
            >
              OR
            </Button>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign up with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          username: '',
          contact: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          username: Yup.string().max(255).required('Username is required'),
          contact: Yup.string().max(255).optional(),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
              console.log('~ values', values);
              delete values.submit
              let resp = await signUp(values);
              console.log('~ resp', resp);
              if(resp?.data?.success){
                showNotification('success',resp.data.message)
                setStatus({ success: true });
                setSubmitting(false);
                navigate("/login");
              }else{
               
                showNotification('error',resp?.response?.data?.message)
                setStatus({ success: false });
                setErrors({ submit: resp?.response?.data?.message });
                setSubmitting(false);
              }
          } catch (err) {
              console.error('err', err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                
                <FormikInputField
                  name="firstName"
                  label="First Name"
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                
                <FormikInputField
                  name="lastName"
                  label="Last Name"
                  touched={touched}
                  errors={errors}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Grid>
            </Grid>
            
            <FormikInputField
              name="email"
              label="Email"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            
            <FormikInputField
              name="username"
              label="Username"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />

            <FormikInputField
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormikInputField
              name="contact"
              label="Contact"
              touched={touched}
              errors={errors}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />

            
            {/* {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )} */}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
