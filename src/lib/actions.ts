'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';
import { identifyBlockchainProtocol } from '@/ai/flows/identify-blockchain-protocol';
import { summarizeSupportRequest } from '@/ai/flows/summarize-support-requests';
import { db } from '@/lib/firebase';
import { collection, serverTimestamp, doc, updateDoc, setDoc, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';

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

const chatMessageSchema = z.object({
    chatId: z.string(),
    sender: z.enum(['user', 'agent']),
    text: z.string().min(1, 'Message cannot be empty.'),
  });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function submitContactForm(data: z.infer<typeof contactSchema>) {
    const validatedFields = contactSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed.',
        };
    }

    const { name, email, message } = validatedFields.data;
    const sanitizedName = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    const dateString = format(new Date(), 'yyyy-MM-dd-HH-mm-ss-SSS');
    const docId = `${sanitizedName}-${dateString}`;

    const docData = {
        id: docId,
        name,
        email,
        message,
        type: 'Contact',
        status: 'Requested',
        timestamp: serverTimestamp(),
    };

    try {
        await setDoc(doc(db, 'requests', docId), docData);
        
        const mailOptions = {
            from: `"BlockBuddy" <${process.env.EMAIL_USERNAME}>`,
            to: 'sale@blockbuddy.space',
            subject: 'New Contact Form Submission',
            text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `<p>You have a new contact form submission:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li><li><strong>Message:</strong> ${message}</li></ul>`,
        };
        await transporter.sendMail(mailOptions);

        return { message: 'Your message has been sent successfully!', errors: null };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return { message: 'An error occurred while submitting the form.', errors: { _form: ['Server error'] } };
    }
}


export async function submitSubscriptionQuery(data: z.infer<typeof subscriptionSchema>) {
    const validatedFields = subscriptionSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Validation failed.',
        };
    }
    
    const { name, email, query, protocol, otherProtocol, networkType, otherNetworkType, nodeType, otherNodeType } = validatedFields.data;
    const sanitizedName = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    const dateString = format(new Date(), 'yyyy-MM-dd-HH-mm-ss-SSS');
    const docId = `${sanitizedName}-${dateString}`;

    const docData = {
        id: docId,
        name,
        email,
        message: query,
        protocol,
        otherProtocol: otherProtocol || '',
        networkType,
        otherNetworkType: otherNetworkType || '',
        nodeType,
        otherNodeType: otherNodeType || '',
        type: 'Subscription',
        status: 'Requested',
        timestamp: serverTimestamp(),
    };
    
    try {
        await setDoc(doc(db, 'requests', docId), docData);

        const mailOptions = {
            from: `"BlockBuddy" <${process.env.EMAIL_USERNAME}>`,
            to: 'sale@blockbuddy.space',
            subject: 'New Subscription Query',
            text: `You have a new subscription query:\n\nName: ${name}\nEmail: ${email}\nProtocol: ${protocol === 'Other' ? otherProtocol : protocol}\nNetwork Type: ${networkType === 'Other' ? otherNetworkType : networkType}\nNode Type: ${nodeType === 'Other' ? otherNodeType : nodeType}\nQuery: ${query}`,
            html: `
                <p>You have a new subscription query:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Protocol:</strong> ${protocol === 'Other' ? otherProtocol : protocol}</li>
                    <li><strong>Network Type:</strong> ${networkType === 'Other' ? otherNetworkType : networkType}</li>
                    <li><strong>Node Type:</strong> ${nodeType === 'Other' ? otherNodeType : nodeType}</li>
                    <li><strong>Query:</strong> ${query}</li>
                </ul>
            `,
        };
        await transporter.sendMail(mailOptions);
        
        return { message: 'Your query has been sent successfully!', errors: null };
    } catch (error) {
        console.error('Error submitting subscription query:', error);
        return { message: 'An error occurred while submitting the form.', errors: { _form: ['Server error'] } };
    }
}

export async function startChatSession(data: { name: string; email: string }) {
    const { name, email } = data;
    if (!name || !email) {
        return { error: 'Name and email are required.' };
    }

    const sanitizedName = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    const dateString = format(new Date(), 'yyyy-MM-dd-HH-mm-ss-SSS');
    const chatId = `${sanitizedName}-live-${dateString}`;

    const chatSessionData = {
        id: chatId,
        name,
        email,
        type: 'Live Chat',
        status: 'Open', 
        timestamp: serverTimestamp(),
        message: 'Live chat session initiated.', 
    };

    try {
        await setDoc(doc(db, 'requests', chatId), chatSessionData);
        return { success: true, chatId };
    } catch (error) {
        console.error('Error starting chat session:', error);
        return { error: 'Could not start a new chat session.' };
    }
}

export async function sendChatMessage(data: z.infer<typeof chatMessageSchema>) {
    const validatedFields = chatMessageSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed.',
        };
    }

    const { chatId, sender, text } = validatedFields.data;

    const messageData = {
        sender,
        text,
        timestamp: serverTimestamp(), // Use server-side timestamp
    };

    try {
        const messagesColRef = collection(db, 'requests', chatId, 'messages');
        await addDoc(messagesColRef, messageData);
        // Also update the main request document with the latest message and timestamp
        await updateDoc(doc(db, 'requests', chatId), {
            message: text,
            timestamp: serverTimestamp(), 
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending chat message:', error);
        return { message: 'Failed to send message.', errors: { _form: ['Server error'] } };
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

export async function updateRequestNotes(requestId: string, notes: string) {
    try {
        const requestRef = doc(db, 'requests', requestId);
        await updateDoc(requestRef, { notes });
        return { success: true };
    } catch (error) {
        console.error('Error updating notes:', error);
        return { success: false, error: 'Failed to update notes.' };
    }
}
