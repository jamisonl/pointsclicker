const AdmZip = require("adm-zip");
const zip = new AdmZip();

zip.addLocalFolder(
  "../pointsclicker",
  null,
  /^(?!.git)^(?!build.js)^(?!package.json)^(?!node_modules).*$/
);

zip.writeZip("./pointsclicker.zip");
