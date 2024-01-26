/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { authUtils } from "@/firebase/auth.utils";
import { gql, useMutation } from "@apollo/client";

type AddProps = {
  subteamId: string;
};
const ADD_DISCUSSION_MUTATION = gql`
  mutation addDiscussion($input: AddDiscussionInput!) {
    addDiscussion(input: $input) {
      subteamId
      postText
      userEmail
      date
    }
  }
`;

const Add: React.FC<AddProps> = ({ subteamId }) => {

  const user = authUtils.getCurrentUser();
  const [postText, setPostText] = useState<string>("");
  const userEmail = user?.email || "";
  
  const [addDiscussionMutation] = useMutation(ADD_DISCUSSION_MUTATION);

  const handlePostTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostText(event.target.value);
  };

  const handleAddPost = async () => {
    const date = new Date().toISOString();

    try {
      await addDiscussionMutation({
        variables: { input: { subteamId, postText, userEmail, date } },
      });

      // Optionally, you can handle success or update UI here
    } catch (error) {
      console.error("Error adding post:", error);
      // Optionally, you can handle errors or update UI here
    }
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
