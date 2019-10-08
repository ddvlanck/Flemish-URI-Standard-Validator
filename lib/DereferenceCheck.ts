import {checkResult, IValidURI} from "./IValidURI";
const request = require('request');

/*export interface DereferenceCheckResult {
    redirect: checkResult,
    formats: object
}*/


export class DereferenceCheck implements IValidURI{
    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    async checkURI() {
        let format = await this.checkSupportedSerializations();
        let redirect = await this.checkRedirect();
        return {redirect: redirect, formats: format} ;
    }

    private async checkRedirect() {
        let idPos = this.URI.indexOf('/id/');
        let result = {satisfied: false, message: ''};

        if(idPos > 0){
            const options = {
                method: 'GET',
                url: this.URI,
                followRedirect: false,
                headers : {
                    Accept: 'text/html',
                }
            };

            let [req, res] = await new Promise(resolve => {
                let req = request(options, function (error: string | undefined, response: any, body: any) {
                    if (error) {
                        result = {satisfied: false, message: 'Error, could not GET URI.'};
                    }
                    resolve([req, response]);

                });
            });

            let redirectURI = req.uri.protocol + '//' + req.uri.host + res.headers['location'];
            let requestURI = req.uri.href;    // Same as this.URI (but we can't use this in here)
            requestURI = requestURI.replace('/id/', '/doc/');

            if(res.statusCode === 303 && requestURI === redirectURI){
                result = {satisfied: true, message: 'Correct redirect from URI with type id to same URI but with type doc.'};
            } else {
                result = {satisfied: false, message: 'Incorrect. Or response code is not 303 or redirect URL is incorrect.'};
            }
        }
        return result;
    }

    private async checkSupportedSerializations() {
        // Just as above, we only fetch the URI if its type is /id/
        let idPos = this.URI.indexOf('/id/');
        let serializations = ['text/html', 'text/turtle', 'application/ld+json', 'application/rdf+xml', 'application/n-triples'];
        let result: {[s: string] : object} = {};

        if(idPos > 0){
            for(let index in serializations){

                const options = {
                    method: 'GET',
                    url: this.URI,
                    headers : {
                        Accept: serializations[index],
                    }
                };

                let response: any = await new Promise(resolve => {
                    request(options, function (error: string | undefined, response: any, body: any) {
                        if (error) {
                            result[serializations[index]] = {satisfied: false, message: 'Error, could not GET URI.'};
                            throw new Error(error);
                        }
                        resolve(response);
                    });
                });

                let contentType = response.headers['content-type'].split(';')[0];

                if(response.statusCode === 200 && contentType == serializations[index]){
                    result[serializations[index]] = {satisfied: true, message: 'Format supported.'};
                } else {
                    result[serializations[index]] = {satisfied: false, message: 'Format not supported'};
                }

                // Special cases -- application/ld+json returns application/json
                if(response.statusCode === 200 && serializations[index] == 'application/ld+json' && contentType == 'application/json'){

                    result[serializations[index]] = {satisfied: true, message: 'Format supported.'};
                }

                if(response.statusCode === 200 && serializations[index] == 'application/n-triples' && contentType == 'text/ntriples'){

                    result[serializations[index]] = {satisfied: true, message: 'Format supported.'};
                }
            }
        }
        return result;

    }


}