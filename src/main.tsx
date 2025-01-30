import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { UserAuthProvider } from '@/components/userAuth/UserAuthProvider';

import Home from '@/routes/home';
import CallbackPage from '@/routes/callback';
import RatingsPage from '@/routes/ratings';
import DashboardPage from '@/routes/dashboard';

import DefaultLayout from '@/layouts/default';

import Auth0ProviderWithNavigate from "@/auth0-provider-with-navigate";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@/styles/global.scss';
import buttonClasses from '@/styles/variants.module.css';
import notificationClasses from '@/styles/notification.module.scss';


import { createTheme, Button, MantineProvider, rem } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import { apiClient } from '@/api/apiClient';

// Register service worker on app entry
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1,
    },
  },
});

const Auth0ProviderWithNavigateLayout = () => {
  return (
    <Auth0ProviderWithNavigate>
      <AuthInjector />
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <Outlet />
        </UserAuthProvider>
      </QueryClientProvider>
    </Auth0ProviderWithNavigate>
  )
}

const router = createBrowserRouter([{
  path: '/',
  element: <Auth0ProviderWithNavigateLayout />,
  children: [
    {
      path: "/",
      element: <DefaultLayout><Home /></DefaultLayout>,
    },
    {
      path: '/callback',
      element: <CallbackPage />
    },
    {
      path: '/ratings',
      element: <DefaultLayout><RatingsPage /></DefaultLayout>
    },
    {
      path: '/dashboard',
      element: <DefaultLayout><DashboardPage /></DefaultLayout>
    },
  ]
}]);

const theme = createTheme({
  colors: {
    // Add your color
    wellnessRed: [
      '#FFEBEE',
      '#FFEBEE',
      '#EF9A9A',
      '#E57373',
      '#EF5350',
      '#F44336',
      '#E53935',
      '#D32F2F',
      '#C62828',
      '#B71C1C',
    ],
  },
  primaryColor: 'wellnessRed',
  components: {
    Button: Button.extend({
      classNames: buttonClasses,
    }),
    Notification: {
      classNames: notificationClasses,
    },
  },
  autoContrast: true,

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});

const AuthInjector = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    apiClient.setAuthGetter(getAccessTokenSilently);
    // cleanup
    return () => apiClient.setAuthGetter(undefined);
  }, [getAccessTokenSilently]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)
