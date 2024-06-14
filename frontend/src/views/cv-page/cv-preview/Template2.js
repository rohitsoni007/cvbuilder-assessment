import {
  Avatar,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
  linearProgressClasses,
} from "@mui/material";
import React from "react";
import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  width: 100,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const Template2 = forwardRef(({ data }, ref) => {
  console.log("~ data", data);
  return (
    <div ref={ref} style={{ padding: 20, margin: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h3">Resume</Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="p" style={{ textAlign: "left" }}>
              {data?.introduction ||
                `Id ipsum consequat occaecat pariatur. Irure ad duis aliqua ad reprehenderit nulla Lorem excepteur laboris fugiat. Reprehenderit velit minim laboris ad deserunt.`}
            </Typography>
          </Item>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Item>
              <Avatar src={`${process.env.REACT_APP_API_URL}/${data?.image}`} style={{ height: 100, width: 100, }}/>
                <Typography variant="h4" style={{ textAlign: "left" }}>
                  {data?.name || "John Doe"}
                </Typography>
                
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    textAlign: "left",
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Reach me on:
                    </ListSubheader>
                  }
                >
                  {data?.socialProfiles?.map((item, index) => (
                    <ListItemText
                      key={index}
                      primary={`${item?.platform}: ${item?.link}`}
                    />
                  ))}
                  {!data?.socialProfiles && (
                    <>
                      <ListItemText primary="Twitter: https://www.twitter.com/lorem-ipsum" />
                      <ListItemText primary="Github: https://github.com/lorem-ipsum" />
                    </>
                  )}
                  <ListItemText primary={data?.email || "test@yopmail.com"} />
                  <ListItemText primary={data?.phone || "1234567890"} />
                  <ListItemText
                    primary={
                      data?.address
                        ? `
                            ${data?.address?.street}, 
                            ${data?.address?.city},
                            ${data?.address?.state},
                            ${data?.address?.pincode}
                            `
                        : "Mumbai, Maharashtra."
                    }
                  />
                </List>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Typography variant="h5" style={{ textAlign: "left" }}>
                  Skills
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    textAlign: "left",
                    
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  {data?.skills?.map((item, index) => (
                    <ListItem key={index} sx={{pl: 0,}}>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          {item?.name}:
                        </Grid>
                        <Grid item xs={8}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={item?.perfection || 0}
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                  {!data?.skills && (
                    <>
                      <ListItem>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            Skill 1:
                          </Grid>
                          <Grid item xs={6}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={40}
                            />
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            Skill 2:
                          </Grid>
                          <Grid item xs={6}>
                            <BorderLinearProgress
                              variant="determinate"
                              value={50}
                            />
                          </Grid>
                        </Grid>
                      </ListItem>
                    </>
                  )}
                </List>
              </Item>
            </Grid>
          </Grid>
            {/* //seplat */}
          <Grid item xs={6} sx={{borderLeft:'1px solid gray'}}>
            <Grid item xs={12}>
              <Item>
                <Typography variant="h5" style={{ textAlign: "left" }}>
                  Education
                </Typography>
                {data?.education?.map((item, index) => (
                  <List
                    key={index}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      textAlign: "left",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {item.degree || "Degree Name"} | {item?.completedDate
                          ? dayjs(item?.completedDate).format("MM/YYYY")
                          : ""}
                      </ListSubheader>
                    }
                  >
                    <ListItemText
                      primary={`Institute: ${item?.institute || "Institute name"}`}
                    />
                    <ListItemText primary={`Percent: ${item?.percent || "75"}%`} />
                    
                  </List>
                ))}
                {!data?.education && (
                  <>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        textAlign: "left",
                      }}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                          {"Degree Name"} | 02/2012
                        </ListSubheader>
                      }
                    >
                      <ListItemText primary={`Institute: Institute name`} />
                      <ListItemText primary={`Percent: ${"75"}%`} />
                    </List>
                  </>
                )}
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Typography variant="h5" style={{ textAlign: "left" }}>
                  Experience
                </Typography>
                {data?.experience?.map((item, index) => (
                  <List
                    key={index}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      textAlign: "left",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {item.organization} |  {item?.joiningDate
                          ? dayjs(item?.joiningDate).format("MM/YYYY")
                          : ""} - {item?.leavingDate
                            ? dayjs(item?.leavingDate).format("MM/YYYY")
                            : ""}
                      </ListSubheader>
                    }
                  >
                    <ListItemText primary={`Location: ${item?.location}`} />
                    <ListItemText primary={`Position: ${item?.position}`} />
                    <ListItemText primary={`CTC: ${item?.ctc}`} />
                    <ListItemText primary={`Technologies: ${item?.technologies}`} />
                    <ListItem>
                      <Typography variant="p" style={{ textAlign: "left" }}>
                        {item?.description}
                      </Typography>
                    </ListItem>
                  </List>
                ))}
                {!data?.experience && (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      textAlign: "left",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {"Organization Name"} | 02/2012 - 02-2013
                      </ListSubheader>
                    }
                  >
                    <ListItemText primary={`Location: ${"Location"}`} />
                    <ListItemText primary={`Position: ${"Position"}`} />
                    <ListItemText primary={`CTC: ${"3 lpa"}`} />
                    <ListItemText
                      primary={`Technologies: ${"technology 1, technology 2"}`}
                    />
                    <ListItem>
                      <Typography variant="p" style={{ textAlign: "left" }}>
                        {`Dolore do non nulla amet cillum mollit culpa nostrud. Dolor ipsum reprehenderit ipsum exercitation qui cupidatat tempor labore magna exercitation minim sint non. Voluptate mollit nisi duis sint enim. Dolore incididunt do aliquip cupidatat. Aliquip sint laborum qui labore pariatur aliqua adipisicing sit aute. Commodo irure eiusmod esse ipsum minim cillum esse cillum excepteur.`}
                      </Typography>
                    </ListItem>
                  </List>
                )}
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Typography variant="h5" style={{ textAlign: "left" }}>
                  Projects
                </Typography>
                {data?.projects?.map((item, index) => (
                  <List
                    key={index}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      textAlign: "left",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {item?.title} | Duration: {item?.duration}
                      </ListSubheader>
                    }
                  >
                    <ListItemText primary={`Team Size: ${item?.size}`} />
                    <ListItemText primary={`Technologies: ${item?.technologies}`} />
                    <ListItem>
                      <Typography variant="p" style={{ textAlign: "left" }}>
                        {item?.description}
                      </Typography>
                    </ListItem>
                  </List>
                ))}
                {!data?.projects && (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      textAlign: "left",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Project Name | Duration: 1
                      </ListSubheader>
                    }
                  >
                    <ListItemText primary={`Team Size: 1`} />
                    <ListItemText
                      primary={`Technologies: technology 1, technology 2`}
                    />
                    <ListItemText primary={`CTC: 3 lpa`} />
                    <ListItem>
                      <Typography variant="p" style={{ textAlign: "left" }}>
                        Ullamco pariatur dolore cupidatat nulla laborum velit eu
                        mollit commodo duis velit aliqua pariatur. Sint non mollit
                        consequat aute non sunt excepteur. Non adipisicing excepteur
                        eiusmod fugiat amet Lorem aliqua. Nisi ullamco officia
                        adipisicing voluptate duis magna proident proident cupidatat
                        deserunt aliqua. Non esse ad tempor id cillum laboris quis
                        non aliquip ea sit. Est aliquip nostrud irure nisi aliquip
                        cillum ea.
                      </Typography>
                    </ListItem>
                  </List>
                )}
              </Item>
            </Grid>
          </Grid>
        </Grid>
        
        
        
        

        
      </Grid>
    </div>
  );
});

export default Template2;
