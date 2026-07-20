import Preloader from "@/components/Preloader/Preloader";
import VideoIntro from "@/components/VideoIntro/VideoIntro";
import Profile from "@/components/Profile/Profile";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <VideoIntro nextSectionId="profile" />
        <Profile id="profile" />
      </main>
    </>
  );
}
