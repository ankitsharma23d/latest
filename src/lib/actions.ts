'use server';

import { z } from 'zod';
import { identifyBlockchainProtocol } from '@/ai/flows/identify-blockchain-protocol';
import { summarizeSupportRequest } from '@/ai/flows/summarize-support-requests';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

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

async function sendEmailNotification(data: any, type: 'Contact' | 'Subscription') {
    try {
        const mailCollection = collection(db, 'mail');
        await addDoc(mailCollection, {
            to: ['sale@blockbuddy.space'],
            message: {
                subject: `New ${type} Form Submission from ${data.name}`,
                html: `
                    <h1>New ${type} Submission</h1>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    ${type === 'Subscription' ? `
                        <p><strong>Protocol:</strong> ${data.protocol === 'Other' ? data.otherProtocol : data.protocol}</p>
                        <p><strong>Network Type:</strong> ${data.networkType === 'Other' ? data.otherNetworkType : data.networkType}</p>
                        <p><strong>Node Type:</strong> ${data.nodeType === 'Other' ? data.otherNodeType : data.nodeType}</p>
                        <p><strong>Query:</strong> ${data.query}</p>
                    ` : `
                        <p><strong>Message:</strong> ${data.message}</p>
                    `}
                `,
            },
        });
        console.log('Email notification entry created.');
    } catch (error) {
        console.error('Error creating email notification entry:', error);
    }
}

export async function submitContactForm(prevState: any, data: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  try {
    const requestsCollection = collection(db, 'requests');
    await addDoc(requestsCollection, {
      ...validatedFields.data,
      type: 'Contact',
      status: 'Requested',
      timestamp: serverTimestamp(),
    });
    
    await sendEmailNotification(validatedFields.data, 'Contact');

    return { message: 'Your message has been sent successfully!', errors: null };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { message: 'An error occurred while submitting the form.', errors: {} };
  }
}


export async function submitSubscriptionQuery(prevState: any, data: z.infer<typeof subscriptionSchema>) {
  const validatedFields = subscriptionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }
  
  try {
    const requestsCollection = collection(db, 'requests');
    const { query, ...rest } = validatedFields.data;
    await addDoc(requestsCollection, {
      ...rest,
      message: query,
      type: 'Subscription',
      status: 'Requested',
      timestamp: serverTimestamp(),
    });

    await sendEmailNotification(validatedFields.data, 'Subscription');

    return { message: 'Your query has been sent successfully!', errors: null };
  } catch (error) {
    console.error('Error submitting subscription query:', error);
    return { message: 'An error occurred while submitting the form.', errors: {} };
  }
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

export async function updateRequestStatus(requestId: string, status: string) {
    try {
        const requestRef = doc(db, 'requests', requestId);
        await updateDoc(requestRef, { status });
        return { success: true };
    } catch (error) {
        console.error('Error updating status:', error);
        return { success: false, error: 'Failed to update status.' };
    }
}
