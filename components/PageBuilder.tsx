import HeroBlock from "@/components/blocks/HeroBlock";
import TextBlock from "@/components/blocks/TextBlock";
import AboutUsBlock from "@/components/blocks/AboutUsBlock";
import WhyChooseUsBlock from "@/components/blocks/WhyChooseUsBlock";
import TeamBlock from "@/components/blocks/TeamBlock";
import SignatureTreatmentBlock from "@/components/blocks/SignatureTreatmentBlock";
import SafetyBannerBlock from "@/components/blocks/SafetyBannerBlock";
import ServicesBlock from "@/components/blocks/ServicesBlock";
import LocationsBlock from "@/components/blocks/LocationsBlock";
import BookingBlock from "@/components/blocks/BookingBlock";
import ContactBlock from "@/components/blocks/ContactBlock";
import FormBlock from "@/components/blocks/FormBlock";
import PromotionsBlock from "@/components/blocks/PromotionsBlock";
import PortfolioBlock from "@/components/blocks/PortfolioBlock";
import BlogListingBlock from "@/components/blocks/BlogListingBlock";
import ServiceDetailBlock from "@/components/blocks/ServiceDetailBlock";
import StatsBlock from "@/components/blocks/StatsBlock";
import TestimonialsBlock from "@/components/blocks/TestimonialsBlock";
import Footer from "@/components/Footer";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";
import { ComponentType } from "react";

// Component map - maps block collection names to React components
const componentMap: Record<BlockType, ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>> = {
  block_hero: HeroBlock,
  block_text: TextBlock,
  block_about_us: AboutUsBlock,
  block_why_choose_us: WhyChooseUsBlock,
  block_team: TeamBlock,
  block_signature_treatment: SignatureTreatmentBlock,
  block_safety_banner: SafetyBannerBlock,
  block_services: ServicesBlock,
  block_locations: LocationsBlock,
  block_booking: BookingBlock,
  block_contact: ContactBlock,
  block_form: FormBlock,
  block_footer: Footer as ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>,
  block_features: () => null, // Placeholder - create component if needed
  block_testimonials: TestimonialsBlock,
  block_pricing: () => null, // Placeholder - create component if needed
  block_promotions: PromotionsBlock,
  block_portfolio: PortfolioBlock,
  block_blog_listing: BlogListingBlock,
  block_service_detail: ServiceDetailBlock,
  block_stats: StatsBlock,
  block_page_header: () => null, // Placeholder - create component if needed
};

interface PageBuilderProps {
  blocks: PageBlockWithContent[];
  additionalProps?: {
    locations?: BlockLocations | null;
    formDataMap?: Record<number, Form | null>; // Map of block ID to form data
  };
}

export default function PageBuilder({ blocks, additionalProps = {} }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Filter out blocks without content and sort by sort order
  const visibleBlocks = blocks
    .filter(block => {
      // Skip blocks with no content
      if (block.content === null) return false;

      // Exclude the welcome TextBlock that was removed in browser preview
      if (block.collection === 'block_text' && block.content) {
        const textContent = block.content as any;
        if (textContent.title === "ยินดีต้อนรับสู่ Tooth Box Dental") {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return (
    <>
      {visibleBlocks.map((block) => {
        const Component = componentMap[block.collection];

        // Skip if component not found
        if (!Component) {
          console.warn(`[PageBuilder] Component not found for block type: ${block.collection}`);
          return null;
        }

        // Handle FormBlock special case - needs formData prop
        if (block.collection === 'block_form' && additionalProps.formDataMap) {
          const formData = additionalProps.formDataMap[block.id];
          return (
            <Component
              key={block.id}
              data={block.content}
              formData={formData}
            />
          );
        }

        // Handle ContactBlock special case - needs locations prop
        if (block.collection === 'block_contact' && additionalProps.locations) {
          return (
            <Component
              key={block.id}
              data={block.content}
              locations={additionalProps.locations}
            />
          );
        }

        // Handle Footer component (uses 'block' prop instead of 'data')
        if (block.collection === 'block_footer') {
          return <Component key={block.id} data={block.content} block={block.content} />;
        }

        // Default rendering
        return <Component key={block.id} data={block.content} />;
      })}
    </>
  );
}
