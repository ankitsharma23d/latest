'use server';

import { z } from 'zod';
import { identifyBlockchainProtocol } from '@/ai/flows/identify-blockchain-protocol';
import { summarizeSupportRequest } from '@/ai/flows/summarize-support-requests';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

const subscriptionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  protocol: z.string().min(1, 'Protocol is required.'),
  otherProtocol: z.string().optional(),
  networkType: z.string().min(1, 'Network Type is required.'),
  otherNetworkType: z.string().optional(),
  nodeType: z.string().min(1, 'Node Type is required.'),
  otherNodeType: z.string().optional(),
  query: z.string().min(10, 'Query must be at least 10 characters.'),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  // In a real app, you would save this to a database.
  console.log('New Contact Form Submission:', validatedFields.data);

  return { message: 'Your message has been sent successfully!' };
}


export async function submitSubscriptionQuery(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = subscriptionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }
  
  // In a real app, you would save this to a database.
  console.log('New Subscription Query Submission:', validatedFields.data);

  return { message: 'Your query has been sent successfully!' };
}


export async function runProtocolIdentifier(needs: string) {
  if (!needs || needs.length < 10) {
    return { error: 'Please provide a more detailed description of your needs.' };
  }
  try {
    const result = await identifyBlockchainProtocol({ needs });
    return { data: result };
  } catch (error) {
    console.error('Error in protocol identifier:', error);
    return { error: 'Failed to identify protocol. Please try again.' };
  }
}


export async function runRequestSummary(requestText: string) {
  if (!requestText) {
    return { error: 'No request text provided.' };
  }
  try {
    const result = await summarizeSupportRequest({ requestText });
    return { data: result };
  } catch (error) {
    console.error('Error in request summary:', error);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}
