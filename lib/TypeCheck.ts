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
    checkURI(): object {
        return {};
    }

}
