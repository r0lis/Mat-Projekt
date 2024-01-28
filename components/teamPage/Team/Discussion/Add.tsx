/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { Box, Button, FormControlLabel, Switch, TextField } from "@mui/material";
import { authUtils } from "@/firebase/auth.utils";
import { gql, useMutation } from "@apollo/client";

type AddProps = {
  subteamId: string;
  onAddPostSuccess: () => void;
};
const ADD_DISCUSSION_MUTATION = gql`
  mutation addDiscussion($input: AddDiscussionInput!) {
    addDiscussion(input: $input) {
      subteamId
      postText
      userEmail
      date
      title
      onComment
    }
  }
`;

const Add: React.FC<AddProps> = ({ subteamId, onAddPostSuccess}) => {

  const user = authUtils.getCurrentUser();
  const [postText, setPostText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [onComment, setOnComment] = useState<boolean>(true);
  const userEmail = user?.email || "";
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [addDiscussionMutation] = useMutation(ADD_DISCUSSION_MUTATION);

  const handlePostTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostText(event.target.value);
    setValidationError(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setValidationError(null);
  };

  const handleOnCommentChange = () => {
    setOnComment(!onComment);
  };

  const handleAddPost = async () => {
    if (postText.length < 10) {
      setValidationError("Post must be at least 10 characters long.");
      return;
    }
    if (title.length < 3) {
      setValidationError("Title must be at least 3 characters long.");
      return;
    }

    const date = new Date().toISOString();

    try {
      await addDiscussionMutation({
        variables: { input: { subteamId, postText, userEmail, date, title, onComment } },
      });
      onAddPostSuccess();
      setPostText("");
      setTitle("");
      setOnComment(true);


      // Optionally, you can handle success or update UI here
    } catch (error) {
      console.error("Error adding post:", error);
      // Optionally, you can handle errors or update UI here
    }
  };

  return (
    <Box>
       <TextField
        label="Název"
        fullWidth
        value={title}
        onChange={handleTitleChange}
        sx={{ marginBottom: 2 }}
        error={!!validationError}
        helperText={validationError}
      />

      <TextField
        label="Napište svůj příspěvek"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={postText}
        onChange={handlePostTextChange}
        sx={{ marginBottom: 2 }}
        error={!!validationError}
        helperText={validationError}
      />
      <FormControlLabel
        control={<Switch checked={onComment} onChange={handleOnCommentChange} />}
        label={onComment ? "Komentáře povoleny" : "Komentáře zakázány"}
      />
      <Button variant="contained" color="primary" onClick={handleAddPost}>
        Přidat příspěvek
      </Button>
    </Box>
  );
};

export default Add;
