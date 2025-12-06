export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_features: BlockFeatures[];
  block_testimonials: BlockTestimonials[];
  block_pricing: BlockPricing[];
  block_footer: BlockFooter[];
  block_about_us: BlockAboutUs[];
  block_why_choose_us: BlockWhyChooseUs[];
  block_team: BlockTeam[];
  block_signature_treatment: BlockSignatureTreatment[];
  block_safety_banner: BlockSafetyBanner[];
  block_services: BlockServices[];
  block_locations: BlockLocations[];
  block_booking: BlockBooking[];
  block_contact: BlockContact[];
  block_text: BlockText[];
  block_form: BlockForm[];
  forms: Form[];
  form_fields: FormField[];
  page_features: PageFeature[];
  page_testimonials: PageTestimonial[];
  page_pricing_plans: PagePricingPlan[];
  global_settings: GlobalSettings;
  service_categories: ServiceCategory[];
  services: Service[];
  navigation: NavigationItem[];
  blog_categories: BlogCategory[];
  blog_posts: BlogPost[];
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  blocks?: Block[];
}

export interface Block {
  id: string;
  collection: string;
  item: BlockHero | BlockFeatures | BlockTestimonials | BlockPricing | BlockFooter;
}

export interface PageBlock {
  id: number;
  page: number;
  collection: string;
  item: string;
  sort: number;
}

export interface BlockHero {
  id: number;
  badge_text?: string;
  headline_line1?: string;
  headline_line2?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  background_image?: string;
}

export interface BlockFeatures {
  id: number;
  section_title?: string;
  section_description?: string;
}

export interface BlockTestimonials {
  id: number;
  section_title?: string;
  section_description?: string;
}

export interface BlockPricing {
  id: number;
  section_title?: string;
  section_description?: string;
}

export interface BlockFooter {
  id: number;
  content?: FooterContent;
}

export interface FooterContent {
  site_name?: string;
  description?: string;
  product_links?: Link[];
  company_links?: Link[];
  legal_links?: Link[];
  copyright?: string;
  social_links?: SocialLink[];
}

export interface Link {
  text: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
}

export interface PageFeature {
  id: number;
  page: number;
  title: string;
  description?: string;
  icon?: string;
  layout_type?: 'normal' | 'wide' | 'dark';
  visual_data?: any;
  sort?: number;
}

export interface PageTestimonial {
  id: number;
  page: number;
  quote: string;
  author_name: string;
  role?: string;
  rating?: number;
  avatar_initial?: string;
  sort?: number;
}

export interface PagePricingPlan {
  id: number;
  page: number;
  plan_name: string;
  price?: string;
  price_period?: string;
  features?: string[];
  cta_text?: string;
  cta_link?: string;
  is_featured?: boolean;
  badge_text?: string;
  sort?: number;
}

export interface GlobalSettings {
  id: number;
  site_name?: string;
  site_description?: string;
  logo?: string;
  favicon?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  sort?: number;
}

export interface ServiceHighlight {
  title: string;
  description: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  status: 'published' | 'draft';
  category?: ServiceCategory | number | null;
  short_description?: string;
  long_description?: string;
  duration_label?: string;
  price_from?: string;
  hero_image?: string;
  seo_title?: string;
  seo_description?: string;
  highlights?: ServiceHighlight[];
}

export interface BlockAboutUs {
  id: number;
  headline?: string;
  subtitle?: string;
  paragraph_1?: string;
  paragraph_2?: string;
  paragraph_3?: string;
  image_url?: string;
}

export interface BlockWhyChooseUs {
  id: number;
  title?: string;
  subtitle?: string;
  point_1_title?: string;
  point_1_text?: string;
  point_2_title?: string;
  point_2_text?: string;
  point_3_title?: string;
  point_3_text?: string;
  point_4_title?: string;
  point_4_text?: string;
}

export interface BlockTeam {
  id: number;
  title?: string;
  subtitle?: string;
  note?: string;
  dentists?: Array<{
    name: string;
    specialty: string;
    photo_url?: string;
    linkedin_url?: string;
  }>;
}

export interface BlockSignatureTreatment {
  id: number;
  title?: string;
  subtitle?: string;
  steps?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  stat_1_label?: string;
  stat_1_value?: string;
  stat_2_label?: string;
  stat_2_value?: string;
  price_text?: string;
  before_image_url?: string;
  month3_image_url?: string;
  month6_image_url?: string;
  after_image_url?: string;
}

export interface BlockSafetyBanner {
  id: number;
  title?: string;
  subtitle?: string;
  points?: Array<{
    label: string;
  }>;
}

export interface BlockServices {
  id: number;
  title?: string;
  subtitle?: string;
  services?: Array<{
    label: string;
    icon_name?: string;
  }>;
}

export interface BlockLocations {
  id: number;
  section_title?: string;
  section_subtitle?: string;
  branch_name?: string;
  branch_tag?: string;
  branch_address?: string;
  branch_hours?: string;
  branch_phone?: string;
  branch_image_url?: string;
  map_embed_url?: string;
}

export interface BlockBooking {
  id: number;
  title?: string;
  subtitle?: string;
  phone_label?: string;
  phone_number?: string;
  line_label?: string;
  line_handle?: string;
  hours_label?: string;
  hours_value?: string;
}

export interface BlockContact {
  id: number;
  title?: string;
  subtitle?: string;
  hq_title?: string;
  hq_address?: string;
  phone_title?: string;
  phone_text?: string;
  hours_title?: string;
  hours_text?: string;
  email_title?: string;
  email_text?: string;
}

export interface BlockText {
  id: number;
  title?: string;
  subtitle?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  background_color?: string;
}

export interface BlockForm {
  id: number;
  form?: number | null;
  title?: string;
  description?: string;
  background_style?: 'white' | 'gray' | 'primary';
}

export interface Form {
  id: number;
  name: string;
  slug: string;
  description?: string;
  submit_button_text?: string;
  success_message?: string;
  redirect_url?: string;
  email_notifications?: boolean;
  notification_email?: string;
  fields?: FormField[];
}

export interface FormField {
  id: number;
  form: number;
  label: string;
  field_type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: Array<{ label: string; value: string }>;
  sort?: number;
}

export interface NavigationItem {
  id: number;
  title: string;
  url?: string | null;
  page?: Page | number | null;
  parent?: NavigationItem | number | null;
  target?: '_self' | '_blank';
  sort?: number | null;
  children?: NavigationItem[];
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  sort?: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: BlogCategory | number | null;
  featured_image?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  published_date?: string;
  reading_time?: number;
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

// Mutation types
export interface FormSubmission {
  id: number;
  form?: number | null;
  data: Record<string, any>;
  status: 'pending' | 'processed' | 'archived';
  date_created?: string;
  user_created?: string;
}

export interface CreateFormSubmissionInput {
  formId: number;
  data: Record<string, any>;
}

export interface UpdateItemInput<T = any> {
  collection: string;
  id: number | string;
  data: Partial<T>;
}

export interface DeleteItemInput {
  collection: string;
  id: number | string;
}

