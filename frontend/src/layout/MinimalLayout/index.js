import { Outlet, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';


const MinimalLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.token;
    if(token){
      navigate('/')
    }
  }, [])
  return (
    <>
      <Outlet />
    </>
  )
}

export default MinimalLayout;
