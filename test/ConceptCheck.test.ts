import {ConceptCheck} from "../lib/ConceptCheck";


describe('[ConceptCheck]: The {concept} checking module', () => {
    // Constructor test
    it('should be a ConceptCheck constructor', () => {
        expect(new ConceptCheck("")).toBeInstanceOf(ConceptCheck);
    });
});