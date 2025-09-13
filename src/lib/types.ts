export type SupportRequest = {
  id: string;
  name: string;
  email: string;
  type: 'Contact' | 'Subscription';
  message: string;
  timestamp: string;
};
