import { Box, Typography } from '@mui/material'
import React from 'react'
import PhotoProvider from './PhotoProvider'

const Edit: React.FC =() => {
  return (
    <Box>
        <Typography variant="h4">Úprava profilu:</Typography>
        <PhotoProvider />
    </Box>
  )
}

export default Edit 