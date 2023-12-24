/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { Box } from '@mui/material';
import NavBar from '@/components/User/NavBar';3
import Content from '@/components/User/Content';

const UserManagement: React.FC = () => {
  return (
    <Box>
      <NavBar />
      <Box>
      <Content />
      </Box>
    </Box>
  )
}

export default UserManagement