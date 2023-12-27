/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { authUtils } from "@/firebase/auth.utils";
import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import React, { useState } from "react"; 
import TeamLogoImg from "../../public/assets/logotym.png";
import { useRouter } from "next/router";
import BasicError from "../teamPage/error/BasicError";
import Edit from "./Edit";

const GET_USER_INFO = gql`
  query GetUserInfo($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Id
      DateOfBirth
      Picture
    }
  }
`;

const GET_TEAM_NAMES = gql`
  query GetTeamNames($email: String!) {
    getUserTeamsByEmail(email: $email) {
      teamId
      Name
    }
  }
`;

const calculateAge = (dateOfBirth: string) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

type Team = {
  teamId: string;
  Name: string;
};

const Content: React.FC = () => {
  const user = authUtils.getCurrentUser();
  const router = useRouter();
  const { idUser } = router.query;
  const [editMode, setEditMode] = useState(false);

  const {
    loading: userInfoLoading,
    error: userInfoError,
    data: userInfoData,
  } = useQuery(GET_USER_INFO, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  const {
    loading: userIdLoading,
    error: userIdError,
    data: userTeamsData,
  } = useQuery(GET_TEAM_NAMES, {
    variables: { email: user?.email || "" },
  });

  const name = userInfoData?.getUserByNameAndSurname.Name || "";
  const surname = userInfoData?.getUserByNameAndSurname.Surname || "";
  const userPicture = userInfoData?.getUserByNameAndSurname.Picture || "";
  const initials = name[0] + surname[0];

  if (userInfoLoading || userIdLoading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );

  if (userIdError || userInfoError) return <Typography>Chyba</Typography>;

  const hoverStyle = {
    backgroundColor: "lightgray",
    "&:hover": {
      backgroundColor: "lightblue",
    },
  };

  if (
    !user ||
    (idUser && idUser !== userInfoData?.getUserByNameAndSurname.Id)
  ) {
    return <BasicError />;
  }

  const handleEditClick = () => {
    setEditMode(true); // Set editMode to true
  };

  const handleBackClick = () => {
    setEditMode(false); // Set editMode to false
  }

  return (
    <Box
      sx={{
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
        marginTop: "2em",
        padding: "2em",
        borderRadius: "10px",
      }}
    >
      <Box sx={{ display: "flex", marginBottom: "2em", marginLeft:"3em", marginRight:"3em" }}>
        <Typography sx={{ fontSize: "3em", fontWeight: "500" }}>
          {name} {surname}
        </Typography>
        <Avatar
          sx={{
            height: "5em",
            width: "5em",
            marginLeft: "auto",
           
          }}
          alt={initials}
          src={userPicture} // Set src to user's picture URL if it exists
        />
      </Box>
      {editMode === false ? (
      <><Box sx={{ marginBottom: "2em", marginLeft: "3em", marginRight: "3em" }}>
          <Typography sx={{ fontSize: "1.7em", fontWeight: "500" }}>
            Email:
          </Typography>
          <Typography sx={{ fontSize: "1.3em" }}>{user?.email}</Typography>
        </Box><Box sx={{ marginBottom: "2em", marginLeft: "3em", marginRight: "3em" }}>
            <Typography sx={{ fontSize: "1.7em", fontWeight: "500" }}>
              Datum narození:
            </Typography>
            <Typography sx={{ fontSize: "1.3em", }}>
              {userInfoData?.getUserByNameAndSurname.DateOfBirth &&
                new Date(
                  userInfoData?.getUserByNameAndSurname.DateOfBirth
                ).toLocaleDateString("cs-CZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
              /{" "}
              {calculateAge(
                userInfoData?.getUserByNameAndSurname?.DateOfBirth || ""
              )}{" "}
              let
            </Typography>
          </Box><Box sx={{ marginLeft: "3em", marginRight: "3em" }}>
            <Typography sx={{ fontSize: "1.7em", fontWeight: "500" }}>
              Týmy:
            </Typography>
            {userTeamsData &&
              userTeamsData.getUserTeamsByEmail &&
              userTeamsData.getUserTeamsByEmail.length > 0 ? (
              userTeamsData.getUserTeamsByEmail.map((team: Team, index: number) => (
                <Box
                  sx={{
                    marginBottom: "1em",
                    padding: "2%",
                    borderRadius: "10px",
                    ...hoverStyle,
                    border: "1px solid gray",
                  }}
                >
                  <Link
                    key={index}
                    href={`/Team/${team.teamId}`}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={TeamLogoImg.src}
                      alt="Team Logo"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "1em",
                      }} />
                    <div style={{ color: "black", fontSize: "1.3em", fontWeight: "600" }}>{team.Name}</div>
                  </Link>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  marginBottom: "1em",
                  padding: "3%",
                  borderRadius: "10px",
                  border: "1px solid gray",
                  backgroundColor: "lightgray",
                  marginLeft: "3em", marginRight: "3em"
                }}
              >
                Nepatříte do žádného klubu
              </Box>
            )}
          </Box><Box sx={{ marginTop: "2em", marginLeft: "3em", marginRight: "3em" }}>
            <Button onClick={handleEditClick}>Upravit</Button>
          </Box></>) : (
        <Box sx={{ marginTop: "2em",marginLeft:"3em", marginRight:"3em" }}>
          <Edit />
        <Button onClick={handleBackClick}>Zpět</Button>
        </Box>
      )}
    </Box>
  );
};

export default Content;
