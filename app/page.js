import Preloader from "@/components/Preloader/Preloader";
import Nav from "@/components/Nav/Nav";
import ProgressRail from "@/components/ProgressRail/ProgressRail";
import VideoIntro from "@/components/VideoIntro/VideoIntro";
import Profile from "@/components/Profile/Profile";
import Dashboard from "@/components/Dashboard/Dashboard";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <ProgressRail />
      <main>
        <VideoIntro nextSectionId="profile" />
        <Profile id="profile" />
        <Dashboard />
        <Footer id="connect" />
      </main>
    </>
  );
}
