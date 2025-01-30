import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getConfig } from '@/auth0/config';

type Auth0ProviderWithNavigateProps = { children?: ReactNode };

const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  const config = getConfig();

  const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    onRedirectCallback,
    authorizationParams: {
      redirect_uri: config.redirectUri,
      scope: "openid profile email read:current_user update:current_user_metadata",
      ...(config.audience ? { audience: config.audience } : null),
    },
  };

  return (
    <Auth0Provider
      {...providerConfig}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate; 