import AdminLoginForm from '@/components/auth/admin-login-form';
import Logo from '@/components/logo';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
            <Logo className="justify-center mb-4" isLink={false} />
            <h1 className="text-2xl font-bold tracking-tight font-headline">
                Admin Panel Login
            </h1>
            <p className="text-muted-foreground">
                Enter your credentials to access the dashboard.
            </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
