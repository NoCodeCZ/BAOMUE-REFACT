import directus from './directus';
import { createItem, createItems, updateItems, deleteItems } from '@directus/sdk';
import { logDirectusError } from './errors';

const createItemTyped = createItem as any;
const createItemsTyped = createItems as any;
const updateItemsTyped = updateItems as any;
const deleteItemsTyped = deleteItems as any;

/**
 * Create form submission
 */
export async function createFormSubmission(
  formId: number | null,
  data: Record<string, any>
): Promise<{ id: number } | null> {
  try {
    const payload: Record<string, any> = {
      form: formId,
      data: data,
      status: 'new',
    };

    // Write booking data to dedicated fields for admin readability
    if (data.form_type === 'booking') {
      if (data.name) payload.customer_name = data.name;
      if (data.phone) payload.phone = data.phone;
      if (data.branch) payload.branch = data.branch;
      if (data.service) payload.service = data.service;
      if (data.preferred_date) payload.preferred_date = data.preferred_date;
      if (data.preferred_time) payload.preferred_time = data.preferred_time;
      if (data.note) payload.note = data.note;
    }

    const result = await directus.request(
      createItemTyped('form_submissions', payload)
    );
    return result || null;
  } catch (error) {
    logDirectusError('createFormSubmission', error);
    return null;
  }
}

/**
 * Create contact form submission
 */
export async function createContactSubmission(
  name: string,
  email: string,
  message: string,
  phone?: string
): Promise<{ id: number } | null> {
  try {
    const result = await directus.request(
      createItemsTyped('form_submissions', {
        items: [
          {
            form: null, // Or link to contact form if exists
            data: {
              name,
              email,
              phone,
              message,
            },
            status: 'pending',
          },
        ],
      })
    );
    return result?.[0] || null;
  } catch (error) {
    logDirectusError('createContactSubmission', error);
    return null;
  }
}

/**
 * Update item in collection
 */
export async function updateItem<T = any>(
  collection: string,
  id: number | string,
  data: Partial<T>
): Promise<T | null> {
  try {
    const result = await directus.request(
      updateItemsTyped(collection, {
        keys: [id],
        data,
      })
    );
    return result?.[0] || null;
  } catch (error) {
    logDirectusError(`updateItem(${collection})`, error);
    return null;
  }
}

/**
 * Delete item from collection
 */
export async function deleteItem(
  collection: string,
  id: number | string
): Promise<boolean> {
  try {
    await directus.request(
      deleteItemsTyped(collection, {
        keys: [id],
      })
    );
    return true;
  } catch (error) {
    logDirectusError(`deleteItem(${collection})`, error);
    return false;
  }
}

