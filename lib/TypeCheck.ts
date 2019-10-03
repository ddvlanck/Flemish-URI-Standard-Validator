import {checkResult, IValidURI} from "./IValidURI";

export interface TypeResult {
    type: checkResult
}


export class TypeCheck implements IValidURI{

    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    // Here we check if the URL contains id, doc or ns
    checkURI(): TypeResult {
        let idPos = this.URI.indexOf('/id/');
        let docPos = this.URI.indexOf('/doc/');
        let nsPos = this.URI.indexOf('/ns/');

        let result: checkResult;

        if(idPos < 0 && docPos < 0 && nsPos < 0){
            result = {satisfied: false, message : "URI does NOT contain type id, doc or ns."};
        } else {
            result = {satisfied: true, message : "URI does contain type id, doc or ns."};
        }

        return {type: result};
    }
}