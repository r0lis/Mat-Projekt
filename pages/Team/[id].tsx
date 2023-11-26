/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoTeam from '@/public/assets/logotym.png';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Typography, CircularProgress, Avatar, Button, Menu } from '@mui/material'; // Importujte CircularProgress z MUI
import ChatIcon from '@mui/icons-material/Chat';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import demoUser from '@/public/assets/demoUser.png';
import { authUtils } from '../../firebase/auth.utils';
import Overview from '../../public/assets/Overview.png';
import Trainings from '../../public/assets/training.png';
import Calendar from '../../public/assets/Kalendar.png';
import Rousters from '../../public/assets/network.png';
import Nominations from '../../public/assets/Nomination.png';
import Pay from '../../public/assets/pay.png';
import Events from '../../public/assets/Event.png';
import Members from '../../public/assets/Members.png';
import Settings from '../../public/assets/Settings.png';
import Image from 'next/image';
import OverviewComponent from '@/components/teamPage/Overview';
import TrainingsComponent from '@/components/teamPage/Training';
import CalendarComponent from '@/components/teamPage/Calendar';
import RoustersComponent from '@/components/teamPage/Rousters';
import NominationsComponent from '@/components/teamPage/Nominations';
import PayComponent from '@/components/teamPage/Paying'; 
import EventsComponent from '@/components/teamPage/Events';
import MembersComponent from '@/components/teamPage/Members';
import SettingsComponent from '@/components/teamPage/Settings';
import TeamIcon from '@/public/assets/people.png';
import TeamComponent from '@/components/teamPage/Team';

const items = [
  { label: 'Přehled', image: Overview },
  { label: 'Tréninky', image: Trainings },
  { label: 'Kalendář', image: Calendar },
  { label: 'Zápasy', image: Nominations },
  { label: 'Soupisky', image: Rousters },
  { label: 'Platby', image: Pay },
  { label: 'Události', image: Events },
  { label: 'Tým', image: TeamIcon },
  { label: 'Členové', image: Members },
  { label: 'Správa', image: Settings },
];

const GET_TEAM_DETAILS = gql`
query GetTeamDetails($teamId: String!) {
  getTeamDetails(teamId: $teamId) {
    Name
    
  }
}
`;

const GET_USER_INFO = gql`
  query GetUserInfo($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
    }
  }
`;


function Team() {
  const router = useRouter();
  const { id } = router.query;
  const user = authUtils.getCurrentUser();
  const [showOnlyIcon, setShowOnlyIcon] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLink, setActiveLink] = useState('Přehled');
  const [, setMenuOpen] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [, setMenuOpen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleResizeThrottled = () => {
      if (windowWidth < 1000) {
        setShowOnlyIcon(true);
      } else {
        setShowOnlyIcon(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResizeThrottled();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);


  const { loading, error, data } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
  });

  const { loading: userInfoLoading, error: userInfoError, data: userInfoData } = useQuery(GET_USER_INFO, {
    variables: { email: user?.email || '' },
    skip: !user,
  });


  if (loading) return <CircularProgress color="primary" size={50} style={{ position: 'absolute', top: '50%', left: '50%' }} />; // Zobrazí CircularProgress místo načítání
  if (error) return <p>Chyba: {error.message}</p>;

  const team = data.getTeamDetails;
  const teamName = team ? team.Name : '';
  const name = userInfoData?.getUserByNameAndSurname.Name || '';
  const surname = userInfoData?.getUserByNameAndSurname.Surname || '';
  const initials = name[0] + surname[0];



  const toggleContentVisibility = () => {
    setShowOnlyIcon(!showOnlyIcon); // Toggles the state on button click
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleLinkClick = (label: string) => {
    setActiveLink(label);
    
  };

  const handleHover = (isHovering: boolean) => {
    if (!showOnlyIcon) {
      setIsHovered(isHovering);
    }
  };


const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
};


const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl2(null);
};

const handleOpenMenu2 = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
};


const handleCloseMenu2 = () => {
  setMenuOpen2(false);
  setAnchorEl(null);
};

const handleLogout = async () => {
    try {
        await authUtils.logout();
        window.location.reload();
    } catch (error) {
        console.error("Chyba při odhlašování: ", error);
    }
};


const buttonStyle = {
    backgroundColor: '#FFE0FE',
    width: '11em',
    '&:hover': {
        backgroundColor: '#b71dde',
    },
    border:'1px solid #ff96fc',

};

