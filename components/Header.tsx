import { getNavigationItems, getGlobalSettings } from "@/lib/data";
import HeaderClient from "./HeaderClient";
import type { NavigationItem } from "@/lib/types";

// Revalidate every 60 seconds to ensure fresh navigation and settings from Directus
export const revalidate = 60;

export default async function Header() {
  const navigationItems = await getNavigationItems();
  const settings = await getGlobalSettings();
  const siteName = settings?.site_name || "BAOMUE";
  const logo = settings?.logo || undefined;

  // Fallback navigation if Directus returns empty
  const defaultNavigation: NavigationItem[] = navigationItems.length > 0 
    ? navigationItems 
    : [
        { id: 1, title: "หน้าแรก", url: "/", sort: 1, target: "_self" },
        { id: 2, title: "บริการ", url: "/services", sort: 2, target: "_self" },
        { id: 3, title: "โปรโมชั่น", url: "/promotions", sort: 3, target: "_self" },
        { id: 4, title: "บทความ", url: "/blog", sort: 4, target: "_self" },
      ];

  return <HeaderClient navigationItems={defaultNavigation} siteName={siteName} logo={logo} />;
}


