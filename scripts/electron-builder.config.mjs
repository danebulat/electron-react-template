//import pkg from './../package.json' with { type: 'json' };
import { resolve, matchesGlob, sep, join, normalize, dirname} from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Export electron-builder config.
 *
 * Other fields;
 * npmRebuild, afterSign, extraResources, afterAllArtifactBuild, asarUnpack
 */
export default {
  appId: "electron-vite-boilerplate",
  compression: "normal",
  productName: "Demo App",
  asar: true,
  directories: {
    output: 'releases',
    buildResources: "dist/renderer",
  },
  files: [
    "dist/**/*",
    "node_modules/**/*",
    "package.json",
  ],
  mac: {
    icon: "assets/icon.icns",
    target: [
      {
        target: "dmg",
        arch: [
          "x64",
        ]
      },
      {
        target: "zip",
        arch: [
          "x64",
        ]
      }
    ],
    hardenedRuntime: true,
    notarize: false,
    entitlements: "entitlements/extendedInfo.plist",
  },
  linux: {
    icon: "assets/LinuxIcons",
    category: "Utility",
    target: "AppImage",
  },
}

/**
 * @name findFilesThatShouldBeExcluded
 * 
 * @todo Ammend with mapping workspaces.
 * @todo Use in monorepo setup to exclude files in local packages.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function findFilesThatShouldBeExcluded() {
  const allFilesToExclude = [];

  /** Temp: Should be replaced with workspace name + path */
  const name = 'electron-react-forge-boilerplate';
  const path = resolve(join(__dirname, '..'));

  const pkgPath = resolve(path, 'package.json');
  const {default: workspacePkg} = await import(pathToFileURL(pkgPath), {with: {type: 'json'}});
  
  let patterns = workspacePkg.files || [];
  patterns.push('package.json');
  patterns = patterns.map(p => resolve('.', p));

  let filesToExclude = getFiles(path, patterns);
  filesToExclude = filesToExclude.map(f => join('!node_modules', name, f.replace(path + sep, '')));
  allFilesToExclude.push(...filesToExclude);

  /**
   * @name getFiles
   * @summary Iterates all files within a directory and returns all files that match the given patterns.
   */
  function getFiles(directory, patterns) {
    /** Temp: Don't touch node_modules directory */
    if (isDirectoryInPath('node_modules', directory) || isDirectoryInPath('.git', directory)) {
      return [];
    }

    let results = [];
    const files = readdirSync(directory, { withFileTypes: true });

    fileLoop: for (const file of files) {
      const fileFullPath = resolve(directory, file.name);
      if (file.isDirectory()) {
        results = results.concat(getFiles(fileFullPath, patterns));
      } else {
        for (const pattern of patterns) {
          if (matchesGlob(fileFullPath, pattern)) {
            continue fileLoop;
          }
        }

        results.push(fileFullPath);
      }
    }

    return results;
  }

  return allFilesToExclude;
}

function isDirectoryInPath(targetDir, pathString) {
  // Normalize both paths for comparison to handle different path formats
  const normalizedTarget = normalize(targetDir);
  const normalizedPath = normalize(pathString);

  // Check if the path includes the target directory as a separate directory
  return normalizedPath.includes(sep + normalizedTarget + sep);
}

//console.log(await findFilesThatShouldBeExcluded());
