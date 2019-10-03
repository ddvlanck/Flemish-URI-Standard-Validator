
export interface IValidURI {

    /**
     * @param {string} uri A URI
     * @return {object} Returns an object that consist of a boolean and a message
     * **/
    checkURI(): object;
}

export interface checkResult {
    satisfied: boolean,
    message: string
}