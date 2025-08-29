import {exists} from "jsr:@std/fs/exists";
import {readLines} from "http://deno.land/std@0.224.0/io/read_lines.ts";
const filename:string = "tsproj.mod";
function exist() : boolean {
   try {
	   const status =  Deno.lstat(filename);
	   return true;
   } catch(err) {
    if(! ( err instanceof Deno.error.NotFound)) {
	    console.error(`${err}`);
	    Deno.exit(1);
    }
    else{
       return false;
    }}}
async function installed(req:string) : Promise<boolean>{
   const file = await Deno.open(filename,{read:true});
   const packageName:string = `<xml>${req}</xml>`;
   for await(let line of readLines(file)) {
	   if(line.trim() === packageName.trim()) {
		   return true;
	   }
   }
   return false;
}
async function add(requirments:string[]) : void {
   if(!exist()) {
    console.log("Inistalize the mod file befor adding");
    return;
   }
   for(let req of requirments) {
	   if(installed(req)) {
		   console.log("Already exist");
		   continue;
	   }
	   const args = `install ${req}`;
	   const exe = new  Deno.Command("npm", {
	   args:args,
	   stdout:"inherit",
	   stderr:"inherit",
	   });
	   const {code} = await exe.output();
	   if(code === 0) {
		   console.log("installation successful");
		   let data = new TextEncoder().encode(`\n<xml> ${req} </xml>\n`);
		   Deno.writeFileSync(filename,data,{append:true});
	   } else{
		   console.error(`installation failed with status:${code}`);
	   }

   }
   console.log("Added succesfully");
}
function main() {
	const req:string[] = ["fs","axios","yargs"];
	add(req);
}
main();
