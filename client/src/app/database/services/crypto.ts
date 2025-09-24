import * as forge from 'node-forge';

export function encrypt(value: object, publicKeyPem: string) {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(JSON.stringify(value), 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  });
  const exryptedValue = forge.util.encode64(encrypted);

  return exryptedValue;
}
