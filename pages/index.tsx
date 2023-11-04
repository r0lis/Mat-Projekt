import React from 'react';
import NavBar from '@/components/indexPage/Navbar';
import PreFace from '@/components/indexPage/PreFace';
import AppContent from '@/components/indexPage/AppContent';
import ImageCarousel from '@/components/indexPage/ImageCarousel';
import HowToUse from '@/components/indexPage/HowToUse';
import FooterImg from '@/components/indexPage/FooterImg';
import Footer from '@/components/indexPage/Footer';

export default function Home() {

  return (
    <div >
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

    </div>
  );

}