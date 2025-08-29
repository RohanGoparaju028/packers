import {readLines} from "http://deno.land/std@0.224.0/io/read_lines.ts";
const filename:string = "tsproj.mod";
function existFile() : boolean {
try {
	const std =  Deno.lstat(filename);
	return true;
}
catch(err) {
	if(!(err instanceof Deno.errors.NotFound)){
	    console.error(`errror:${err}`);
	    Deno.exit(1);
	}
	return false;
}
}
async function deleteLineInFile(req: string) {
  const file = await Deno.open(filename);
  const tempStorage: string[] = [];

  for await (let line of readLines(file)) {
    tempStorage.push(line);
  }

  file.close();

  const target = `<xml>${req}</xml>`;
  const filteredContent = tempStorage.filter(
    (line) => line.trim() !== target.trim(),
  );

  await Deno.writeTextFile(filename, filteredContent.join("\n") + "\n");
}

async function deletelib(requiment:string[]) {
       if(!existFile()) {
	       console.log("tsproj.mod file does not exist");
	       return;
       }
       for(let req of requiment) {
	       const args:string[] = ["uninstall",req]; 
	       const cmd = new Deno.Command("npm",{
		       args:args,
		       stdout:"inherit",
		       stderr:"inherit",
	       });
	       const {code} = await cmd.output();
	       if(code === 0) {
		       console.log(`${req} uninstalled successfully`);
		       deleteLineInFile(req);
	       } else{
		       console.log(`Failed to uninstall ${req} and exited with ${code}`);
		       return;
	       }
       }
}
function main() {
    const req:string[] = ["axios"];
    deletelib(req);
}
main();
