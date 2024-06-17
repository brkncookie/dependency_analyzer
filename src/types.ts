import { Dependencies } from "./interfaces";

export type DependencyGraph = Array<{
  pkgName: string;
  version: string;
  dependencies: Dependencies;
}>;

export type DependencyConflict = Array<{
  pkgName: string;
  firstDependent: string;
  secondDependent: string;
  firstVersion: string;
  secondVersion: string;
}>;

export type CircularDependencies = Array<{
  firstPkg: string;
  secondPkg: string;
  direct: boolean;
}>;
