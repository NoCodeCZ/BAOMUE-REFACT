# Fix Dentists Field in Directus - Manual Instructions

The `dentists` field in `block_team` collection is currently a JSON list field but doesn't have nested field definitions, which causes it to appear blank in Directus.

## Quick Fix (Recommended - Do This First)

1. **Open Directus Admin Panel**
2. Go to **Settings → Data Model**
3. Click on **block_team** collection
4. Click on the **dentists** field
5. Click **Edit Field**
6. In the **Interface Options** section, add the following configuration:

```json
{
  "fields": [
    {
      "field": "name",
      "name": "Name",
      "type": "string",
      "meta": {
        "field": "name",
        "interface": "input",
        "width": "full",
        "required": true,
        "type": "string"
      }
    },
    {
      "field": "nickname",
      "name": "Nickname",
      "type": "string",
      "meta": {
        "field": "nickname",
        "interface": "input",
        "width": "half",
        "required": false,
        "type": "string"
      }
    },
    {
      "field": "specialty",
      "name": "Specialty",
      "type": "text",
      "meta": {
        "field": "specialty",
        "interface": "input-multiline",
        "width": "full",
        "required": true,
        "type": "text"
      }
    },
    {
      "field": "photo_url",
      "name": "Photo URL",
      "type": "string",
      "meta": {
        "field": "photo_url",
        "interface": "input",
        "width": "half",
        "required": false,
        "type": "string",
        "note": "Directus file ID or external URL"
      }
    },
    {
      "field": "linkedin_url",
      "name": "LinkedIn URL",
      "type": "string",
      "meta": {
        "field": "linkedin_url",
        "interface": "input",
        "width": "half",
        "required": false,
        "type": "string"
      }
    }
  ]
}
```

7. Update the **Note** field to: "Array of dentists with their profiles. Click + to add a new dentist."
8. Click **Save**

After this, you should be able to see and edit dentist profiles in the `block_team` collection items.

## Alternative: Better Long-term Solution

If you want a more user-friendly experience, we can create a separate `dentists` collection and link it via M2M relationship. This would allow you to:
- Manage dentists as separate items
- Reuse dentists across multiple team blocks
- Have better search and filtering
- Easier bulk editing

Let me know if you'd like me to set up the separate collection approach!

