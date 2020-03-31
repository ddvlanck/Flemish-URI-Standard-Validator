import {checkResult, IValidURI} from "./IValidURI";

const fetch = require('node-fetch');


export class DereferenceCheck implements IValidURI {
    private URI: string;

    constructor(uri: string) {
        this.URI = uri;
    }

    async checkURI() {
        let redirect = await this.checkRedirect();
        let format = await this.checkSupportedSerializations();
        return {redirect: redirect, formats: format};
    }

    private async checkRedirect() {

        //let https = require('https');
        let idPos = this.URI.indexOf('/id/');
        let result;

        if (idPos > 0) {
            result = await new Promise(resolve => {
                let result;
                fetch(this.URI).then((response: any) => {
                    if (response.redirected === true && this.URI.replace('/id/', '/doc/') === response.url) {
                        result = {
                            satisfied: true,
                            message: 'Correct redirect from URI with type id to same URI but with type doc.'
                        };
                    } else {
                        result = {
                            satisfied: false,
                            message: 'Incorrect. Or response code is not 303 or redirect URL is incorrect.'
                        };
                    }
                    resolve(result);
                });
            });
        } else {
            result = {satisfied: false, message: 'Expected a URI with {type} id.'}
        }
        return result;
    }

    private async checkSupportedSerializations() {
        let serializations = ['text/html', 'text/turtle', 'application/ld+json', 'application/rdf+xml', 'application/n-triples'];
        let result: { [s: string]: object } = {};

        for (let index in serializations) {
            const options = {
                headers: {
                    'Accept': serializations[index]
                }
            }

            let serResult: object = await new Promise(resolve => {
                fetch(this.URI, options).then((response: any) => {
                    let result = {};
                    const contentType = response.headers.get('content-type');

                    if (response.status === 200 && contentType == serializations[index]) {
                        result = {satisfied: true, message: 'Format supported.'};
                    } else {
                        result = {satisfied: false, message: 'Format not supported'};
                    }

                    // Special cases -- application/ld+json returns application/json
                    if (response.status === 200 && serializations[index] === 'application/ld+json' && contentType == 'application/json') {
                        result = {satisfied: true, message: 'Format supported.'};
                    }

                    // application/n-triples returns text/ntriples
                    if (response.status === 200 && serializations[index] === 'application/n-triples' && contentType == 'text/ntriples') {
                        result = {satisfied: true, message: 'Format supported.'};
                    }

                    resolve(result);
                });
            });
            // TODO: Possibility to stream this result back
            // Now we have to wait until all options were processed
            result[serializations[index]] = serResult;
        }
        return result;
    }


}
