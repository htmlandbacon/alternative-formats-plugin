/**
 * Checks if a value is 'undefined' or null
 *
 * @param {Any} value  The value to test
 * @returns {Boolean}  True if there is a 'some' value, false if value is equal to 'undefined' string or equates to null
 */
const hasValue = (value) => {
  return typeof value === "undefined" || value === null ? false : true;
};

/**
 * generateUuidv4
 *
 * Generates a random string of letters and numbers, useful for creating ids
 *
 * @returns {string}
 */
const generateUuidv4 = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Clean session data
 *
 * As the user may click around selecting options going back and forth the session is storing everything,
 * this will clean all the unrequired data so it's not printed on check answers page
 *
 * @param {object} formatData - either data.altFormatsV2Journey1.letter or data.altFormatsV2Journey1.phoneCall
 * @returns {object}
 */
const cleanData = (formatData) => {
  let validKeys;

  switch (formatData.format) {
    case "large-print":
      validKeys = ["id", "format", "largePrint", "largePrintOther"];
      break;
    case "non-standard-letter":
      validKeys = [
        "id",
        "format",
        "nonStandardletter",
        "largePrint",
        "largePrintOther",
        "paperColour",
        "paperColourOther",
        "boldText",
        "font",
        "fontOther",
        "doubleLineSpacing",
        "nonStandardLetterOther",
      ];
      break;
    case "braille":
      validKeys = ["id", "format", "brailleType"];
      break;
    case "british-sign-language-video":
      validKeys = [
        "id",
        "format",
        "britishSignLanguageVideoFormat",
        "britishSignLanguageMpegEmail",
      ];
      break;
    case "audio":
      validKeys = ["id", "format", "audioFormat", "audioMp3Email"];
      break;
    case "pdf":
      validKeys = ["id", "format", "pdfEmail"];
      break;
    case "word":
      validKeys = ["id", "format", "wordEmail"];
      break;
    case "email-reasonable-adjustment": // used for both letters and phone calls
      validKeys = ["id", "format", "emailReasonableAdjustment"];
      break;
    case "letter-other":
      validKeys = ["id", "format", "letterOther"];
      break;
    case "standard-letter":
      validKeys = ["id", "format"];
      break;
    case "relay-uk":
      validKeys = ["id", "format", "relayUkNumber"];
      break;
    case "textphone":
      validKeys = ["id", "format", "textphone"];
      break;
    case "signing-lipspeaking":
      validKeys = [
        "id",
        "format",
        "signingLipspeaking",
        "signingLipspeakingOther",
      ];
      break;
    case "phone-call-other":
      validKeys = ["id", "format", "phoneCallOther"];
      break;
    case "standard-phone-call":
      validKeys = ["id", "format"];
      break;
    default:
      validKeys = []; // delete everything
      break;
  }

  // go through each property and if it's not in the valid keys then remove it
  Object.keys(formatData).forEach(
    (key) => validKeys.includes(key) || delete formatData[key],
  );

  return formatData;
};

module.exports = {
  hasValue,
  generateUuidv4,
  cleanData,
};
