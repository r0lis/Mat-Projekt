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
import { Typography } from '@mui/material';

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




const Sidebar: React.FC<SidebarProps> = ({ items }) => {

    const router = useRouter();
    const { id } = router.query;

    const { loading, error, data } = useQuery(GET_TEAM_DETAILS, {
        variables: { teamId: id },
    });

    if (loading) return <p>Načítání...</p>;
    if (error) return <p>Chyba: {error.message}</p>;

    const team = data.getTeamDetails;
    const teamName = team ? team.Name : '';

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: '#A020F0', display: 'flex', justifyContent: 'space-between', minHeight: '5em' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open sidebar"
                    >
                        <Box sx={{marginTop:'18px'}}>
                            <MenuIcon />
                        </Box>
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '25%', }}>
                        <img src={LogoTeam.src} alt="Team Logo" style={{ width: '3.5em', height: '3.5em', marginRight: '30px',marginTop:'12px'}} />
                       
                            <Typography sx={{ color: 'black', fontSize: '1.7em', marginLeft: '%', marginTop:'12px' }}>{teamName}</Typography>

                        
                    </Box>
                </Toolbar>
            </AppBar>

            <div style={{ display: 'block', alignItems: 'center', backgroundColor: 'white', paddingTop: 'px', maxWidth: '15em', minHeight: '100%', position: 'absolute', borderRight: '4px solid lightgray', padding: '0' }}>

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
