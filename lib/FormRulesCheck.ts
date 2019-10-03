import {checkResult, IValidURI} from "./IValidURI";

// Interface for the result of this class
export interface FormRulesResult {
    protocol : checkResult,
    structure: checkResult
}

export class FormRulesCheck implements IValidURI{

    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    checkURI(): FormRulesResult {
        let protocolCheckResult = this.protocolCheck();
        let structureCheckResult = this.structureCheck();
        return {protocol: protocolCheckResult, structure: structureCheckResult};
    }

    // Function to check if the URI uses the correct protocol: HTTP(S)
    private protocolCheck(): checkResult {
        const protocol = this.URI.substring(0, this.URI.indexOf('://'));
        let result = {satisfied: false, message : ""};

        if(protocol !== 'http' && protocol !== 'https'){
            result = {satisfied : false, message : "The URI does not use the protocol HTTP(S)."};

        } else {

            if(protocol === 'http'){
                result = {satisfied : true, message : "Correct protocol, but try to use HTTPS."};
            }

            if(protocol === 'https'){
                result = {satisfied : true, message : "Correct protocol."};
            }
        }
        return result;
    }

    // Function to check if the URI follows the recommended structure :
    // {protocol}://{domein}/{type}/{concept}(/{referentie})*
    private structureCheck(): checkResult {
        const parts = this.URI.split('://');    // Split {protocol} from the others
        let result = {satisfied: false, message : ""};

        // We make sure {protocol} is also entered
        if(parts.length  == 2 && parts[0].length > 0){
            let structureParts = parts[1].split('/');

            // structureParts.length must be greater than or equals 3 (must contain domein, type and concept. Reference is optional)
            if(structureParts.length >= 3){
                result = {satisfied: true, message: "URI follows the recommended structure. Reference is optional."};
            } else {
                result = {satisfied: false, message: "One of the parts domain, type or concept is missing. Reference is optional, so not obligated"};
            }

        } else {
            result = {satisfied: false, message: "This URI does not follow the recommended structure. Or {protocol} is missing or {domein}/{type}/{concept}(/{referentie})* is missing"};
        }

        return result;

    }

}