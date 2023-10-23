import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface NavbarProps {
    teamName: string;
}

function Navbar({ teamName }: NavbarProps) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" color="inherit" align="center">
                    {teamName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;