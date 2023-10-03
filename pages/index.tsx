import React from 'react';
import NavBar from '@/components/indexPage/Navbar';
import PreFace from '@/components/indexPage/PreFace';
import AppContent from '@/components/indexPage/AppContent';
import ImageCarousel from '@/components/indexPage/ImageCarousel';


export default function Home() {

  return (
    <div>
      <NavBar />
      <PreFace />
      <main>
        <AppContent />
        <ImageCarousel />
      </main>

    </div>
  );

}