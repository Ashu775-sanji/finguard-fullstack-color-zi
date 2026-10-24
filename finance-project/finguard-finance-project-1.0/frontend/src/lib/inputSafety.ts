export function containsSecretValue(text:string){
  return /\b(?:otp|(?:upi\s*)?pin|cvv|verification\s*code)\s*(?:is|[:=]|-)?\s*\d{3,8}\b/i.test(text)||/\b(?:bank(?:ing)?\s+)?password\s*(?:is|[:=])\s*\S+/i.test(text)||/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/.test(text);
}
export function analysisURL(raw:string){
  if(!raw.trim())return null;
  const input=raw.trim();
  if(/^[a-z][a-z0-9+.-]*:/i.test(input)&&!/^https?:\/\//i.test(input))throw new Error('Use an HTTP or HTTPS link.');
  const url=new URL(/^https?:\/\//i.test(input)?input:'https://'+input);
  if(!['http:','https:'].includes(url.protocol)||!url.hostname||url.username||url.password)throw new Error('Use an HTTP or HTTPS link without embedded login credentials.');
  return url.href;
}
