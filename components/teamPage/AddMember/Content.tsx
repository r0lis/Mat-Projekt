/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";


const UPDATE_MEMBERS_MUTATION = gql`
mutation UpdateMembers($teamId: String!, $newMembers: [String!]!) {
  updateMembers(teamId: $teamId, newMembers: $newMembers) {
    Name
  }
}
`;
const CHECK_EMAILS_IN_TEAM_QUERY = gql`
  query CheckEmailsInTeam($teamId: String!, $emails: [String!]!) {
    checkEmailsInTeam(teamId: $teamId, emails: $emails)
  }
`;



const Content: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [emails, setEmails] = useState<string[]>([]);
  const [emailValue, setEmailValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isCreated, setIsCreated] = useState(false);

  const { data, loading } = useQuery<{ checkEmailsInTeam: string[] }>(CHECK_EMAILS_IN_TEAM_QUERY, {
    variables: {
      teamId: id,
      emails: emails,
    },
  });

  

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const [updateMembersMutation] = useMutation(UPDATE_MEMBERS_MUTATION);

  
  const handleCreateTeam = async () => {
     try {
      if (data && data.checkEmailsInTeam.length > 0) {
        setError("Následující e-maily již existují v týmu: " + data.checkEmailsInTeam.join(", "));
        return;
      }

      const response = await updateMembersMutation({
        variables: {
          teamId: id,
          newMembers: emails,
        },
      });

      console.log("Tým byl úspěšně vytvořen", response);

      setIsCreated(true);
      await axios.post("/api/sendEmail", { emails: emails, teamId:id });
      console.log("E-maily úspěšně odeslány.");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue.trim() !== "" && emailRegex.test(emailValue)) {
      if (editIndex !== null) {
        const updatedEmails = [...emails];
        updatedEmails[editIndex] = emailValue;
        setEmails(updatedEmails);
        setEditIndex(null);
      } else {
        setEmails([...emails, emailValue]);
      }
      setEmailValue("");
      setError2(null);
    } else {
      setError2("Please enter a valid email.");
    }
  };

  

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEmailValue(emails[index]);
  };

  const handleDelete = (index: number) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
    setEditIndex(null);
  };

  if (loading) return (
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

  return (
    <Box sx={{ margin: "0 auto", marginTop: 4 }}>
      <Box
        sx={{
          backgroundColor: "white",
          width: "65%",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "5%",
          marginTop: "6em",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          sx={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "600" }}
          variant="h4"
          gutterBottom
        >
          Přidání uživatele do týmu
        </Typography>

        <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          {isCreated ? (
            <Alert severity="success">
            Uživatele byli přidáni!
            <Link href={`/Team/${id}`}>
              <Button variant="contained" sx={{ marginLeft: "10px" }}>
                Přejít na Team
              </Button>
            </Link>
          </Alert>
            
          ) : (
            <form>
              

              <Box sx={{ marginBottom: "20px" }}>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    marginTop: "20px",
                  }}
                  variant="h5"
                  gutterBottom
                >
                  Přidání členů týmu:
                </Typography>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="Zadejte e-mail"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={addEmail}
                  style={{ marginLeft: "10px" }}
                >
                  {editIndex !== null ? "Upravit" : "Přidat"}
                </Button>
              </Box>
              <div style={{ marginBottom: "10px" }}>
                {error2 && <Alert severity="error">{error2}</Alert>}
              </div>

              <Box
                sx={{
                  border: "1px solid lighgray",
                  borderRadius: "15px",
                  padding: "15px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  marginTop: "20px",
                }}
              >
                <h3>Seznam uživatelů které jste přidali:</h3>

                {emails.length === 0 ? (
                  <Alert sx={{ marginBottom: "10px" }} severity="warning">
                    Přidejte členy do týmu.
                  </Alert>
                ) : (
                  <>
                    <TableContainer
                      component={Paper}
                      sx={{ border: "1px solid #ddd" }}
                    >
                      <Table>
                        <TableBody>
                          {emails.map((email, index) => (
                            <TableRow
                              key={index}
                             
                            >
                              <TableCell
                                sx={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {email}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                <IconButton
                                
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => handleEdit(index)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDelete(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell >
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
              
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                variant="contained"
                onClick={handleCreateTeam}
                sx={{ marginTop: 2 }}
              >
                Potvrdit
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Content