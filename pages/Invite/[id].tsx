/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import photo from "../../public/assets/rosterbot.png";
import pictureBackground from "../../public/assets/uvodni.jpg";
import { Alert, Box, Button, CircularProgress, Link, Typography } from "@mui/material";
import { gql, useQuery } from "@apollo/client";

const CHECK_USER_MEMBERSHIP = gql`
  query CheckUserMembershipInvite($teamId: String!, $currentUserEmail: String!) {
    checkUserMembershipInvite(teamId: $teamId, currentUserEmail: $currentUserEmail)
  }
`;


const Invite: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, email, token } = router.query as { id: string; email: string; token: string };

    
  }, [router.query]);
  const currentUserEmail = router.query.email;

  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(CHECK_USER_MEMBERSHIP, {
    variables: { teamId: router.query.id, currentUserEmail },
  });

  

  if (loadingUser)
  return (
    <CircularProgress
      color="primary"
      size={50}
      style={{ position: "absolute", top: "50%", left: "50%" }}
    />
  );
if (errorUser) {
  console.error("Error checking user membership:", errorUser);
  return <p>Error checking user membership</p>;
}

const isUserMember = dataUser.checkUserMembershipInvite;
if (isUserMember == false) {
  return (
    <Box>
      <Alert severity="error">
        Tato akce neni dostupná
        <br />
        <Link href="/">
          <Button sx={{ backgroundColor: "red" }}>
            <Typography sx={{ color: "#fff" }}>Zpět</Typography>
          </Button>
        </Link>
      </Alert>
    </Box>
  );
}

  return (
    <Box
      sx={{
        backgroundColor: "#F0F2F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "30em",
          width: "80%",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
          borderRadius: "15px",
          margin: "0 1rem",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box
            sx={{
              width: "60%",
              maxHeight: "30em",
              position: "relative",
              zIndex: "1", // Ensure content is above the background image
              borderRadius: "0 0 15px 15px",
            }}
          >
            <img
              src={pictureBackground.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
                borderRadius: "15px 0 0px 15px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: "2", // Set a higher z-index for content
              }}
            >
              <Box
                sx={{ marginLeft: "10%", marginRight: "10%", zIndex: "999" }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    marginTop: "1em",
                  }}
                >
                  LOGO
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "0.7em",
                    marginBottom: "auto",
                    fontSize: "4vw",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  TEAM MANAGER
                </Typography>

                <Box
                  sx={{
                    marginLeft: "5%",
                    marginRight: "5%",
                    zIndex: "999",
                    marginTop: "2em",
                    position: "relative",
                  }}
                >
                  <Box>
                    <img
                      src={photo.src}
                      alt="logo"
                      width="100%"
                      height="auto"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
            <Box>
              <Box
                sx={{
                  width: "100%", // Set the desired width for the box
                  textAlign: "center",
                  position: "relative",
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Box
                  sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "100%",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      marginBottom: "1em",
                      fontSize: "2.7vw",
                      fontFamily: "Roboto",
                      fontWeight: "800",
                      marginTop: "40%",

                      textAlign: "center",
                    }}
                  >
                    Pozvánka do týmu
                  </Typography>

                  <Box
                    sx={{
                      display: "block",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                      maxWidth: "300px", // Adjust the width as needed
                      flexDirection: "column", // Stack items vertically
                    }}
                  >
                    <Link
                      href={`/RegisterToTeam/${id}?email=${router.query.email}`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          marginTop: "1rem",
                          backgroundColor: "#FFE0FE",
                          color: "black",
                          fontFamily: "Roboto",
                          width: "10em",
                          display: "flex",
                          marginBottom: "1rem",
                          marginLeft: "auto",
                          marginRight: "auto",
                          fontWeight: "700",
                          border: "1px solid #ff96fc",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                          padding: "1em",
                          borderRadius: "4px",
                        }}
                      >
                        Registrovat
                      </Button>
                    </Link>

                    <Link
                      href={`/AddToTeam/${id}?email=${router.query.email}`}
                      sx={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          marginTop: "1rem",
                          backgroundColor: "#FFE0FE",
                          color: "black",
                          width: "10em",
                          display: "flex",
                          marginLeft: "auto",
                          marginRight: "auto",
                          fontFamily: "Roboto",
                          fontWeight: "700",
                          border: "1px solid #ff96fc",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                          padding: "1em",
                          borderRadius: "4px",
                        }}
                      >
                        Už mám účet
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Invite;
