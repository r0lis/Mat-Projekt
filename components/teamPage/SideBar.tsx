import React from 'react';
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
import { Typography, CircularProgress, Avatar } from '@mui/material'; // Importujte CircularProgress z MUI
import ChatIcon from '@mui/icons-material/Chat';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import demoUser from '@/public/demoUser.png';
import { authUtils } from '../../firebase/auth.utils';



interface SidebarProps {
    items: string[]; // seznam položek v Sidebaru
}

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


const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    const router = useRouter();
    const { id } = router.query;
    const user = authUtils.getCurrentUser();


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

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: '#A020F0', display: 'flex', justifyContent: 'space-between', minHeight: '5em' }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open sidebar">
                        <Box sx={{ marginTop: '18px' }}>
                            <Link href={`/`}>
                                <MenuIcon sx={{ color: 'white' }} />
                            </Link>
                        </Box>
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20%', }}>
                        <img src={LogoTeam.src} alt="Team Logo" style={{ width: '3.5em', height: '3.5em', marginRight: '30px', marginTop: '12px' }} />
                        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.7em', marginLeft: '%', marginTop: '12px' }}>{teamName}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20%', }}>
                        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4em', marginLeft: '%', marginTop: '12px' }}>Management</Typography>
                    </Box>

                    <IconButton color="inherit" aria-label="open sidebar" sx={{ display: 'flex', marginLeft: '3%', fontSize: '24px' }}>
                        <Box sx={{ display: 'flex', marginTop: '18px' }}>
                            <Link href={`/`}>
                                <ChatIcon sx={{ color: 'white' }} />
                            </Link>
                        </Box>
                    </IconButton>

                    <IconButton color="inherit" aria-label="open sidebar" sx={{ display: 'flex', marginLeft: '0.5%', fontSize: '24px' }}>
                        <Box sx={{ display: 'flex', marginTop: '18px' }}>
                            <Link href={`/`}>
                                <CircleNotificationsIcon sx={{ color: 'white' }} />
                            </Link>
                        </Box>
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '3%', marginTop: '12px' }}>
                        <Avatar alt="Remy Sharp" src={demoUser.src} />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '1%', }}>
                        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4em', marginLeft: '%', marginTop: '12px' }}>{name} {surname}</Typography>
                    </Box>

                </Toolbar>
            </AppBar>
            <div style={{ display: 'block', alignItems: 'center', backgroundColor: 'white', paddingTop: 'px', maxWidth: '20em',width:'15%', minHeight: '100%', position: 'absolute', borderRight: '4px solid lightgray', padding: '0' }}>
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            padding: '10px',
                            left: '0px',
                            display: 'flex',
                            alignItems: 'center',
                            verticalAlign: 'center',
                        }}
                    >
                        <Link href={`/Team/${item}`} style={{ textDecoration: 'none', display: 'flex', padding: '0' }}>
                            <img src={GroupImg.src} alt="Group" style={{ width: '35px', height: '35px', marginRight: '10px', marginLeft: '10px' }} />
                            <span style={{ fontSize: '1.2em', color: 'black', verticalAlign: 'center', marginTop: '5px', marginLeft: '10px', marginRight: '10px' }}>{item}</span>
                        </Link>
                    </Box>
                ))}
            </div>
            <div style={{ marginLeft: '15em' }}>ahoj</div>
        </div>
    );
};

export default Sidebar;
