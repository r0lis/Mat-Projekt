import React from 'react';
import NavBar from '@/components/indexPage/Navbar';
import PreFace from '@/components/indexPage/PreFace';
import AppContent from '@/components/indexPage/AppContent';
import ImageCarousel from '@/components/indexPage/ImageCarousel';
import HowToUse from '@/components/indexPage/HowToUse';

export default function Home() {

  return (
    <div>
      <NavBar />
      <PreFace />
      <main>
        <AppContent />
        <ImageCarousel />
        <HowToUse/>
      </main>

    </div>
  );

}