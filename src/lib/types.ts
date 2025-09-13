
export const STATUSES = [
  'Requested',
  'In Progress',
  'Pricing and Details Submitted',
  'Order registered By client',
  'Payment Done',
  'Server Ordered',
  'Setup Started',
  'Setup Complete',
  'Delivered to Client',
  'Client Satisfied',
] as const;

export type Status = (typeof STATUSES)[number];

export type SupportRequest = {
  id: string;
  name: string;
  email: string;
  type: 'Contact' | 'Subscription';
  message: string;
  timestamp: string;
  status: Status;
};
