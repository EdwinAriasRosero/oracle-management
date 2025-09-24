// zip-script.js
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const sourceFolder = "server-proxy";
const destinationPath = "dist/server/uploads/proxy.zip";

// Ensure the destination directory exists
const destinationDir = path.dirname(destinationPath);
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

// Create a file stream to write to
const output = fs.createWriteStream(destinationPath);
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level
});

// Handle events to log progress and errors
output.on("close", function () {
  console.log(
    `Archiver has finalized and the output file is at ${destinationPath}`
  );
  console.log(archive.pointer() + " total bytes");
});

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.warn("Warning:", err.message);
  } else {
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

// Pipe the archive data to the file stream
archive.pipe(output);

// Append a folder from a directory
archive.directory(sourceFolder, false);

// Finalize the archive (this starts the process)
archive.finalize();
