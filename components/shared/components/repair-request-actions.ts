'use server';

import { createApi } from 'lib/api';
import { validateRepairRequestServerActionData } from 'lib/validation/repair-request';
import { getLocale } from 'next-intl/server';

interface RepairRequestResponse {
  message: string;
  success: boolean;
}

export async function submitRepairRequest(
  _prevState: RepairRequestResponse,
  formData: FormData
): Promise<RepairRequestResponse> {
  try {
    const locale = await getLocale();
    const api = createApi({ language: locale });

    // Validate form data
    const dataToValidate = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      state: formData.get('state') as string,
      category: formData.get('category') as string,
      // product: formData.get('product') as string,
      message: formData.get('message') as string
    };

    const validationResult = validateRepairRequestServerActionData(dataToValidate);

    if (!validationResult.success) {
      return {
        message: validationResult.error.errors[0]?.message || 'Validation failed',
        success: false
      };
    }

    // Submit contact form using the API
    const result = await api.submitContact({
      name: validationResult.data.name,
      email: validationResult.data.email,
      phone: validationResult.data.phone,
      message: dataToValidate.message,
      data: {
        city: validationResult.data.state,
        category: validationResult.data.category
        // product: validationResult.data.product || ''
      }
    });

    if (result.isErr()) {
      return {
        message: result.error.message || 'Failed to submit repair request',
        success: false
      };
    }

    return {
      message: result.value.message,
      success: true
    };
  } catch (error) {
    console.error('Repair request submission error:', error);
    return {
      message: 'An unexpected error occurred',
      success: false
    };
  }
}
