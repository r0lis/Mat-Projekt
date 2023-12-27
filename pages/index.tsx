import React from 'react';
import NavBar from '@/components/indexPage/Navbar';
import PreFace from '@/components/indexPage/PreFace';
import AppContent from '@/components/indexPage/AppContent';
import ImageCarousel from '@/components/indexPage/ImageCarousel';
import HowToUse from '@/components/indexPage/HowToUse';
import FooterImg from '@/components/indexPage/FooterImg';
import Footer from '@/components/indexPage/Footer';
import { Box } from '@mui/material';

export default function Home() {

  return (
    <Box >
      <NavBar />
      <PreFace />
      <main>
        <AppContent />                            
        <ImageCarousel />                                                                               
        <HowToUse/>
      </main>                                        
      <footer>
        <FooterImg/>                         
        <Footer />
      </footer>

    </Box>
  );

}