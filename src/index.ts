import { getPackageJson } from "./packages-metadata-fetch";
import analyzePackages from "./packages-analyze";
import { DependencyConflict, CircularDependencies } from "./types";

function showResults(
  dependencyConflicts: DependencyConflict,
  circularDependencies: CircularDependencies
) {
  console.clear();
  console.log("### Dependency Conflicts:\n\n");

  let output: string;
  if (!dependencyConflicts.length)
    console.log("\n\tNo Dependency Conflicts Detected !\n");
  else {
    dependencyConflicts.forEach((conflict, index) => {
      output = "";
      if (!conflict.firstDependent) conflict.firstDependent = "Main Project";
      output += `${index + 1}. **Conflict ${index + 1}:**\n`;
      output += `   - Package Name: ${conflict.pkgName}\n`;
      output += `   - First Dependent: ${conflict.firstDependent}\n`;
      output += `     - Required Version: ${conflict.firstVersion}\n`;
      output += `   - Second Dependent: ${conflict.secondDependent}\n`;
      output += `     - Required Version: ${conflict.secondVersion}\n\n`;

      console.log(output);
    });
  }
  console.log("### Circular Dependencies:\n\n");

  if (!circularDependencies.length)
    console.log("\n\tNo Circular Dependencies Detected !\n");
  else {
    circularDependencies.forEach((dependency, index) => {
      output = "";
      output += `${index + 1}. **Circular Dependency ${index + 1}:**\n`;
      output += `   - First Package: ${dependency.firstPkg}\n`;
      output += `   - Second Package: ${dependency.secondPkg}\n`;
      output += `   - Direct: ${dependency.direct ? "Yes" : "No"}\n\n`;
      console.log(output);
    });
  }
}

async function dependencyAnalyzer() {
  try {
    const jsonFile = await getPackageJson();

    const results = await analyzePackages(jsonFile);

    showResults(results.dependencyConflicts, results.circularDependencies);
  } catch (err) {
    if (err instanceof Error) console.log("Error: " + err.message);
    else console.log(err);
  }
}

dependencyAnalyzer();
