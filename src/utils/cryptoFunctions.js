export async function createHMAC_SHA256(data, key) {
  const encoder = new TextEncoder();
  const messageData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  // Sign the message
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    messageData
  );

  return signature;
}

export async function createSHA256(data, algorithm = 'SHA-256') {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(algorithm, new TextEncoder().encode(data))
    ),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');
}