import directus from './directus';
import { createItems, updateItems, deleteItems } from '@directus/sdk';
import { logDirectusError } from './errors';

const createItemsTyped = createItems as any;
const updateItemsTyped = updateItems as any;
const deleteItemsTyped = deleteItems as any;

/**
 * Create form submission
 */
export async function createFormSubmission(
  formId: number,
  data: Record<string, any>
): Promise<{ id: number } | null> {
  try {
    const result = await directus.request(
      createItemsTyped('form_submissions', {
        items: [
          {
            form: formId,
            data: data,
            status: 'pending',
          },
        ],
      })
    );
    return result?.[0] || null;
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

