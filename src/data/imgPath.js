
import { fileURLToPath } from "url";
import { dirname } from "path";


const expressfilename = fileURLToPath(import.meta.url);
export const imgPath = dirname(expressfilename);

