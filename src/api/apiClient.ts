import { getAWSHeaders, type HttpMethod } from '@/utils/aws';

const baseUrl = `https://${import.meta.env.VITE_AWS_HOST}`;

class ApiClient {
  private getAccessTokenSilently?: Function;

  public setAuthGetter(getAccessTokenSilently?: Function) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  public async fetchAWS(
    method: HttpMethod,
    canonicalUri: string,
    content_type: string | undefined = undefined,
    payload: string = ''
  ) {
    if (!this.getAccessTokenSilently) {
      return new Error('Get access token function is undefined');
    }

    let response;
    const encodedUri = encodeURI(canonicalUri);
    const headers: Object = await getAWSHeaders(
      method,
      encodeURI(encodedUri), // double encode path
      content_type,
      payload,
      this.getAccessTokenSilently
    );
  
    try {
      response = await fetch(`${baseUrl}${encodedUri}`, {
        method,
        // @ts-ignore
        headers,
        ...payload && { body: payload }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch(error) {
      console.error('Error:', error);
      throw error;
    };    
    return await response?.json(); 
  }
};

export const apiClient = new ApiClient();