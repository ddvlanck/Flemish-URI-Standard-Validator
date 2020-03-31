import {checkResult, IValidURI} from "./IValidURI";

// Interface for the result of this class
export interface FormRulesResult {
    protocol: checkResult,
    structure: checkResult
}

export class FormRulesCheck implements IValidURI {

    private URI: string;

    constructor(uri: string) {
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
        let result = {satisfied: false, message: ""};

        if (protocol !== 'http' && protocol !== 'https') {
            result = {satisfied: false, message: "De URI maakt geen gebruik van het HTTP(S)-protocol."};

        } else {

            if (protocol === 'http') {
                result = {satisfied: true, message: "Voldoet, maar probeer HTTPS te gebruiken."};
            }

            if (protocol === 'https') {
                result = {satisfied: true, message: ""};
            }
        }
        return result;
    }

    private structureCheck(): checkResult {
        const parts = this.URI.split('://');    // Parts must have a length of 2
        let result: checkResult = {satisfied: false, message: ""};

        // We make sure {protocol} is also given
        if (parts.length == 2 && parts[0].length > 0) {

            // Check if {protocol} is http(s)
            if (parts[0] === 'http' || parts[0] === 'https') {
                const URIParts = parts[1].split('/');   // Length must at least be 3, since it needs to have {domain}, {type} and {concept}

                if (URIParts.length >= 3) {

                    // We can only check {type} here
                    if (URIParts[1] == 'doc' || URIParts[1] == 'id' || URIParts[1] == 'ns') {
                        result = {satisfied: true, message: ""}
                    } else {
                        result = {
                            satisfied: false,
                            message: "De URI volgt de voorgeschreven structuur, maar {type} zou 'id', 'doc' of 'ns' moeten zijn."
                        };
                    }

                } else {
                    result = {
                        satisfied: false,
                        message: "Eén of meerdere delen van {domain}, {type} and {concept} ontbreken."
                    };
                }

            } else {
                result = {satisfied: false, message: "{protocol} moet HTTP of HTTPS zijn."}
            }

        } else {
            result = {
                satisfied: false,
                message: "De URI voldoet niet aan de voorgeschreven structuur. Ofwel ontbreekt {protocol} ofwel {domein}/{type}/{concept}(/{referentie})* ontbreekt."
            };
        }

        return result;
    }
}
