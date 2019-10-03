import {DomainCheck} from "../lib/DomainCheck";


describe('[DomainCheck]: The {domain} checking module', () => {

    // Constructor test
    it('should be a DomainCheck constructor', () => {
        expect(new DomainCheck("")).toBeInstanceOf(DomainCheck);
    });
});