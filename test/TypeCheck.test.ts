import {TypeCheck} from "../lib/TypeCheck";


describe('[TypeCheck]: The {type} checking module', () => {

    // Constructor test
    it('should be a FormRulesCheck constructor', () => {
        expect(new TypeCheck("")).toBeInstanceOf(TypeCheck);
    });

    it('should not be satisfied when type id, doc or ns is missing', () => {
       let URI = "https://lokaalbestuur.vlaanderen.be/lokale-besluiten-als-gelinkte-open-data";
       let typeCheck = new TypeCheck(URI).checkURI();
       expect(typeCheck.type.satisfied).toEqual(false);
    });

    it('should be satisfied when type is id, doc or ns', () => {
        let URI = "https://data.vlaanderen.be/id/adres/3706808";
        let typeCheck = new TypeCheck(URI).checkURI();
        expect(typeCheck.type.satisfied).toEqual(true);
    });
});