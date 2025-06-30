'use server';

import { createApi } from 'lib/api';
import { ActionResponse, ContactRequest } from 'lib/api/types';
import { validateContactServerActionData } from 'lib/validation/contact';

export async function submitContact(prevState: any, formData: FormData): Promise<ActionResponse> {
  const api = createApi({ language: 'en' });

  // Extract data from FormData
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string
  };

  // Validate the data using Zod
  const validationResult = validateContactServerActionData(rawData);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map((err) => err.message).join(', ');
    return {
      message: `Validation failed: ${errorMessages}`,
      success: false
    };
  }

  // Use validated data
  const contactData: ContactRequest = validationResult.data;

  try {
    const result = await api.submitContact(contactData);
    if (result.isErr()) {
      return {
        message: `Failed to submit contact form. ${result.error.message}`,
        success: false
      };
    }
    return {
      message: result.value.message || 'Message sent successfully!',
      success: true
    };
  } catch (error: any) {
    return {
      message: `Error sending message. ${error.message}`,
      success: false
    };
  }
}
