# Navigation Guide

## What is the Navigation Collection?

The **Navigation** collection manages your website's menu items. Control what appears in your main navigation menu, footer menu, and other navigation areas.

## Common Tasks

### Viewing Navigation Items

1. Go to **Navigation** in the left sidebar
2. You'll see all menu items listed
3. Items are organized by their sort order

### Adding a Menu Item

1. Go to **Navigation**
2. Click **Create Item** (or the "+" button)
3. Fill in:
   - **Title** - What appears in the menu
   - **URL** - Link destination (or link to a Page)
   - **Sort Order** - Position in menu (lower = appears first)
4. Click **Save**

### Editing a Menu Item

1. Go to **Navigation**
2. Find the menu item
3. Click on it to edit
4. Make your changes
5. Click **Save**

### Reordering Menu Items

1. Edit each menu item
2. Change the **Sort Order** number:
   - Sort = 1 appears first
   - Sort = 2 appears second
   - And so on...
3. Click **Save** on each item

### Creating Dropdown Menus

1. Create parent menu item (e.g., "Services")
2. Create child items (e.g., "Teeth Whitening", "Implants")
3. Set child items' **Parent** field to the parent item
4. Set appropriate sort orders

## Field-by-Field Guide

### Title
- **What it is:** Text that appears in the menu
- **Best practice:** Keep it short and clear
- **Examples:**
  - "Home"
  - "Services"
  - "About Us"
  - "Contact"

### URL
- **What it is:** Link destination for the menu item
- **Options:**
  - External URL: "https://example.com"
  - Internal page: Leave empty and use **Page** field instead
  - Anchor link: "#section-name"
- **Tip:** Use **Page** field to link to internal pages (easier)

### Page
- **What it is:** Link to an internal page
- **How to use:** Select a page from dropdown
- **Benefit:** Automatically uses correct URL, updates if page slug changes
- **Tip:** Use this instead of URL for internal pages

### Parent
- **What it is:** Parent menu item (for dropdowns)
- **How to use:** Select another navigation item as parent
- **Result:** Creates a dropdown/submenu
- **Example:** "Services" is parent, "Teeth Whitening" is child

### Target
- **What it is:** How the link opens
- **Options:**
  - "_self" - Opens in same window (default)
  - "_blank" - Opens in new tab
- **Use "_blank" for:** External links you want in new tab

### Sort Order
- **What it is:** Position in menu
- **How it works:**
  - Lower number = appears first/left
  - Higher number = appears later/right
- **Examples:**
  - Sort = 1: First item (usually "Home")
  - Sort = 2: Second item
  - Sort = 10: Later in menu

## Best Practices

### Menu Organization

1. **Keep it simple** - Don't overcrowd the menu
2. **Logical order** - Most important items first
3. **Clear labels** - Use clear, descriptive titles
4. **Consistent style** - Use similar naming patterns
5. **Limit items** - 5-7 main items ideal

### Common Menu Structure

**Typical main menu:**
1. Home (Sort: 1)
2. Services (Sort: 2)
3. About Us (Sort: 3)
4. Blog (Sort: 4)
5. Contact (Sort: 5)

**With dropdown:**
- Services (Sort: 2)
  - All Services (Sort: 2.1, Parent: Services)
  - Teeth Whitening (Sort: 2.2, Parent: Services)
  - Implants (Sort: 2.3, Parent: Services)

### Naming Conventions

- Use title case: "About Us" not "about us"
- Keep it short: "Services" not "Our Services"
- Be consistent: "Contact" not "Contact Us" in one place and "Get in Touch" in another

## Examples

### Example: Creating a Simple Menu

1. Go to **Navigation** → Create Item
2. **Title:** "Home"
3. **Page:** Select "Home" page
4. **Sort Order:** 1
5. Save

6. Create Item
7. **Title:** "Services"
8. **Page:** Select "Services" page
9. **Sort Order:** 2
10. Save

11. Create Item
12. **Title:** "About Us"
13. **Page:** Select "About" page
14. **Sort Order:** 3
15. Save

16. Create Item
17. **Title:** "Contact"
18. **Page:** Select "Contact" page
19. **Sort Order:** 4
20. Save

### Example: Creating a Dropdown Menu

**Parent Item:**
1. Create Item
2. **Title:** "Services"
3. **Page:** Select "Services" page (or leave empty)
4. **Sort Order:** 2
5. Save

**Child Items:**
1. Create Item
2. **Title:** "All Services"
3. **Page:** Select "Services" page
4. **Parent:** Select "Services" (the parent)
5. **Sort Order:** 1
6. Save

7. Create Item
8. **Title:** "Teeth Whitening"
9. **Page:** Select service page (or use URL)
10. **Parent:** Select "Services"
11. **Sort Order:** 2
12. Save

### Example: Adding External Link

1. Create Item
2. **Title:** "Facebook"
3. **URL:** "https://facebook.com/yourpage"
4. **Target:** "_blank" (opens in new tab)
5. **Sort Order:** 10
6. Save

## Troubleshooting

**Q: Menu items are in wrong order**
- Edit each item and change **Sort Order**
- Lower numbers appear first
- Save each item

**Q: Dropdown isn't working**
- Check **Parent** field is set correctly
- Verify parent item exists
- Check sort orders are correct

**Q: Link goes to wrong page**
- Check **Page** field selection
- Or verify **URL** is correct
- Make sure page exists and is published

**Q: Menu item isn't showing**
- Check sort order (might be too high)
- Verify item is saved
- Check if there are filters applied
- Contact administrator if still not visible

**Q: I want to remove a menu item**
- Edit the item
- Delete it (or archive if that option exists)
- Or change sort order to very high number to hide it

## Related Collections

- **Pages** - Link menu items to pages
- **Services** - May link to service pages
- **Global Settings** - Site name appears in navigation

---

*For more help, see USER_GUIDE.md or contact your administrator.*

