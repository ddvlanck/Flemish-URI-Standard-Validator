import { FormRulesCheck } from "../lib/FormRulesCheck";
import {TypeCheck} from "../lib/TypeCheck";
import {ReferenceCheck} from "../lib/ReferenceCheck";
const minimist = require('minimist');

process.argv.splice(0,2);
const args = minimist(process.argv);


if(args._.length > 0){
    let URI = args._[0];

    let formRules = new FormRulesCheck(URI);
    let typeRules = new TypeCheck(URI);
    let referenceRules = new ReferenceCheck(URI);


    let result = formRules.checkURI();
    Object.assign(result, typeRules.checkURI());
    Object.assign(result, referenceRules.checkURI());
    console.log(result);
}