/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Avatar, Typography, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

type ContentProps = {
  subteamId: string;
};

const GET_DISCUSSIONS_BY_SUBTEAM = gql`
  query GetDiscussionsBySubteam($subteamId: String!) {
    getDiscussionsBySubteam(subteamId: $subteamId) {
      discussionId
      subteamId
      postText
      userEmail
      date
      title
      onComment
    }
  }
`;

const GET_USER_DETAILS = gql`
  query GetUserDetails($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Picture
    }
  }
`;

const formatDateTime = (rawDateTime: string) => {
  const dateTime = new Date(rawDateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return dateTime.toLocaleDateString("cs-CZ", options);
};

type Discussion = {
  discussionId: string;
  subteamId: string;
  postText: string;
  userEmail: string;
  date: string;
  title: string;
  onComment: boolean;
};

const Content: React.FC<ContentProps> = (id) => {
  const subteamId = id.subteamId;

  const { loading, error, data } = useQuery(GET_DISCUSSIONS_BY_SUBTEAM, {
    variables: { subteamId },
  });

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [openTo, setOpenTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  if (error) {
    console.error("Error fetching discussions:", error);
    return <Box>Error fetching discussions</Box>;
  }

  const discussions: Discussion[] = data?.getDiscussionsBySubteam || [];

  if (discussions.length === 0) {
    return <Box>Žádné příspěvky</Box>;
  }

  const handleReplyClick = (discussionId: string) => {
    setReplyingTo(discussionId);
  };
  
  const handleOpenClick = (discussionId: string) => {
    setOpenTo(openTo === discussionId ? null : discussionId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <Box>
      {discussions.map((discussion) => (
        <Box sx={{ marginBottom: "1em" }} key={discussion.discussionId}>
          <Box>
            <UserDetails
              userEmail={discussion.userEmail}
              date={formatDateTime(discussion.date)}
            />
          </Box>
          <Box
            sx={{
              borderTop: "2px solid gray",
              borderBottom: "2px solid gray",
              paddingTop: "1em",
              paddingBottom: "1em",
              marginTop: "0.6em",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {discussion.title}
            </Typography>
            <Typography>{discussion.postText}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F0F2F5",
              borderBottom: "2px solid #027ef2",
            }}
          >
            <Box
              sx={{
                display: "flex",
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8em",
                  color: "gray",
                  marginLeft: "auto",
                  paddingRight: "0.5%",
                  borderRight: "2px solid gray",
                  cursor: "pointer",
                }}
              >
                Označit jako přectené
              </Typography>
              {discussion.onComment == true ? (
                 <Typography
                 sx={{
                   fontSize: "0.8em",
                   color: "gray",
                   marginRight: "3%",
                   paddingLeft: "0.5%",
                   cursor: "pointer",
                 }}
                 onClick={() => handleOpenClick(discussion.discussionId)}
               >
                 {openTo === discussion.discussionId ? "Zavřít komentáře" : "Otevřít komentáře"}
               </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: "0.8em",
                    color: "gray",
                    marginRight: "3%",
                    paddingLeft: "0.5%",
                    cursor: "pointer",
                  }}
                >
                  Komentáře vypnuty
                </Typography>
              )}
              
            </Box>
            {replyingTo === discussion.discussionId && (
              <Box sx={{  display:"block", borderTop:"2px solid gray", paddingTop:"0.6em", paddingBottom:"0.6em" }}>
                
                <TextField
                  label="Odpověď"
                  multiline
                  rows={2}
                  variant="outlined"
                  
                  value={replyText}
                  onChange={(e: { target: { value: any; }; }) => setReplyText(e.target.value)}
                  sx={{ marginBottom: 1, width: "90%", marginLeft:"5%", marginRight:"auto"}}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Tady můžete implementovat logiku pro odeslání odpovědi
                    console.log("Odeslat odpověď:", replyText);
                    handleCancelReply();
                  }}
                  sx={{ marginRight: 1,marginLeft:"5%", }}
                >
                  Potvrdit
                </Button>
                <Button variant="outlined" onClick={handleCancelReply}>
                  Zrušit
                </Button>
              </Box>
            )}

            {openTo === discussion.discussionId && (
              <Box sx={{ marginTop: "1em", display:"block", borderTop:"2px solid gray", paddingTop:"0.6em", paddingBottom:"0.6em" }}>
                <Typography sx={{ fontWeight: "bold", marginLeft:"5%", marginRight:"auto"}}>
                  Komentáře
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    paddingTop: "0.5em",
                    paddingBottom: "0.5em",
                  }}
                >
                  {replyingTo === discussion.discussionId ? (<Box></Box>):(
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReplyClick(discussion.discussionId)}
                    sx={{ marginRight: 1,marginLeft:"5%", }}
                  >
                    Přidat komentář
                  </Button>
                  )}
                  </Box>
                  </Box>
            )}

          </Box>
        </Box>
      ))}
    </Box>
  );
};

type UserDetailsProps = {
  userEmail: string;
  date: string;
};

const UserDetails: React.FC<UserDetailsProps> = ({ userEmail, date }) => {
  const { loading, error, data } = useQuery(GET_USER_DETAILS, {
    variables: { email: userEmail },
  });

  if (loading) {
    return <CircularProgress color="primary" size={20} />;
  }

  if (error) {
    console.error("Error fetching user details:", error);
    return null;
  }

  const user = data?.getUserByNameAndSurname;

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Avatar
          sx={{ height: "45px", width: "45px" }}
          src={user.Picture}
          alt="User"
        />
        <Box sx={{ display: "block", marginLeft: "1em" }}>
          <Typography>
            {user.Name} {user.Surname}
          </Typography>
          <Typography>{date}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Content;
