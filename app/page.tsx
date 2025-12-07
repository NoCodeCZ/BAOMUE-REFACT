import Header from "@/components/Header";
import HeroBlock from "@/components/blocks/HeroBlock";
import TextBlock from "@/components/blocks/TextBlock";
import ContactBlock from "@/components/blocks/ContactBlock";
import AboutUsBlock from "@/components/blocks/AboutUsBlock";
import WhyChooseUsBlock from "@/components/blocks/WhyChooseUsBlock";
import TeamBlock from "@/components/blocks/TeamBlock";
import SignatureTreatmentBlock from "@/components/blocks/SignatureTreatmentBlock";
import SafetyBannerBlock from "@/components/blocks/SafetyBannerBlock";
import ServicesBlock from "@/components/blocks/ServicesBlock";
import LocationsBlock from "@/components/blocks/LocationsBlock";
import BookingBlock from "@/components/blocks/BookingBlock";
import Footer from "@/components/Footer";
import {
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
} from "@/lib/data";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");

  let blocksWithContent: any[] = [];

  if (page) {
    const pageBlocks = await getPageBlocks(page.id);
    blocksWithContent = await Promise.all(
      pageBlocks.map(async (block: any) => ({
        ...block,
        content: await getBlockContent(block.collection, block.item),
      }))
    );
  }

  const findBlock = (collection: string) =>
    blocksWithContent.find((b) => b.collection === collection)?.content as any;

  const hero = findBlock("block_hero");
  const text = findBlock("block_text");
  const about = findBlock("block_about_us");
  const why = findBlock("block_why_choose_us");
  const team = findBlock("block_team");
  const signature = findBlock("block_signature_treatment");
  const safety = findBlock("block_safety_banner");
  const services = findBlock("block_services");
  const locations = findBlock("block_locations");
  const booking = findBlock("block_booking");
  const contact = findBlock("block_contact");
  const footer = findBlock("block_footer");

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />

      {hero && <HeroBlock data={hero} />}
      {text && <TextBlock data={text} />}
      {about && <AboutUsBlock data={about} />}
      {why && <WhyChooseUsBlock data={why} />}
      {team && <TeamBlock data={team} />}
      {signature && <SignatureTreatmentBlock data={signature} />}
      {safety && <SafetyBannerBlock data={safety} />}
      {services && <ServicesBlock data={services} />}
      {locations && <LocationsBlock data={locations} />}
      {booking && <BookingBlock data={booking} />}
      {contact && <ContactBlock data={contact} locations={locations} />}

      {footer && <Footer block={footer} />}
    </main>
  );
}
