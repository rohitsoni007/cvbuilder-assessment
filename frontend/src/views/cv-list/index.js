import { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteResumeAction, getAllResumeAction } from 'store/resumeActions';
import { selectedResumeData, selectedTemplateData } from 'store/resumeSlice';

const CVList = () => {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.resume);

  
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });



  useEffect(() => {
    dispatch(getAllResumeAction({limit: paginationModel.pageSize, page: paginationModel.page+1}))
  }, [])
  

  const onEdit = (params) => {
    dispatch(selectedResumeData(params?.row));
    navigate('/cv-page/'+params.id);
    
  }

  const onDelete = (params) => {
    dispatch(deleteResumeAction(params?.row?._id));
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 220, },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      editable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Action',
      description: 'Action',
      sortable: false,
      width: 160,
      renderCell: (params) => {
      return <>
        <Button variant="text" onClick={e=> onEdit(params)}><EditIcon/></Button>
        <Button variant="text" onClick={e=> onDelete(params)}><DeleteIcon style={{color:'red'}}/></Button>
        
      </>

      }

      // valueGetter: (params) =>
      
        // `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];


  useEffect(() => {
    setLoading(false);
  }, []);

  const handleClickAdd = () => {
    dispatch(selectedResumeData(null));
    dispatch(selectedTemplateData(null));
    navigate('/cv-page');

  }

  return (
    <MainCard title="CV List">
      <Box sx={{margin: 2, flex:1}}>
        <Button onClick={handleClickAdd} style={{marginLeft: "auto"}} variant="contained" type='primary'><AddIcon/>Add CV</Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        getRowId={(row) => row._id}
        rows={data?.rows || []}
        columns={columns}
        rowCount={data?.count || 0}
        loading={isLoading}
        pageSizeOptions={[5]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
      />
    </Box>

    </MainCard>
    // <Grid container spacing={gridSpacing}>
    //   <Grid item xs={12}>
    //     <Grid container spacing={gridSpacing}>
    //       <Grid item lg={4} md={6} sm={6} xs={12}>
    //         <EarningCard isLoading={isLoading} />
    //       </Grid>
          
    //     </Grid>
    //   </Grid>
      
    // </Grid>
  );
};

export default CVList;
