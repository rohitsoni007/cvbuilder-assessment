import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

import Routes from 'routes';

import themes from 'themes';

import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from 'react-facebook';


const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <>
      <ToastContainer />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <FacebookProvider appId={process.env.REACT_APP_FACEBOOK_APPID}>
                  <Routes />
                </FacebookProvider>
              </GoogleOAuthProvider>
            </LocalizationProvider>
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default App;
