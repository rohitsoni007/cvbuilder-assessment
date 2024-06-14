// material-ui
import { Grid, Paper, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import CVForm from './cv-form';
import PreviewCV from './cv-preview';
import { useRef } from 'react';



const CVPage = () => {
  const componentRef = useRef();

  return(

  
  // <MainCard title="Add  CV">
    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={0.5}>
            <Grid item xs={6} md={6}>
              {/* <Paper
                sx={{
                  height: 140,
                  width: 100,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
              />
              dd */}
              <MainCard title="Add  CV">
                <CVForm ref={componentRef}/>
              </MainCard>
            </Grid>
            <Grid item xs={6} md={6}>
              {/* <Paper
                sx={{
                  height: 140,
                  width: 100,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
              />
              dd */}
              <MainCard title="Preview CV" style={{minHeight: 550, backgroundColor:'none'}}>
                <PreviewCV ref={componentRef}/>
              </MainCard>
            </Grid>
        </Grid>
      </Grid>
      </Grid>
  // </MainCard>
  )
            };

export default CVPage;
