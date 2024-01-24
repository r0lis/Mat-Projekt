import React from 'react'
import { Box } from '@mui/material'

type AddProps = {
    subteamId: string;
    };


const Add: React.FC<AddProps> = (id) => {
    console.log(id.subteamId)
  return (
    <Box>Add</Box>
  )
}

export default Add