import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";

const packageJson = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf-8"),
) as { version: string };

function printHelp(): void {
  console.log(`ifvw ${packageJson.version}

Usage:
  ifvw generate --config <sources.yaml> --out <dir>
  ifvw --version
  ifvw --help
`);
}

export async function main(argv: string[]): Promise<number> {
  const { positionals, values } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      version: { type: "boolean" },
      help: { type: "boolean" },
      config: { type: "string" },
      out: { type: "string" },
    },
  });

  if (values.version) {
    console.log(packageJson.version);
    return 0;
  }

  if (values.help || positionals.length === 0) {
    printHelp();
    return 0;
  }

  const [command] = positionals;

  if (command === "generate") {
    console.error("generate is not implemented yet (see issue/011-generate-static-site.md)");
    return 1;
  }

  console.error(`unknown command: ${command}`);
  printHelp();
  return 1;
}
