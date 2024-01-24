import { Box } from '@mui/material'
import React from 'react'

type ContentProps = {
    subteamId: string;
    };

const Content : React.FC<ContentProps> = (id) => {
    console.log(id.subteamId)
  return (
    <Box>Content</Box>
  )
}

export default Content