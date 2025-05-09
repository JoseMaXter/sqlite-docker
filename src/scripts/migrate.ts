import { runMigrations, rollbackMigration } from "../lib/migrations";

const command = process.argv[2];

async function main() {
  switch (command) {
    case "up":
      await runMigrations();
      break;
    case "down":
      await rollbackMigration();
      break;
    default:
      console.log("Usage: npm run migrate [up|down]");
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
