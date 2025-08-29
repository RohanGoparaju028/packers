import {exist} from "jsr:@std/fs/exists";
const filename:string = "tsproj.mod";
 async function readFile() : void {
  try {
	  const tsc = Deno.version.typescript;
	  await Deno.writeTextFile(filename,`typescript version: ${tsc}`);
	  console.log("tsproj.mod file is initialized");
  } catch(err) {
	  console.log(`error while doing operations: ${err}`);
  }
}
function main() : void  {
   readFile();
}
main();
