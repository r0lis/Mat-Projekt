import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Info', 'Features', 'About'];

const MyNavBar: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const logoAndButtonStyle:React.CSSProperties = {
        left: '15%',
        position : 'relative',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    return (
        <AppBar sx={{ backgroundColor: '#DA1AAD' }} position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <div style={logoAndButtonStyle}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>


                    </div>

                   

                    <Box sx={{position:'relative', left: '40%',marginRight:'50%', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page, index) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,          
                                    marginRight: '2.5em',
                                    color: 'white',
                                    display: 'block',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    position: 'relative',
                                }}
                            >
                                {page}
                                <span
                                    className="bottom-border"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-0px',
                                        left: '0',
                                        right: '0',
                                        height: '5px',
                                        borderRadius: '5px 5px 5px 5px',
                                        backgroundColor: 'white',
                                    }}
                                ></span>
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{position:'relative', marginLeft:'55%', marginRight:'10%', flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Button
                        sx={{
                            position: 'relative',
                            right: '15%',
                            backgroundColor: 'white',
                            borderRadius: '30px',
                            padding: '6px 16px',
                            marginLeft: '20px',
                            width: '100px', 
                            height: '40px', 
                        }}
                        variant="contained"
                    >
                        <Typography sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.2vw', lineHeight: '20px' }}>
                            Try IT
                        </Typography>
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default MyNavBar;





