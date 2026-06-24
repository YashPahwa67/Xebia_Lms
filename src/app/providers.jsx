import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/features/auth/AuthContext';
import { DataProvider } from '@/features/data/DataContext';
import { ToastProvider } from '@/components/ui/Toast';

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>{children}</ToastProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
