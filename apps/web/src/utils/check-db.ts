import { db } from "d:/Projects/sec-form/packages/db/src/index";
import { forms, users } from "d:/Projects/sec-form/packages/db/src/schema";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("=== Database Users ===");
  allUsers.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role}`);
  });
  console.log("======================");

  const allForms = await db.select().from(forms);
  console.log("=== Database Forms ===");
  allForms.forEach(f => {
    console.log(`ID: ${f.id} | Title: ${f.title} | UserID: ${f.userId} | Visibility: ${f.visibility}`);
  });
  console.log("======================");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
