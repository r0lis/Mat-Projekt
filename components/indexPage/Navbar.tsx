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
import Link from 'next/link';
import LoginIcon from '../../public/user.png';
import LoginIcon2 from '../../public/user2.png';

import { authUtils } from '../../firebase/auth.utils';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

const GET_USER_INFO = gql`
  query GetUserInfo($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
    }
  }
`;

const GET_TEAM_NAMES = gql`
  query GetTeamNames($email: String!) {
    getUserTeamsByEmail(email: $email) {
      teamId
      Name
    }
  }
`;



const pages = ['Info', 'Features', 'About'];
const menuItems = ['Přihlasit se', 'Vytvořit účet'];

const MyNavBar: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
    const user = authUtils.getCurrentUser();


    const { loading: userInfoLoading, error: userInfoError, data: userInfoData } = useQuery(GET_USER_INFO, {
        variables: { email: user?.email || '' },
        skip: !user,
    });

    const { loading: userIdLoading, error: userIdError, data: userTeamsData } = useQuery(GET_TEAM_NAMES, {
        variables: { email: user?.email || '' },
    });

    console.log(userIdError)
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
        setAnchorEl2(null);
    };

    const handleLogout = async () => {
        try {
            await authUtils.logout();
            window.location.reload();
        } catch (error) {
            console.error("Chyba při odhlašování: ", error);
        }
    };

    const logoAndButtonStyle: React.CSSProperties = {
        left: '5%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const buttonStyle = {
        backgroundColor: 'grey',
        width: '10em',
        '&:hover': {
            backgroundColor: '#b71dde',
        },
    };

    const buttonStyle2 = {
        backgroundColor: 'grey',
        marginBottom: '1em',
        marginTop: '1em',
        width: '10em',
        '&:hover': {
            backgroundColor: '#b71dde',

        },

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

                    <Box
                        sx={{
                            position: 'relative',
                            left: '30%',
                            marginRight: '20%',
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
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
                                    fontSize: '1.2vw',
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

                    <Box
                        sx={{
                            position: 'relative',
                            marginLeft: '45%',
                            marginRight: '5%',
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
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
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <div>
                        <Box
                            sx={{ height: '6%', width: '6%', position: 'relative' }}
                            onClick={handleOpenMenu}
                        >
                            <img
                                style={{ height: '50px', width: '50px', color: 'white' }}
                                src={user ? LoginIcon2.src : LoginIcon.src}
                                alt="login"
                            />
                        </Box>
                        <Menu
                            id="menu-appbar2"
                            anchorEl={anchorEl2}
                            open={Boolean(anchorEl2)}
                            onClose={handleCloseMenu}
                            sx={{
                                display: { xs: 'block', marginTop: '1em', marginLeft: '2em', },

                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >


                            <Box sx={{ width: '18rem', height: "auto" }}>

                                {user ? (
                                    <><Box><>
                                        <Box>
                                            <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', marginTop: '0.5em', marginBottom: '0.5em' }}>
                                                {userInfoLoading ? 'Načítání...' : userInfoError ? 'Chyba' : userInfoData?.getUserByNameAndSurname.Name + ' ' + userInfoData?.getUserByNameAndSurname.Surname}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ borderBottom: '7px solid #b71dde ', marginBottom: '1em' }} ></Box>

                                        <Box>
                                            <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
                                                {userIdLoading
                                                    ? 'Načítání...'
                                                    : userIdError
                                                        ? 'Chyba'
                                                        : userTeamsData.getUserTeamsByEmail.length > 0
                                                            ? userTeamsData.getUserTeamsByEmail.map((team: any, index: React.Key | null | undefined) => (
                                                                <Link key={index} href={`/Team/${team.teamId}`}>
                                                                    <Box sx={{ marginBottom: '1em', cursor: 'pointer', color: 'black', textDecoration: 'underline' }}>
                                                                        {team.Name}
                                                                    </Box>
                                                                </Link>
                                                            ))
                                                            : 'Nemáte žádný tým'
                                                }
                                            </Typography>
                                        </Box>
                                        <Box sx={{ borderBottom: '7px solid #b71dde ', marginTop: '1em', marginBottom: '1em' }} ></Box>


                                        <Box sx={{ alignItems: 'center', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Button onClick={handleLogout} style={buttonStyle}>
                                                <Typography
                                                    sx={{ color: 'black', fontWeight: 'bold', fontSize: '1 vw', lineHeight: '20px', padding: '5px' }}
                                                >Správa účtu</Typography>
                                            </Button>
                                            <Button onClick={handleLogout} style={buttonStyle2}>
                                                <Typography
                                                    sx={{ color: 'black', fontWeight: 'bold', fontSize: '1 vw', lineHeight: '20px', padding: '5px' }}
                                                >Odhlásit se</Typography>
                                            </Button>
                                        </Box></></Box></>
                                ) : (
                                    <>
                                        <Box sx={{ alignItems: 'center', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '2em', marginTop: '2em' }}>
                                            <Typography sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.7vw', lineHeight: '20px' }}>
                                                LOGO
                                            </Typography>

                                        </Box>
                                        <Box sx={{ borderBottom: '7px solid #b71dde ' }} ></Box>

                                        <Box sx={{ alignItems: 'center', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Link href="/LoginPage">
                                                <Button sx={buttonStyle2}>
                                                    <Typography
                                                        sx={{ color: 'black', fontWeight: 'bold', fontSize: '1 vw', lineHeight: '20px', padding: '5px' }}
                                                    >Přihlásit se</Typography></Button>
                                            </Link>
                                        </Box><Box sx={{ alignItems: 'center', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', marginBottom: '1em', justifyContent: 'center' }}>
                                            <Link href="/UserRegistration">
                                                <Button sx={buttonStyle}>
                                                    <Typography
                                                        sx={{ color: 'black', fontWeight: 'bold', fontSize: '1 vw', lineHeight: '20px', padding: '5px' }}>Vytvořit účet</Typography></Button>
                                            </Link>
                                        </Box></>
                                )}

                            </Box>

                        </Menu>
                    </div>

                    <Box sx={{ marginRight: '5%', marginLeft: '3%' }}>
                        <Link href="/CreateTeam">
                            <Button
                                sx={{
                                    position: 'relative',
                                    backgroundColor: 'white',
                                    borderRadius: '15px',
                                    maxWidth: '100%',
                                    padding: '6px 16px',
                                    width: 'auto',
                                    height: '3rem',
                                }}
                                variant="contained"
                            >
                                <Typography
                                    sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.2vw', lineHeight: '20px' }}
                                >
                                    CREATE TEAM
                                </Typography>
                            </Button>
                        </Link>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MyNavBar;
