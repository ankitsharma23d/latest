import DashboardClient from '@/components/admin/dashboard-client';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline">
        Admin Dashboard
      </h1>
      <DashboardClient />
    </div>
  );
}
