import { getPackageJson } from "./packages-metadata-fetch";
import analyzePackages from "./packages-analyze";
import { DependencyConflict, CircularDependencies } from "./types";

function showResults(
  dependencyConflicts: DependencyConflict,
  circularDependencies: CircularDependencies
) {
  console.log(dependencyConflicts);
  console.log(circularDependencies);
}

async function dependencyAnalyzer() {
  const jsonFile = await getPackageJson();

  const results = await analyzePackages(jsonFile);

  showResults(results.dependencyConflicts, results.circularDependencies);
}

dependencyAnalyzer();
