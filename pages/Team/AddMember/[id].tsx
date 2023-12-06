/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import Navbar from '@/components/teamPage/AddMember/Navbar'
import AddMember from '@/components/teamPage/AddMember/Content'
import { authUtils } from "@/firebase/auth.utils";
import { Box, Link, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

const CHECK_USER_MEMBERSHIP = gql`
  query CheckUserMembership($teamId: String!, $currentUserEmail: String!) {
    checkUserMembership(teamId: $teamId, currentUserEmail: $currentUserEmail)
  }
`;

const NewMeber: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const currentUserEmail = authUtils.getCurrentUser()?.email || ""
  const router = useRouter();
  const { id } = router.query;

  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(
    CHECK_USER_MEMBERSHIP,
    {
      variables: { teamId: id, currentUserEmail },
    }
  );

  if (loadingUser) return (
    <CircularProgress
      color="primary"
      size={50}
      style={{ position: "absolute", top: "50%", left: "50%" }}
    />
  );
  if (errorUser) {
    <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    console.error("Error checking user membership:", errorUser);
    return <p>Error checking user membership</p>;
  }
  


  if (!currentUserEmail) {
    return (
      <Box>
        <Alert severity="error">
          You must be logged in to perform this action.
          <br />
          <Link href="/LoginPage">
          <Button sx={{backgroundColor:'red'}}>
            <Typography sx={{ color: '#fff' }}>Login</Typography>
            </Button>
            
          </Link>
        </Alert>
      </Box>
    );
  }

  const isUserMember = dataUser.checkUserMembership;

  if (!isUserMember) {
    return (
      <Box>
        <Alert severity="error">
          Nejste členem tohoto týmu.
          <br />
          <Link href="/">
          <Button sx={{backgroundColor:'red'}}>
            <Typography sx={{ color: '#fff' }}>Zpět</Typography>
            </Button>
          </Link>
        </Alert>
      </Box>
    );
  }

  return (
    <div>
      <Navbar />
      <AddMember/>
    </div>
  )
}

export default NewMeber