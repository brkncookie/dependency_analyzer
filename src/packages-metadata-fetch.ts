import { request } from "undici";
import { LockEntries, PackageMetadata } from "./interfaces";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import findUp from "find-up";

export async function getPackageMetadata(
  pkgName: string
): Promise<PackageMetadata> {
  const result = (await (
    await request(`https://registry.npmjs.org/${pkgName}`)
  ).body.json()) as { error: string } | { versions: PackageMetadata };

  if ("error" in result)
    throw new ReferenceError(`No package with name: ${pkgName}`);

  return result.versions;
}

const lockFile: LockEntries = Object.create(null);

export function getLock() {
  fs.pathExistsSync("./pm_junior-lock.yml") &&
    Object.assign(
      lockFile,
      yaml.load(fs.readFileSync("./pm_junior-lock.yml", "utf-8"))
    );
}

export function getLockEntry(pkgName: string, semanticVersion: string) {
  const lockEntry = lockFile[`${pkgName}@${semanticVersion}`];

  const packageMetadata = lockEntry
    ? {
        [lockEntry.version]: {
          dependencies: lockEntry.dependencies,
          dist: { shasum: lockEntry.shasum, tarball: lockEntry.url },
        },
      }
    : null;

  return packageMetadata;
}

export async function getPackageJson() {
  const jsonFile = fs.readJsonSync((await findUp("./package.json"))!);
  jsonFile.dependencies = jsonFile.dependencies || {};
  jsonFile.devDependencies = jsonFile.devDependencies || {};

  return jsonFile;
}
