
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import GroupImg from '@/public/people.png';
import Box from '@mui/material/Box';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoTeam from '@/public/logotym.png';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Typography, CircularProgress, Avatar, useMediaQuery, Theme } from '@mui/material'; // Importujte CircularProgress z MUI
import ChatIcon from '@mui/icons-material/Chat';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import demoUser from '@/public/demoUser.png';
import { authUtils } from '../../firebase/auth.utils';
import Overview from '../../public/Overview.png';
import Trainings from '../../public/training.png';
import Calendar from '../../public/Kalendar.png';
import Rousters from '../../public/network.png';
import Nominations from '../../public/Nomination.png';
import Pay from '../../public/pay.png';
import Events from '../../public/Event.png';
import Members from '../../public/Members.png';
import Settings from '../../public/Settings.png';
import type { StaticImageData } from 'next/image';
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


const items = [
  { label: 'Přehled', image: Overview },
  { label: 'Tréninky', image: Trainings },
  { label: 'Kalendář', image: Calendar },
  { label: 'Soupisky', image: Rousters },
  { label: 'Nominace', image: Nominations },
  { label: 'Platby', image: Pay },
  { label: 'Události', image: Events },
  { label: 'Členové', image: Members },
  { label: 'Správa', image: Settings },
];

const GET_TEAM_DETAILS = gql`
query GetTeamDetails($teamId: String!) {
  getTeamDetails(teamId: $teamId) {
    Name
    Members
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
                <Box sx={{ marginTop: '18px' }}>
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

              <IconButton color="inherit" aria-label="open sidebar" sx={{ display: 'flex', marginLeft: { xs: '0.1%', md: '0.5%' }, fontSize: '24px' }}>
                <Box sx={{ display: 'flex', marginTop: '14px' }}>
                  <Link href={`/`}>
                    <CircleNotificationsIcon sx={{ color: 'white' }} />
                  </Link>
                </Box>
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: { xs: '0.1%', md: '3%' }, marginTop: '8px' }}>
                <Avatar alt="Remy Sharp" src={demoUser.src} />
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
              backgroundColor: 'white',
              paddingTop: 'px',
              width: showOnlyIcon ? '4.5em' : '11em',
              maxWidth: '20em',
              minHeight: '100%',
              position: 'absolute',
              borderRight: `4px solid ${isHovered ? 'rgba(160, 32, 240, 1)' : 'rgba(160, 32, 240, 0.4)'}`,
              padding: '0',
              transition: 'width 0.5s ease-in-out',
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
                  backgroundColor: activeLink === item.label ? 'lightgray' : 'transparent', // Zvýraznění aktivního odkazu
                }}
              >
                <Box onClick={() => handleLinkClick(item.label)} sx={{ textDecoration: 'none', display: 'flex', padding: '0' }}>
                  <Image
                    src={item.image} // Použijte obrázek z prop item.image
                    alt={item.label}
                    width={30}
                    height={30}
                    style={{ marginRight: '10px', marginLeft: '10px' }}
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
                      transition: 'opacity 0.5s ease',
                      cursor: 'pointer',
                    }}

                  >
                    {item.label}
                  </span>

                </Box >
              </Box>
            ))}
          </div>
          <div style={{ marginLeft: showOnlyIcon ? '5em' : '15em' }}>
          {activeLink === 'Přehled' && <OverviewComponent />}
          {activeLink === 'Tréninky' && <TrainingsComponent />}
          {activeLink === 'Kalendář' && <CalendarComponent />}
          {activeLink === 'Soupisky' && <RoustersComponent />}
          {activeLink === 'Nominace' && <NominationsComponent />}
          {activeLink === 'Platby' && <PayComponent />}
          {activeLink === 'Události' && <EventsComponent />}
          {activeLink === 'Členové' && <MembersComponent />}
          {activeLink === 'Správa' && <SettingsComponent />}
        </div>
        </div>
      )}
    </div>
  );
}

export default Team;
