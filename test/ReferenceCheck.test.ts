import {ReferenceCheck} from "../lib/ReferenceCheck";


describe('[ReferenceCheck]: The {reference} checking module', () => {

    // Constructor test
    it('should be a ReferenceCheck constructor', () => {
        expect(new ReferenceCheck("")).toBeInstanceOf(ReferenceCheck);
    });

    it('should be satisfied when the type is ns and no fragment identifiers were used', () => {
        let URI = "https://data.vlaanderen.be/ns/adres"
        let referenceCheck = new ReferenceCheck(URI).checkURI();
        expect(referenceCheck.reference.satisfied).toEqual(true);
    });

    it('should be satisfied when the type is ns and fragment identifiers were used', () => {
        let URI = "https://data.vlaanderen.be/ns/adres#Adreslocator";
        let referenceCheck = new ReferenceCheck(URI).checkURI();
        expect(referenceCheck.reference.satisfied).toEqual(true);
    })

    it('should be satisfied when the type is id or doc and that no fragment identifiers were used', () => {
        let URI = "https://data.vlaanderen.be/id/adres/3706808";
        let referenceCheck = new ReferenceCheck(URI).checkURI();
        expect(referenceCheck.reference.satisfied).toEqual(true);
    });

    it('should not be satisfied when the type is id or doc and that fragment identifiers were used', () => {
        let URI = "https://data.vlaanderen.be/id/adres/test#3706808";
        let referenceCheck = new ReferenceCheck(URI).checkURI();
        expect(referenceCheck.reference.satisfied).toEqual(false);
    });
});