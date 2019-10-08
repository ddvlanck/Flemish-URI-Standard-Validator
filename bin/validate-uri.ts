import { FormRulesCheck } from "../lib/FormRulesCheck";
import {TypeCheck} from "../lib/TypeCheck";
import {ReferenceCheck} from "../lib/ReferenceCheck";
import {DereferenceCheck} from "../lib/DereferenceCheck";
const minimist = require('minimist');

if(process.argv.length < 3){
    process.stderr.write(`
        validate-uri requires a URL
        
        Usage:
        validate-uri http://example.org
    `)
    process.exit(1);
}

process.argv.splice(0,2);
const args = minimist(process.argv);

if(args._.length > 0){
    let URI = args._[0];

    console.log("====== FormRules ======");
    let formRules = new FormRulesCheck(URI).checkURI();

    console.log('- Protocol');
    console.log('\tSatisfied? ' + formRules.protocol.satisfied);
    console.log('\tMessage:' + formRules.protocol.message);
    console.log();
    console.log('- Structure');
    console.log('\tSatisfied? ' + formRules.structure.satisfied);
    console.log('\tMessage:' + formRules.structure.message);
    console.log();
    console.log("======================");
    console.log();

    console.log("====== TypeCheck ======");
    let typeRules = new TypeCheck(URI).checkURI();

    console.log('Satisfied? ' + typeRules.type.satisfied);
    console.log('Message: ' + typeRules.type.message);
    console.log();
    console.log("======================");
    console.log();


    console.log("====== ReferenceCheck ======");
    let referenceRules = new ReferenceCheck(URI).checkURI();

    console.log('Satisfied? ' + referenceRules.reference.satisfied);
    console.log('Message: ' + referenceRules.reference.message);
    console.log();
    console.log("======================");
    console.log();

    // Dereferencing
    dereferencing(URI);

}

async function dereferencing(URI: string){
    let dereferenceCheck = new DereferenceCheck(URI);
    let result = await dereferenceCheck.checkURI();
    console.log("====== DereferenceCheck ======");
    console.log(result);

    /*console.log('- Redirect');
    console.log('\tSatisfied? ' + result.redirect.satisfied);
    console.log('\tMessage: ' + result.redirect.message);
    console.log();
    console.log('- Formats');
    Object.keys(result.formats).forEach(prop => {
       console.log('\t ' + prop + 'is supported? ' + result.formats[prop]);
    });*/



}