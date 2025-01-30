import moment from 'moment';
import { createHMAC_SHA256, createSHA256 } from '@/utils/cryptoFunctions';

export type HttpMethod =
  | 'GET'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';


const accessKey = import.meta.env.VITE_AWS_ACCESS_KEY;
const secretKey = import.meta.env.VITE_AWS_SECRET_KEY;
const service = import.meta.env.VITE_AWS_SERVICE;
const host = import.meta.env.VITE_AWS_HOST;
const region = import.meta.env.VITE_AWS_REGION;
const algorithm = 'AWS4-HMAC-SHA256';

async function hmac_sha256(data: string, secret: ArrayBuffer) {
  return await createHMAC_SHA256(data, secret);
}

async function sha256(data: string) {
  return await createSHA256(data);
}

// Generate signing key: https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html#calculate-signature
async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  var kDate = await hmac_sha256(dateStamp, new TextEncoder().encode("AWS4" + key).buffer);
  var kRegion = await hmac_sha256(regionName, kDate);
  var kService = await hmac_sha256(serviceName, kRegion);
  var kSigning = await hmac_sha256("aws4_request", kService);
  return kSigning;
}

// Generate signature https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html#calculate-signature
async function generateSignature(stringToSign: string, key: string, dateStamp: string, regionName: string, serviceName: string) {
  const signatureKey = await getSignatureKey(key, dateStamp, regionName, serviceName);
  const signature: ArrayBuffer = await hmac_sha256(stringToSign, signatureKey) as ArrayBuffer;

  return arrayBufferToHex(signature);
}

function arrayBufferToHex(x: ArrayBuffer) {
  return Array.from(new Uint8Array(x))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate CanonicalHeaders https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html#create-canonical-request
// Generate SignedHeaders as well
// Use required headers + content_type if provided
function getCanonicalAndSignedHeaders(
  payloadHash: string,
  amzDate: string,
  content_type: string | undefined,
  getAccessToken: Function) {
  const headers = {
    ...content_type && {'content-type': content_type.trim() },
    'host': host.trim(),
    'x-access-token': getAccessToken(),
    'x-amz-content-sha256': payloadHash.trim(),
    'x-amz-date': amzDate.trim(),
  };

  let canonicalHeaders = '';

  for (const [key, value] of Object.entries(headers)) {
    canonicalHeaders += `${key}:${value}\n`;
  }

  const signedHeaders = Object.keys(headers).join(';');

  return { signedHeaders, canonicalHeaders }
  // const canonical_headers = 'content-type:' + content_type.trim() + '\n' + 'host:' + host.trim() + '\n' + 'x-amz-content-sha256:' + payloadHash.trim() + '\n' + 'x-amz-date:' + amzDate.trim() + '\n';
}

function generateCanonicalRequest(
  httpMethod: string,
  canonicalUri: string,
  canonicalQueryString: string,
  canonicalHeaders: string,
  signedHeaders: string,
  payloadHash: string,
) {
  return `${httpMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
}

function generateStringToSign(credentialScope: string, amzDate: string, canonicalRequestSha: string) {
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestSha}`;

  return stringToSign;
}

function generateAWSHeaders(
  credentialScope: string,
  signedHeaders: string,
  signature: string,
  payloadHash: string,
  amzDate: string,
  content_type: string | undefined,
  getAccessToken: Function,
) {
  const authorization_header = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const headers = {
    ...content_type && {'Content-Type': content_type.trim() },
    'Host': host,
    'X-Amz-Content-Sha256':payloadHash, 
    'X-Amz-Date': amzDate,
    'Authorization':authorization_header,
    'X-Access-Token': getAccessToken()
  };

  return headers;
}

export async function getAWSHeaders(
  httpMethod: HttpMethod,
  canonicalUri: string,
  content_type: string | undefined = undefined,
  payload: string = '',
  getAccessTokenSilently: Function
) {    
    if (!accessKey || !secretKey) {
      return new Error('Cannot find AWS keys');
    }

    // Get access token
    async function token(): Promise<{ getAccessToken: Function }> {
      let accessToken;
      try {
        accessToken = await getAccessTokenSilently();
      } catch (e: any) {
        throw new Error(e.message);
      }
      const getAccessToken = () => {
        return accessToken;
      }
      return {
        getAccessToken
      };
    }

    const tokenClient = await token();

    // Get timestamps
    const amzDate = moment().utc().format("yyyyMMDDTHHmmss\\Z")
    const dateStamp =  moment().utc().format("yyyyMMDD")

    /** Step 1: Create a canonical request **/

    // Not using this, leave as empty string
    const canonicalQueryString = ''
    // Get the payload sha256
    const payloadHash = await sha256(payload);
    // Get Headers
    const { signedHeaders, canonicalHeaders } = getCanonicalAndSignedHeaders(payloadHash, amzDate, content_type, tokenClient.getAccessToken);

    const canonicalRequest = generateCanonicalRequest(
      httpMethod,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    );
  
    /** Step 2: Create a hash of the canonical request **/
    const canonicalRequestSha = await sha256(canonicalRequest);

    /** Step 3: Create a string to sign */
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = generateStringToSign(credentialScope, amzDate, canonicalRequestSha);

    /** Step 4: Calculate the signature **/
    const signature = await generateSignature(stringToSign, secretKey, dateStamp, region, service);

    /** Step 5: Add signature to request **/
    const headers = generateAWSHeaders(
      credentialScope,
      signedHeaders,
      signature,
      payloadHash,
      amzDate,
      content_type,
      tokenClient.getAccessToken
    );

    return headers;
}