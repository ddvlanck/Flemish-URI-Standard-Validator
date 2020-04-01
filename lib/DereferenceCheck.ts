import {IValidURI} from "./IValidURI";
const fetch = require('node-fetch');

// Can't implement checkResult here because formats is an array of objects.

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
                    fetch(this.URI, {mode: 'cors'}).then((response: any) => {
                        if (response.redirected === true && this.URI.replace('/id/', '/doc/') === response.url) {
                            result = {
                                satisfied: true,
                                message: ''
                            };
                        } else {
                            result = {
                                satisfied: false,
                                message: 'Ofwel werd er geen redirect uitgevoerd ofwel is de redirect URL verkeerd.'
                            };
                        }
                        resolve(result);
                    }).catch( (reason: any) => {
                        resolve({satisfied: false, message: 'Probleem bij het bevragen van de URI.'});
                    });
            });
        } else {
            result = {satisfied: false, message: "Er wordt een URI met {type} 'id' verwacht"}
        }
        return result;
    }

    private async checkSupportedSerializations() {
        let serializations = ['text/html', 'text/turtle', 'application/ld+json', 'application/rdf+xml', 'application/n-triples'];
        let result: { [s: string]: object } = {};

        for (let index in serializations) {
            const options = {
                mode: 'cors',
                headers: {
                    'Accept': serializations[index]
                }
            }

            let serResult: object = await new Promise(resolve => {
                fetch(this.URI, options).then((response: any) => {
                    let result = {};
                    const contentType = response.headers.get('content-type');


                    if (response.status === 200 && contentType.indexOf(serializations[index]) >= 0) {
                        result = {satisfied: true, message: ''};
                    } else {
                        result = {satisfied: false, message: "Formaat wordt niet ondersteund"};
                    }

                    // Special cases -- application/ld+json returns application/json
                    if (response.status === 200 && serializations[index] === 'application/ld+json' && contentType.indexOf('application/json') >= 0) {
                        result = {satisfied: true, message: ''};
                    }

                    // application/n-triples returns text/ntriples
                    if (response.status === 200 && serializations[index] === 'application/n-triples' && contentType.indexOf('text/ntriples') >= 0) {
                        result = {satisfied: true, message: ''};
                    }

                    resolve(result);
                }).catch( (reason: any) => {
                    resolve({satisfied: false, message: 'Probleem bij het bevragen van de URI.'});
                });
            });
            // TODO: Possibility to stream this result back
            // Now we have to wait until all options were processed
            result[serializations[index]] = serResult;
        }
        return result;
    }


}
