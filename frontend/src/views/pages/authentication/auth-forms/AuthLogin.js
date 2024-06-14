import { useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
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
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Google from 'assets/images/icons/social-google.svg';
import Facebook from 'assets/images/icons/facebook.svg';
import { login, socialLogin } from 'utils/service';
import showNotification from 'utils/notificationService';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from 'utils/session';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useLogin } from 'react-facebook';
import FormikInputField from 'components/FormikInputField';


const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);

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
      console.log('~in');
      const response = await fbLogin({
        scope: 'public_profile email',
      });
      console.log('~in');

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

  const [showPassword, setShowPassword] = useState(false);
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
              disableElevation
              fullWidth
              id="google"
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign in with Google
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
              Sign in with Facebook
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
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
            <Typography variant="subtitle1">Sign in with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log('~ values', values);
            delete values.submit
            let resp = await login(values);
            console.log('~ resp', resp);
            if(resp?.data?.success){
              setToken(resp?.data?.data?.token)
              showNotification('success',resp.data.message)
              setStatus({ success: true });
              setSubmitting(false);
              navigate("/");
            }else{
             
              showNotification('error',resp?.response?.data?.message)
              setStatus({ success: false });
              setErrors({ submit: resp?.response?.data?.message });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
              showNotification('error',err.message)
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            
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
              

            
           

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