const buttonStyle2 = {
    backgroundColor: '#FFE0FE',
    marginBottom: '1em',
    marginTop: '1em',
    width: '11em',
    '&:hover': {
        backgroundColor: '#b71dde',

    },
    border:'1px solid #ff96fc',


};



  return (
    <div>
      {team && (
        <div>
          <AppBar position="static" sx={{ backgroundColor: '#A020F0', display: 'flex', justifyContent: 'space-between', height: '4.5em' }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open sidebar"
                onClick={toggleContentVisibility} 
              >
                <Box  sx={{ marginTop: '18px' }}>
                  <MenuIcon sx={{ color: 'white' }} />
                </Box>
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: { xs: 'auto', md: '20%' } }}>

                <img src={LogoTeam.src} alt="Team Logo" style={{ width: '3.5em', height: '3.5em', marginRight: '30px', marginTop: '8px' }} />
                <Box sx={{ display: 'inline-block' }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.7vw', marginLeft: '%', marginTop: '8px' }}>{teamName}</Typography>

                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: { xs: 'auto', md: 'auto' } }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4vw', marginLeft: '%', marginTop: '8px' }}>Management</Typography>
              </Box>

              <IconButton color="inherit" aria-label="open sidebar" sx={{ display: 'flex', marginLeft: '3%', fontSize: '24px' }}>
                <Box sx={{ display: 'flex', marginTop: '14px' }}>
                  <Link href={`/`}>
                    <ChatIcon sx={{ color: 'white' }} />
                  </Link>
                </Box>
              </IconButton>

              <Box>
              <Box onClick={handleOpenMenu2}> 
              <IconButton color="inherit" aria-label="open sidebar" sx={{ display: 'flex', marginLeft: { xs: '0.1%', md: '0.5%' }, fontSize: '24px', }}>
                <Box   sx={{ display: 'flex', marginTop: '8px' }}>
                    <CircleNotificationsIcon sx={{ color: 'white' }} />
                </Box>
              </IconButton>
              </Box> 
              <Menu
                            id="menu-appbar2"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu2}
                            sx={{
                                display: { xs: 'block', marginTop: '1em', marginLeft: '2em', },

                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >


                            <Box sx={{ width: '20rem', height: "auto" }}>

                                {user ? (
                                    <><Box><>
                                        <Box>
                                            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4%', marginBottom: '4%' }}>
                                                <Typography sx={{
                                                    color: 'black',
                                                    fontSize: '1.3em',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5em',
                                                    textAlign: 'center',
                                                }}>
                                                    {userInfoLoading ? 'Načítání...' : userInfoError ? 'Chyba' : userInfoData?.getUserByNameAndSurname.Name + ' ' + userInfoData?.getUserByNameAndSurname.Surname}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ borderBottom: '7px solid #b71dde ', marginBottom: '1em' }} ></Box>

                                        <Box sx={{ marginLeft: '7%', marginRight: '7%' }}>
                                            <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', textDecoration: 'none' }}>
                                                notifikace
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

              </Box>
              
              <Box>
              <Box onClick={handleOpenMenu} sx={{ display: 'flex', alignItems: 'center', marginLeft: { xs: '0.1%', md: '2.5em' }, marginTop: '8px' }}>
                <Avatar alt="Remy Sharp" src={demoUser.src} />
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


                            <Box sx={{ width: '20rem', height: "auto" }}>

                                {user ? (
                                    <><Box><>
                                        <Box>
                                            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4%', marginBottom: '4%' }}>
                                                <Typography sx={{
                                                    color: 'black',
                                                    fontSize: '1.3em',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5em',
                                                    textAlign: 'center',
                                                }}>
                                                    {userInfoLoading ? 'Načítání...' : userInfoError ? 'Chyba' : userInfoData?.getUserByNameAndSurname.Name + ' ' + userInfoData?.getUserByNameAndSurname.Surname}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ borderBottom: '7px solid #b71dde ', marginBottom: '1em' }} ></Box>

                                        <Box sx={{ marginLeft: '7%', marginRight: '7%' }}>
                                            <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', textDecoration: 'none' }}>
                                                demo
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
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '1%', }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4vw', marginLeft: '%', marginTop: '8px' }}>{name} {surname}</Typography>
              </Box>

            </Toolbar>
          </AppBar>
          <div
            className="sidebarContainer"
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            style={{
              display: 'block',
              alignItems: 'center',
              backgroundColor: '#F0F2F5',
              width: showOnlyIcon ? '4.5em' : '11em',
              maxWidth: '20em',
              height: '100%',
              position: 'absolute',
              borderRight: `5px solid ${isHovered ? 'rgba(160, 32, 240, 1)' : 'rgba(160, 32, 240, 0.4)'}`,
              padding: '0',
              transition: 'width 0.1s ease-in-out',
            }}>
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  padding: '10px',
                  left: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  verticalAlign: 'center',
                  backgroundColor: activeLink === item.label ? 'white' : 'transparent',
                  borderRight: activeLink === item.label ? "5px solid rgba(160, 32, 240, 1)" :"" , // Zvýraznění aktivního odkazu
                  marginRight: activeLink === item.label ? "-5px" : "0px",
                   // Zvýraznění aktivního odkazu
                }}
              >
                <Box onClick={() => handleLinkClick(item.label)} sx={{ textDecoration: 'none', display: 'flex', padding: '0' }}>
                  <Image
                    src={item.image} // Použijte obrázek z prop item.image
                    alt={item.label}
                    width={30}
                    height={30}
                    style={{ marginRight: '10px', marginLeft: '10px',  }}
                    
                  />
                  <span
                    style={{
                      fontSize: '1.1em',
                      color: 'black',
                      verticalAlign: 'center',
                      marginTop: '5px',
                      marginLeft: '10px',
                      marginRight: '10px',
                      opacity: showOnlyIcon ? 0 : 1,
                      transition: 'opacity 0.1s ease',
                      cursor: 'pointer',
                    }}

                  >
                    {item.label}
                  </span>

                </Box >
              </Box>
            ))}
          </div>
          <div style={{ marginLeft: showOnlyIcon ? '5em' : '12em' }}>
          {activeLink === 'Přehled' && <OverviewComponent />}
          {activeLink === 'Tréninky' && <TrainingsComponent />}
          {activeLink === 'Kalendář' && <CalendarComponent />}
          {activeLink === 'Soupisky' && <RoustersComponent />}
          {activeLink === 'Zápasy' && <NominationsComponent />}
          {activeLink === 'Platby' && <PayComponent />}
          {activeLink === 'Události' && <EventsComponent />}
          {activeLink === 'Tým' && <TeamComponent />}
          {activeLink === 'Členové' &&<MembersComponent id={id as string} />}
          {activeLink === 'Správa' && <SettingsComponent />}
        </div>
        </div>
      )}
    </div>
  );
}

export default Team;
