export interface LockEntries {
  [pkgName: string]: {
    version: string;
    url: string;
    shasum: string;
    dependencies: Dependencies;
  };
}

export interface Dependencies {
  [dep: string]: string;
}

export interface PackageJson {
  dependencies: Dependencies;
  devDependencies: Dependencies;
}

export interface PackageInfo {
  [pkgName: string]: {
    url: string;
    version: string;
    dependent: string;
  };
}

export interface PackageMetadata {
  [version: string]: {
    dependencies?: Dependencies;
    dist: { shasum: string; tarball: string };
  };
}
