'use server';

import { createApi } from 'lib/api';
import { ContactRequest } from 'lib/api/types';

export async function submitContact(prevState: any, data: ContactRequest) {
  const api = createApi({ language: 'en' });

  try {
    const result = await api.submitContact(data);
    if (result.isErr()) {
      throw new Error('Failed to submit contact form');
    }
    return {
      success: true,
      message: result.value.data.message || 'Message sent successfully!'
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error sending message. Please try again.'
    };
  }
}
