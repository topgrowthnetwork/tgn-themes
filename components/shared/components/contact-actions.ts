'use server';

import { createApi } from 'lib/api';
import { ActionResponse, ContactRequest } from 'lib/api/types';
import { err, ok, Result } from 'neverthrow';

export async function submitContact(
  prevState: any,
  data: ContactRequest
): Promise<Result<ActionResponse, ActionResponse>> {
  const api = createApi({ language: 'en' });

  try {
    const result = await api.submitContact(data);
    if (result.isErr()) {
      return err({
        message: 'Failed to submit contact form'
      });
    }
    return ok({
      message: result.value.data.message || 'Message sent successfully!'
    });
  } catch (error: any) {
    return err({
      message: 'Error sending message. Please try again.'
    });
  }
}
