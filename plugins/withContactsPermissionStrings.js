// plugins/withContactsPermissionStrings.js
const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeStringsFile(filePath, lines) {
  const content = Object.entries(lines)
    .map(([k, v]) => `${k} = "${v.replace(/"/g, '\\"')}";`)
    .join("\n");
  fs.writeFileSync(filePath, content + "\n", "utf8");
}

module.exports = function withContactsPermissionStrings(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosRoot = path.join(projectRoot, "ios", "Errands");

        // TODO: still not receiving these descriptions when the alert to allow errands use the device contacts pops up
      const locales = {
        en: {
          NSContactsUsageDescription:
            "We use your contacts to help you quickly assign errands to people you know.",
        },
        es: {
          NSContactsUsageDescription:
            "Usamos tus contactos para ayudarte a asignar recados rápidamente a personas que conoces.",
        },
      };

      for (const [lang, strings] of Object.entries(locales)) {
        const lproj = path.join(iosRoot, `${lang}.lproj`);
        ensureDir(lproj);

        const filePath = path.join(lproj, "InfoPlist.strings");
        writeStringsFile(filePath, strings);
      }

      return config;
    },
  ]);
};
