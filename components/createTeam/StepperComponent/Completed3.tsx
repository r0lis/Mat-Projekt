import { Alert, Box, Typography } from '@mui/material'
import React from 'react'


function Completed3() {
  return (
    <Box>
      <Box sx={{ margin: "0 auto", marginTop: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "5%",
            marginTop: "6em",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Kontrola údajů
          </Typography>

          <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
            <Alert severity="success">Údaje byly zkonrolovány!</Alert>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Completed3