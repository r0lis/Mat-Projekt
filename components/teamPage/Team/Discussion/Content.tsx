/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Avatar, Typography } from "@mui/material";
import React from "react";
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
};

const Content: React.FC<ContentProps> = (id) => {
  const subteamId = id.subteamId;

  const { loading, error, data } = useQuery(GET_DISCUSSIONS_BY_SUBTEAM, {
    variables: { subteamId },
  });

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

  return (
    <Box>
      {discussions.map((discussion) => (
        <Box key={discussion.discussionId}>
          <UserDetails userEmail={discussion.userEmail} />
          <Typography>{formatDateTime(discussion.date)}</Typography>
          <Typography>{discussion.postText}</Typography>

        </Box>
      ))}
    </Box>
  );
};

type UserDetailsProps = {
  userEmail: string;
};

const UserDetails: React.FC<UserDetailsProps> = ({ userEmail }) => {
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
      <Avatar src={user.Picture} alt="User" />
      <Typography>
        {user.Name} {user.Surname}
      </Typography>
    </Box>
  );
};

export default Content;
