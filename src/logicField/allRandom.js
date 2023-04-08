const Fakerator = require("fakerator");
let fakerator = Fakerator();

const langChoices = ['en-EN', 'ru-RU', 'fr-FR'];
const typesOfErrors = ['delete', 'add', 'swap'];
const applicableToOneOfThem = ['name', 'address', 'phone'];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const RandomModule = {
    getRecordsWithoutError(amount, langProp, seed = 0) {
        let chosenLang = this.findLocalization(langProp);
        let fakerator = Fakerator(chosenLang);
        let records = {};
        let page = 0;
        for (let i = 1; i <= amount; i++) {
            if (i.toString().slice(-1) == 1) {
                page++;
                fakerator.seed(parseInt(seed) + page);
            }
            let tempAdd;
            tempAdd = fakerator.address.country();
            tempAdd += ', ' + fakerator.address.city();
            tempAdd += ', ' + fakerator.address.streetName();
            tempAdd += ', ' + fakerator.address.buildingNumber();
            records[i] = { 
                name: fakerator.names.name(),
                address: tempAdd,
                phone: fakerator.phone.number(),
                id: fakerator.random.number(100000000)
            };
        }
        return records;
    },

    getRecordsWithError(amount, langProp, err, seed = 0) {
        let chosenLang = this.findLocalization(langProp);
        let fakerator = Fakerator(chosenLang);
        let records = {};
        let page = 0;
        for (let i = 1; i <= amount; i++) {
            if (i.toString().slice(-1) == 1) {
                page++;
                fakerator.seed(parseInt(seed) + page);
            }
            let tempAdd;
            tempAdd = fakerator.address.country();
            tempAdd += ', ' + fakerator.address.city();
            tempAdd += ', ' + fakerator.address.streetName();
            tempAdd += ', ' + fakerator.address.buildingNumber();
            records[i] = { 
                name: fakerator.names.name(),
                address: tempAdd,
                phone: fakerator.phone.number(),
                id: fakerator.random.number(100000000),
            };
            let checkForCertainErr = Math.trunc(err / 1);
            if (err % 1 != 0) {
                if (i % 2 === 0) {
                    let { whichOfEach, oneFromThree, errType, ranChar, oneCharFromString } = this.generateRandomEverything(records, i);
                    if (i - (i - 2) === whichOfEach) {
                        this.doThreeTypesOfError(records, i, oneFromThree, errType, ranChar, oneCharFromString);
                    } else {
                        this.doThreeTypesOfError(records, i-1, oneFromThree, errType, ranChar, oneCharFromString);
                    }
                }
                if (checkForCertainErr !== 0) {
                    for (let j = 0; j < checkForCertainErr; j++) {
                        let { oneFromThree, errType, ranChar, oneCharFromString } = this.generateRandomEverything(records, i);
                        this.doThreeTypesOfError(records, i, oneFromThree, errType, ranChar, oneCharFromString);
                    }
                }
            } else if (err % 1 === 0) {
                for (let j = 0; j < checkForCertainErr; j++) {
                    let { oneFromThree, errType, ranChar, oneCharFromString } = this.generateRandomEverything(records, i);
                    this.doThreeTypesOfError(records, i, oneFromThree, errType, ranChar, oneCharFromString);
                }
            }
        }
        return records;
    },

    findLocalization(langProp) {
        return langChoices.find((each, ndx) => {
            if (each.includes(langProp))
                return langChoices[ndx];
        });
    },

    doThreeTypesOfError(records, i, oneFromThree, errType, ranChar, oneCharFromString) {
        if (errType === 'delete') {
            records[i][oneFromThree] = records[i][oneFromThree].slice(0, oneCharFromString) + records[i][oneFromThree].slice(oneCharFromString + 1);
        } else if (errType === 'add') {
            records[i][oneFromThree] = records[i][oneFromThree].substr(0, oneCharFromString) + ranChar + records[i][oneFromThree].substr(oneCharFromString);
        } else {
            records[i][oneFromThree] = records[i][oneFromThree].substring(0, oneCharFromString) + ranChar + records[i][oneFromThree].substring(oneCharFromString + 1);
        }
    },
    
    generateRandomEverything(records, i) {
        let whichOfEach, oneFromThree, errType, ranChar, sizeOfApplicable, oneCharFromString;
        whichOfEach = Math.floor(Math.random() * 2) + 1;
        oneFromThree = applicableToOneOfThem[Math.floor(Math.random() * 3)];
        errType = typesOfErrors[Math.floor(Math.random() * 3)];
        ranChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        sizeOfApplicable = records[i][oneFromThree].length;
        oneCharFromString = Math.floor(Math.random() * (sizeOfApplicable));
        return { whichOfEach, oneFromThree, errType, ranChar, oneCharFromString };
    }
};
