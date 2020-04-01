import {FormRulesCheck} from "../lib/FormRulesCheck";


describe('[FormRules]: The form rules checking module', () => {

    // Constructor test
    it('should be a FormRulesCheck constructor', () => {
        expect(new FormRulesCheck("")).toBeInstanceOf(FormRulesCheck);
    });

    // Protocol tests
    it('should not be satisfied if an other protocol than HTTP(S) was used', () => {
        const URI = "ssh://data.vlaanderen.be";
        let formRules = new FormRulesCheck(URI).checkURI();

        expect(formRules.protocol.satisfied).toEqual(false);
    });

    it('should be satisfied when HTTP is used, but indicate that HTTPS is better', () => {
       const URI = "http://data.vlaanderen.be";
       let formRules = new FormRulesCheck(URI).checkURI();

       expect(formRules.protocol.satisfied).toEqual(true);
    });

    it('should be satisfied when HTTPS is used', () => {
        const URI = "https://data.vlaanderen.be";
        let formRules = new FormRulesCheck(URI).checkURI();

        expect(formRules.protocol.satisfied).toEqual(true);
    });

    // Structure tests
    it('should not be satisfied when {protocol} is not given', () => {
        const URI = "data.vlaanderen.be/ns/adres";
        let formRules = new FormRulesCheck(URI).checkURI();
        expect(formRules.structure.satisfied).toEqual(false);
    });

    it('should not be satisfied when {domein}/{type}/{concept}(/{referentie})* is missing', () => {
        const URI = "http://";
        let formRules = new FormRulesCheck(URI).checkURI();
        expect(formRules.structure.satisfied).toEqual(false);
    });

    it('should not be satisfied when one of the parts of {domein}/{type}/{concept}(/{referentie})* is missing', () => {
       const URI = "https://data.vlaanderen.be/ns" ;
        let formRules = new FormRulesCheck(URI).checkURI();
        expect(formRules.structure.satisfied).toEqual(false);

    });

    it('should be satisfied when the recommended URI structure was used', () => {
       const URI = "https://data.vlaanderen.be/ns/adres";
       let formRules = new FormRulesCheck(URI).checkURI();
       expect(formRules.structure.satisfied).toEqual(true);
    });
});
