// OAuth utility functions for Google and Apple authentication

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface OAuthUserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

// Google OAuth configuration
export const googleOAuthConfig: OAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scope: 'openid email profile'
};

// Apple OAuth configuration
export const appleOAuthConfig: OAuthConfig = {
  clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'your-apple-client-id',
  redirectUri: `${window.location.origin}/auth/apple/callback`,
  scope: 'name email'
};

/**
 * Initiates Google OAuth flow
 */
export const initiateGoogleOAuth = (): void => {
  const params = new URLSearchParams({
    client_id: googleOAuthConfig.clientId,
    redirect_uri: googleOAuthConfig.redirectUri,
    scope: googleOAuthConfig.scope,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  window.location.href = authUrl;
};

/**
 * Initiates Apple OAuth flow
 */
export const initiateAppleOAuth = (): void => {
  const params = new URLSearchParams({
    client_id: appleOAuthConfig.clientId,
    redirect_uri: appleOAuthConfig.redirectUri,
    scope: appleOAuthConfig.scope,
    response_type: 'code',
    response_mode: 'form_post'
  });

  const authUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  window.location.href = authUrl;
};

/**
 * Exchanges authorization code for access token (Google)
 */
export const exchangeGoogleCode = async (code: string): Promise<OAuthUserData | null> => {
  try {
    // In a real implementation, this would be done on the backend
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: googleOAuthConfig.clientId,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: googleOAuthConfig.redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('No access token received');
    }

    // Get user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await profileResponse.json();
    return userData;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return null;
  }
};

/**
 * Exchanges authorization code for access token (Apple)
 */
export const exchangeAppleCode = async (code: string): Promise<OAuthUserData | null> => {
  try {
    // Apple OAuth requires backend processing due to client secret requirements
    // This would typically be handled by your backend API
    const response = await fetch('/api/auth/apple/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Apple OAuth error:', error);
    return null;
  }
};

/**
 * Validates OAuth token and returns user data
 */
export const validateOAuthToken = async (provider: 'google' | 'apple', token: string): Promise<OAuthUserData | null> => {
  try {
    if (provider === 'google') {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      const tokenInfo = await response.json();
      
      if (tokenInfo.error) {
        throw new Error(tokenInfo.error_description);
      }
      
      return tokenInfo;
    } else if (provider === 'apple') {
      // Apple token validation would be done on backend
      const response = await fetch('/api/auth/apple/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const userData = await response.json();
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Handles OAuth callback and extracts authorization code
 */
export const handleOAuthCallback = (): { provider: string; code: string } | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  if (!code) {
    return null;
  }
  
  // Determine provider from current path or state parameter
  const path = window.location.pathname;
  let provider = '';
  
  if (path.includes('/auth/google/callback')) {
    provider = 'google';
  } else if (path.includes('/auth/apple/callback')) {
    provider = 'apple';
  }
  
  return { provider, code };
};

/**
 * Clears OAuth-related URL parameters
 */
export const clearOAuthParams = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  url.searchParams.delete('scope');
  window.history.replaceState({}, document.title, url.pathname);
};