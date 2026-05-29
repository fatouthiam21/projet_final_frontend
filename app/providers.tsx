'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/store/store';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
