import {checkResult, IValidURI} from "./IValidURI";



export class DereferenceCheck implements IValidURI{
    private URI: string;

    constructor(uri: string){
        this.URI = uri;
    }

    async checkURI() {
        let redirect = await this.checkRedirect();
        let format = await this.checkSupportedSerializations();
        return {redirect: redirect, formats: format};
    }

    private async checkRedirect() {
        let protocol: any;
        if(this.URI.split('://')[0] === 'https'){
            protocol = require('https');
        } else {
            protocol = require('http');
        }

        //let https = require('https');
        let idPos = this.URI.indexOf('/id/');
        let result;

        if(idPos > 0){
            result = await new Promise(resolve => {
                let result;
                protocol.get(this.URI, (res: any) => {
                    const redirectURI = this.URI.split('://')[0] + '://' + res.connection.servername + res.headers.location;        // First part should be replaced
                    const requestURI = this.URI.replace('/id/', '/doc/');

                    if(res.statusCode === 303 && redirectURI === requestURI){
                         result = {satisfied: true, message: 'Correct redirect from URI with type id to same URI but with type doc.'};
                     } else {
                         result = {satisfied: false, message: 'Incorrect. Or response code is not 303 or redirect URL is incorrect.'};
                     }
                    resolve(result);
                });
            });
        } else {
            result = {satisfied: false, message: 'Expected a URI with {type} id.'}
        }
        return result;
    }

    private async checkSupportedSerializations(){
        let protocol: any;
        if(this.URI.split('://')[0] === 'https'){
            // By default the http(s) modules does not follow redirects
            protocol = require('follow-redirects').https;
        } else {
            protocol = require('follow-redirects').http;
        }
        let serializations = ['text/html', 'text/turtle', 'application/ld+json', 'application/rdf+xml', 'application/n-triples'];
        let result: {[s: string] : object} = {};

        for(let index in serializations){
            const options = {
                headers : {
                    'Accept': serializations[index]
                }
            }

            let serResult: object = await new Promise(resolve => {
                protocol.get(this.URI, options, (res: any) => {
                    let result = {};
                    let contentType = res.headers['content-type'].split(';')[0];

                    if(res.statusCode === 200 && contentType == serializations[index]){
                        result = {satisfied: true, message: 'Format supported.'};
                    } else {
                        result = {satisfied: false, message: 'Format not supported'};
                    }

                    // Special cases -- application/ld+json returns application/json
                    if(res.statusCode === 200 && serializations[index] == 'application/ld+json' && contentType == 'application/json'){
                        result = {satisfied: true, message: 'Format supported.'};
                    }

                    // application/n-triples returns text/ntriples
                    if(res.statusCode === 200 && serializations[index] == 'application/n-triples' && contentType == 'text/ntriples'){
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