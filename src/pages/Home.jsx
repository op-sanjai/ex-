import ScrollMorphHero from '../sections/Hero/ScrollMorphHero'
import JourneyIntro from '../components/sections/JourneyIntro/JourneyIntro'
import WhyChooseUs from '../components/sections/WhyChooseUs/WhyChooseUs'
import Statistics from '../components/sections/Statistics/Statistics'
import Destinations from '../components/sections/Destinations/Destinations'
import TripCategories from '../components/sections/TripCategories/TripCategories'
import Packages from '../components/sections/Packages/Packages'
import CollegeTours from '../components/sections/CollegeTours/CollegeTours'
import CoupleTours from '../components/sections/CoupleTours/CoupleTours'
import Reviews from '../components/sections/Reviews/Reviews'
import Gallery from '../components/sections/Gallery/Gallery'
import FinalCTA from '../components/sections/FinalCTA/FinalCTA'

export default function Home() {
  return (
    <>
      <ScrollMorphHero />
      <JourneyIntro />
      <WhyChooseUs />
      <Statistics />
      <Destinations />
      <TripCategories />
      <Packages />
      <CollegeTours />
      <CoupleTours />
      <Reviews />
      <Gallery />
      <FinalCTA />
    </>
  )
}
