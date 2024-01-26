/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { authUtils } from "@/firebase/auth.utils";
import { useMutation, gql } from "@apollo/client";

const ADD_DISCUSSION = gql`
mutation AddDiscussion($input: AddDiscussionInput!) {
    addDiscussion(input: $input) {
      subteamId
      postText
      userEmail
      date
    }
  }
`;

type AddProps = {
  subteamId: string;
};

const Add: React.FC<AddProps> = ({ subteamId }) => {

  const user = authUtils.getCurrentUser();
  const [postText, setPostText] = useState<string>("");
  const [addDiscussion] = useMutation(ADD_DISCUSSION);
  const userEmail = user?.email || "";
  console.log("subteamId:", subteamId);
    console.log("userEmail:", userEmail);
    console.log("postText:", postText);
    console.log("time:", new Date().toISOString());

  const handlePostTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostText(event.target.value);
  };

  const handleAddPost = () => {
    const date = new Date().toISOString();
    addDiscussion({
      variables: {
        input: {
          subteamId: subteamId,
          postText: postText,
          userEmail: userEmail,
          date: date,
        },
      },
    })
      .then((response) => {
        console.log("Discussion added successfully:", response);
      })
      .catch((error) => {
        console.error("Error adding discussion:", error);
      });
  };

  return (
    <Box>
      <TextField
        label="Napište svůj příspěvek"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={postText}
        onChange={handlePostTextChange}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleAddPost}>
        Přidat příspěvek
      </Button>
    </Box>
  );
};

export default Add;
