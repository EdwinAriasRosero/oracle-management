// generate_keys.js
const crypto = require("crypto");
const fs = require("fs");

// Generar el par de llaves RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048, // Tamaño de la llave en bits (2048 es un tamaño seguro)
  publicKeyEncoding: {
    type: "spki", // Formato de codificación para la llave pública
    format: "pem", // Formato PEM (Privacy-Enhanced Mail)
  },
  privateKeyEncoding: {
    type: "pkcs8", // Formato de codificación para la llave privada
    format: "pem", // Formato PEM
  },
});

// Guardar la llave privada en un archivo
fs.writeFileSync("private.pem", privateKey);

// Guardar la llave pública en un archivo
fs.writeFileSync("public.pem", publicKey);

console.log("Llaves generadas y guardadas en private.pem y public.pem");
