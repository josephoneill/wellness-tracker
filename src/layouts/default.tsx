import { PropsWithChildren } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import LoadingPage from "@/components/pages/LoadingPage";
import NavigationBar from "@/components/NavigationBar";
import Header from "@/components/Header";
import { Notifications } from "@mantine/notifications";

const DefaultLayout = ({ children }: PropsWithChildren<Record<never, any>>) => {
  const { isLoading, isAuthenticated } = useAuth0();

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="layout-wrapper">
          <Notifications color="wellnessRed.6" autoClose={3000} />
          {isAuthenticated ? (
          <Header />
          ) : (
            null
          )}
        {children}
        {isAuthenticated ? (
          <NavigationBar />
        ) : (
          null
        )}
        </div>
      )}
    </>
  );
};

export default DefaultLayout;