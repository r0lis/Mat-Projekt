import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

interface ContentProps {
  subteamId: string;
}

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getSubteamDetails(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        email
        role
        position
      }
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SubteamMember {
  email: string;
  role: string;
  position: string;
}

const Content: React.FC<ContentProps> = ({ subteamId }) => {
  const user = authUtils.getCurrentUser();

  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
    skip: !user,
  });

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <Typography>Chyba</Typography>;

  const subteam = data.getSubteamDetails;

  return (
    <Box sx={{marginTop:"1em", fontSize:"Roboto",}}>
      <Box sx={{boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)", width:"100%", padding:"15px 0px 15px 0px", borderRadius:"15px"}}>
        <Typography sx={{marginLeft:"5%", fontSize:"1.8em"}} >{subteam.Name}</Typography>
        <Typography sx={{fontSize:"1em", marginLeft:"5%"}} >hlavní tým</Typography>
      </Box>
      <Box sx={{marginTop:"1em", }}>
        <Button sx={{ backgroundColor:"#F0F2F5", boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)", marginRight:"2em"}}>
            <Typography sx={{color:"black", fontFamily:"Roboto"}}>Přehled</Typography>
        </Button>
        <Button sx={{ backgroundColor:"#F0F2F5", boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)", marginRight:"2em"}}>
            <Typography sx={{color:"black", fontFamily:"Roboto"}}>Nástěnka</Typography>
        </Button>
        <Button sx={{ backgroundColor:"#F0F2F5", boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)", marginRight:"2em"}}>
            <Typography sx={{color:"black", fontFamily:"Roboto"}}>Doházka</Typography>
        </Button>
        <Button sx={{ backgroundColor:"#F0F2F5", boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",}}>
            <Typography sx={{color:"black", fontFamily:"Roboto"}}>Členové</Typography>
        </Button>
      </Box>
      <Box sx={{boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)", width:"100%", padding:"26px 0px 26px 0px", borderRadius:"15px", marginTop:"1em", minHeight:"100vh"}}>
        <Typography sx={{marginLeft:"10%"}} variant="h4">Constefes</Typography>
        </Box>
    </Box>
  );
};

export default Content;
