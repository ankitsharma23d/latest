export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} InfraSage. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
