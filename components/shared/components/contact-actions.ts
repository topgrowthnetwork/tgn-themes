'use server';

import { createApi } from 'lib/api';
import { ActionResponse, ContactRequest } from 'lib/api/types';

export async function submitContact(prevState: any, data: ContactRequest): Promise<ActionResponse> {
  const api = createApi({ language: 'en' });

  try {
    const result = await api.submitContact(data);
    if (result.isErr()) {
      return {
        message: `Failed to submit contact form. ${result.error.message}`,
        success: false
      };
    }
    return {
      message: result.value.data.message || 'Message sent successfully!',
      success: true
    };
  } catch (error: any) {
    return {
      message: `Error sending message. ${error.message}`,
      success: false
    };
  }
}
