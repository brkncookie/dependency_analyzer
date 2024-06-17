import { PackageJson, PackageMetadata, PackageInfo } from "./interfaces";
import {
  getLock,
  getLockEntry,
  getPackageMetadata,
} from "./packages-metadata-fetch";
import {
  CircularDependencies,
  DependencyConflict,
  DependencyGraph,
} from "./types";
import * as semver from "semver";

const packagesInfo: PackageInfo = Object.create(null);
const dependencyConflicts: DependencyConflict = [];
const circularDependencies: CircularDependencies = [];

function isCircularDep(
  dep: string,
  semVer: string,
  dependencyGraph: DependencyGraph
) {
  const index = dependencyGraph.findIndex(
    (element) =>
      element.pkgName === dep &&
      semver.satisfies(element.version, semVer) &&
      circularDependencies.push({
        firstPkg: element.pkgName,
        secondPkg: dependencyGraph.at(-1)!.pkgName,
        direct: dependencyGraph.length === 2,
      })
  );

  if (index === -1) return false;
  return true;
}
async function resolvePackages(
  pkgName: string,
  semanticVersion: string,
  dependencyGraph: DependencyGraph = []
) {
  console.clear();
  console.log("### Analyzing : " + pkgName + " ###");

  let pkgsMetadata: PackageMetadata;
  if (!(pkgsMetadata = getLockEntry(pkgName, semanticVersion)!))
    pkgsMetadata = await getPackageMetadata(pkgName);
  const versions = Object.keys(pkgsMetadata);

  let version;

  if (!(version = semver.maxSatisfying(versions, semanticVersion)))
    throw new Error("Couldn't find a compatible version.");
  const compatiblePkgVersion = pkgsMetadata[version];

  if (!packagesInfo[pkgName]) {
    packagesInfo[pkgName] = {
      url: compatiblePkgVersion.dist.tarball,
      version: version,
      dependent: dependencyGraph
        .map(({ pkgName }) => pkgName)
        .slice(0)
        .join(" -> "),
    };
  } else if (
    !semver.satisfies(packagesInfo[pkgName].version, semanticVersion)
  ) {
    dependencyConflicts.push({
      pkgName: pkgName,
      firstDependent: packagesInfo[pkgName].dependent,
      secondDependent: dependencyGraph
        .map(({ pkgName }) => pkgName)
        .slice(0)
        .join(" -> "),
      firstVersion: packagesInfo[pkgName].version,
      secondVersion: version,
    });
  }

  if (compatiblePkgVersion.dependencies) {
    dependencyGraph.push({
      pkgName,
      version,
      dependencies: compatiblePkgVersion.dependencies,
    });
    await Promise.all(
      Object.entries(compatiblePkgVersion.dependencies)
        .filter(([dep, semVer]) => !isCircularDep(dep, semVer, dependencyGraph))
        .map(([dep, semVer]) =>
          resolvePackages(dep, semVer, dependencyGraph.slice())
        )
    );
    dependencyGraph.pop();
  }
}

export default async function (pkgJson: PackageJson) {
  getLock();
  pkgJson.dependencies &&
    (await Promise.all(
      Object.entries(pkgJson.dependencies).map((pkg) => resolvePackages(...pkg))
    ));

  pkgJson.devDependencies &&
    (await Promise.all(
      Object.entries(pkgJson.devDependencies).map((pkg) =>
        resolvePackages(...pkg)
      )
    ));

  return { dependencyConflicts, circularDependencies };
}
