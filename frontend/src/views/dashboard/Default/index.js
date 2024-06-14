import { useEffect, useState } from 'react';
import {  Grid } from '@mui/material';
import EarningCard from './EarningCard';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResumeCount } from 'utils/service';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.resume);

  useEffect(() => {
    const getResumeCounts = async() => {

      let resp = await getResumeCount();
      if(resp){
        setCount(resp?.data?.data?.count)
      }
      setLoading(false)
    }
    getResumeCounts();
  }, [])
  


  return (
   
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} count={count}/>
          </Grid>
          
        </Grid>
      </Grid>
      
    </Grid>
  );
};

export default Dashboard;
