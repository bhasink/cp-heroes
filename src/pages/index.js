// src/pages/index.js
import Head from 'next/head';
import Header from '../components/Header';
import Banner from '../components/Banner';
import VideoSection from '../components/VideoSection';
import StoryTiles from '../components/StoryTiles';
import StorySubmission from '../components/StorySubmission';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>CenturyHeroes</title>
        <meta property="og:image" content="https://www.centuryply.com/images/preview.jpg"/>
      </Head>
      
      <Header />
      <Banner />
      <VideoSection />
      <StoryTiles />
      <StorySubmission />
      <AboutSection />
      
      <div className="enquire-btn">
        <div className="socialico">
          <ul>
            <li><a href="https://www.facebook.com/CenturyPlyOfficial" target="_blank" rel="noreferrer"><img src="/images/facebook.png" alt="Facebook" /></a></li>
            <li><a href="https://twitter.com/CenturyPlyIndia" target="_blank" rel="noreferrer"><img src="/images/twitter.png" alt="Twitter" /></a></li>
            <li><a href="https://www.linkedin.com/company/century-plyboards-i-limited" target="_blank" rel="noreferrer"><img src="/images/linkedin.png" alt="LinkedIn" /></a></li>
            <li><a href="https://www.instagram.com/centuryply/" target="_blank" rel="noreferrer"><img src="/images/instagram.png" alt="Instagram" /></a></li>
            <li><a href="https://www.youtube.com/channel/UCXPfboDADP6zlKCj35nJSiQ" target="_blank" rel="noreferrer"><img src="/images/youtube.png" alt="YouTube" /></a></li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </>
  );
}