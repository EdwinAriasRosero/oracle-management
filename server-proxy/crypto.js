const crypto = require("crypto");
const fs = require("fs");

function decrypt(encryptedDataString) {
  const buffer = Buffer.from(encryptedDataString, "base64");
  const decryptedData = crypto.privateDecrypt(
    {
      key: fs.readFileSync("private.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return decryptedData.toString("utf8");
}

module.exports = { decrypt };
