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
                result = {satisfied: false, message: "Only when type is ns, using fragment identifiers is allowed."};
            } else {
                result = {satisfied: true, message: "Type is doc or id, so using fragment identifiers is not allowed. In this case they were not used."};
            }
        } else if(nsPos > 0) {
            // Type is ns
            if(this.URI.indexOf('#') > 0){
                result = {satisfied: true, message: "Type is ns, so using fragment identifiers is allowed. In this case, they were used."};
            } else {
                result = {satisfied: true, message: "Type is ns, so using fragment identifiers is allowed. In this case, they were not used."};
            }
        } else {
            result = {satisfied: false, message: "No {type} was given. See previous rules as it is obligated to provide a {type}."}
        }

        return {reference: result};
    }

}