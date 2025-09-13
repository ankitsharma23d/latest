import DashboardClient from '@/components/admin/dashboard-client';
import { MOCK_REQUESTS } from '@/lib/data';

export default function AdminDashboardPage() {
  // In a real app, you would fetch this data from your database.
  const requests = MOCK_REQUESTS;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline">
        Admin Dashboard
      </h1>
      <DashboardClient initialRequests={requests} />
    </div>
  );
}
