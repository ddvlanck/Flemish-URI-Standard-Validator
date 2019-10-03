// Not possible to check the guidelines for Domain

import {IValidURI} from "./IValidURI";

export class DomainCheck implements IValidURI{
    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    // Not implemented
    checkURI(): object {
        return {};
    }

}