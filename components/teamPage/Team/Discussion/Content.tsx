/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  CircularProgress,
  Avatar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

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
      Comments {
        commentId
        commentText
        userEmail
        date
      }
      Seen {
        userEmail
        date
      }
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

const ADD_COMMENT = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      discussionId
      commentText
      userEmail
      date
    }
  }
`;

const UPDATE_DISCUSSION = gql`
  mutation UpdateDiscussion($input: UpdateDiscussionInput!) {
    updateDiscussion(input: $input)
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
  Comments: [Comment];
  Seen: [Seen];
};

type Seen = {
  userEmail: string;
  date: string;
};

type Comment = {
  commentId: string;
  commentText: string;
  userEmail: string;
  date: string;
};

const Content: React.FC<ContentProps> = (id) => {
  const subteamId = id.subteamId;

  const { loading, error, data, refetch } = useQuery(
    GET_DISCUSSIONS_BY_SUBTEAM,
    {
      variables: { subteamId },
    }
  );
  const userEmail = authUtils.getCurrentUser()?.email || "";
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [openTo, setOpenTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [visibleSeen, setVisibleSeen] = useState<string | null>(null);
  const [addComment] = useMutation(ADD_COMMENT);
  const [updateDiscussion] = useMutation(UPDATE_DISCUSSION);

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

  const handleAddComment = async (discussionId: string) => {
    try {
      await addComment({
        variables: {
          input: {
            discussionId,
            commentText: replyText,
            userEmail,
            date: new Date().toISOString(),
          },
        },
      });

      setReplyText("");
      handleCancelReply();
      setVisibleSeen(discussionId);
      refetch();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleMarkAsRead = async (discussionId: string) => {
    try {
      await updateDiscussion({
        variables: {
          input: {
            discussionId,
            userEmail,
          },
        },
      });

      refetch();
      // You may want to refetch the discussions or update the UI accordingly
    } catch (error) {
      console.error("Error updating discussion:", error);
    }
  };

  return (
    <Box>
      {discussions.map((discussion) => (
        <Box
          sx={{
            marginBottom: "1em",
            borderLeft: "2px solid gray",
            borderRight: "2px solid gray",
            borderTop: "2px solid gray",
            borderRadius: "10px",
          }}
          key={discussion.discussionId}
        >
          <Box sx={{ paddingLeft: "3%", paddingTop: "1.5%" }}>
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
              paddingLeft: "5%",
              paddingRight: "1%",
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
              borderRadius: "0px 0px 10px 10px",
              borderBottom: "2px solid gray",
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
                  color:
                    discussion.Seen &&
                    discussion.Seen.some(
                      (seenItem) => seenItem.userEmail === userEmail
                    )
                      ? "green"
                      : "gray",
                  marginLeft: "auto",
                  paddingRight: "0.5%",
                  borderRight: "2px solid gray",
                  cursor: discussion.Seen ? "pointer" : "default",
                }}
                onClick={() => handleMarkAsRead(discussion.discussionId)}
              >
                {discussion.userEmail === userEmail
                  ? "Váš příspěvek"
                  : discussion.Seen &&
                    discussion.Seen.some(
                      (seenItem) => seenItem.userEmail === userEmail
                    )
                  ? "Přečteno"
                  : "Označit jako přečtené"}
              </Typography>
              <Box sx={{ }}>
              {discussion.userEmail === userEmail && (
                  <Typography
                    sx={{
                      fontSize: "0.8em",
                      color: "gray",
                      paddingLeft: "0.5em",
                      borderRight: "2px solid gray",
                      paddingRight: "0.5em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => setVisibleSeen(visibleSeen === discussion.discussionId ? null : discussion.discussionId)}
                  >
                    {visibleSeen === discussion.discussionId ? "Skrýt přečteno" : "Zobrazit přečteno"}
                  </Typography>
                )}
              </Box>
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
                  {openTo === discussion.discussionId
                    ? "Zavřít komentáře"
                    : "Otevřít komentáře"}
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
            {visibleSeen === discussion.discussionId && discussion.userEmail === userEmail && (
              <Box
                sx={{
                  display: "block",
                  borderTop: "2px solid gray",
                  paddingTop: "0.6em",
                }}
              >
                <Box sx={{ marginLeft: "5%", marginRight: "5%" }}>
                  {discussion.Seen && discussion.Seen.length > 0 && (
                    <Box
                      sx={{
                        paddingBottom: "0.4em",
                        borderBottom: "1px solid gray",
                        marginBottom: "0.8em",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", paddingBottom:"0.5em" }}>
                        Přečteno
                      </Typography>
                      {discussion.Seen.map((Seen) => (
                        <Box
                          sx={{
                            paddingBottom: "0.4em",
                            marginBottom: "0.8em",
                          }}
                          key={Seen.userEmail}
                        >
                          <UserDetails
                            userEmail={Seen.userEmail}
                            date={formatDateTime(Seen.date)}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            {replyingTo === discussion.discussionId && (
              <Box
                sx={{
                  display: "block",
                  borderTop: "2px solid gray",
                  paddingTop: "0.6em",
                }}
              >
                <TextField
                  label="Odpověď"
                  multiline
                  rows={2}
                  variant="outlined"
                  value={replyText}
                  onChange={(e: { target: { value: any } }) =>
                    setReplyText(e.target.value)
                  }
                  sx={{
                    marginBottom: 1,
                    width: "90%",
                    marginLeft: "5%",
                    marginRight: "auto",
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddComment(discussion.discussionId)}
                  sx={{ marginRight: 1, marginLeft: "5%" }}
                >
                  Potvrdit
                </Button>
                <Button variant="outlined" onClick={handleCancelReply}>
                  Zrušit
                </Button>
              </Box>
            )}

            {openTo === discussion.discussionId && (
              <Box
                sx={{
                  marginTop: "1em",
                  display: "block",
                  borderTop: "2px solid gray",
                  paddingTop: "0.9em",
                  paddingBottom: "0.6em",
                  backgroundColor: "white",
                  borderRadius: "0px 0px 10px 10px",
                }}
              >
                {discussion.Comments && discussion.Comments.length > 0 && (
                  <Box sx={{ marginLeft: "5%", marginRight: "5%" }}>
                    {discussion.Comments.map((Comment) => (
                      <Box
                        sx={{
                          paddingBottom: "0.4em",
                          borderBottom: "1px solid gray",
                          marginBottom: "0.8em",
                        }}
                        key={Comment.commentId}
                      >
                        <UserDetails
                          userEmail={Comment.userEmail}
                          date={formatDateTime(Comment.date)}
                        />
                        <Typography sx={{ paddingTop: "0.5em" }}>
                          {Comment.commentText}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    paddingTop: "0.5em",
                    paddingBottom: "0.5em",
                  }}
                >
                  {replyingTo === discussion.discussionId ? (
                    <Box></Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReplyClick(discussion.discussionId)}
                      sx={{ marginRight: 1, marginLeft: "5%" }}
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
