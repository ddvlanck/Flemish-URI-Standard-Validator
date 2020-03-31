import {checkResult, IValidURI} from "./IValidURI";

export interface ReferenceResult {
    reference: checkResult;
}


export class ReferenceCheck implements IValidURI {

    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    // Here we check whether or not fragment identifiers have been used
    // Except when type is ns, then it is allowed
    checkURI(): ReferenceResult {

        let idPos = this.URI.indexOf('/id/');
        let docPos = this.URI.indexOf('/doc/');
        let nsPos = this.URI.indexOf('/ns/');

        let result: checkResult;

        if(idPos > 0 || docPos > 0){
            if(this.URI.indexOf('#') > 0){
                result = {satisfied: false, message: "Fragment identifiers zijn enkel toegelaten indien {type} 'ns' is."};
            } else {
                result = {satisfied: true, message: ""};
            }
        } else if(nsPos > 0) {
            // Type is ns
            if(this.URI.indexOf('#') > 0){
                result = {satisfied: true, message: "{type} is 'ns', fragment identifiers zijn toegestaan, maar werden hier niet gebruikt."};
            } else {
                result = {satisfied: true, message: "{type} is 'ns', fragment identifiers zijn toegestaan en werden gebruikt."};
            }
        } else {
            result = {satisfied: false, message: "Er werd geen {type} meegegeven. Zie bovenstaande regels omtrent het {type}."}
        }

        return {reference: result};
    }

}
