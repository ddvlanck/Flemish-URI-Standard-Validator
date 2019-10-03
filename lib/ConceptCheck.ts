// Not possible to check guidelines for Concept

import {IValidURI} from "./IValidURI";

export class ConceptCheck implements IValidURI{
    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    // Not implemented
    checkURI(): object {
        return {};
    }

}