const { views } = require("govuk-prototype-kit");

function altFormatsV2Journey1Label(formatId, alternativeDescription) {
  switch (formatId) {
    // Heading caption
    case "heading-caption":
      return "Alternative formats";

    // How do you want your letters?
    case "large-print":
      return "Large print";
    case "non-standard-letter":
      if (alternativeDescription) {
        return "Another print size, font or paper colour";
      }

      return "Another print size, font or paper colour";
    case "braille":
      return "Braille";
    case "british-sign-language-video":
      return "British Sign Language video";
    case "audio":
      return "Audio";
    case "accessible-document":
      return "Email attachment (Word or accessible PDF)";
    case "pdf":
      return "PDF with accessibility features";
    case "word":
      return "Microsoft Word document";
    case "email-reasonable-adjustment":
      return "Email as a reasonable adjustment";
    case "standard-letter":
      if (alternativeDescription) {
        return "Standard letter (12-point Arial text on white paper)";
      }

      return "Standard letter (12-point Arial text on white paper)";

    // What font size do you need?
    case "large-print-16":
      if (alternativeDescription) {
        return "16 point";
      }

      return "16 point";

    case "large-print-18":
      if (alternativeDescription) {
        return "18 point";
      }

      return "18 point";

    case "large-print-24":
      if (alternativeDescription) {
        return "24 point";
      }

      return "24 point";

    // What changes do you need to make to a standard letter?

    case "coloured-paper":
      return "Coloured paper";
    case "bold-text":
      return "Bold text";
    case "font":
      return "A different font";
    case "double-line-spacing":
      return "Double line spacing";

    // What colour paper do you need?
    case "cream":
      return "Cream";
    case "pastel-blue":
      return "Pastel blue";
    case "pastel-yellow":
      return "Pastel yellow";
    case "pale-pink":
      return "Pale pink";

    // What font style do you need?
    case "arial":
      return "Arial";
    case "calibri":
      return "Calibri";
    case "helvetica":
      return "Helvetica";
    case "tahoma":
      return "Tahoma";
    case "times-new-roman":
      return "Times New Roman";
    case "verdana":
      return "Verdana";

    // What type of braille do you need?
    case "grade-1":
      return "Uncontracted braille (grade 1)";
    case "grade-2":
      return "Contracted braille (grade 2)";

    // What type of British Sign Language video do you need?
    case "dvd":
      return "DVD";
    case "mpeg":
      return "MPEG file by email";

    // What audio format do you need?
    case "cd":
      return "CD";
    case "mp3":
      return "MP3 file by email";
    case "cassette-tape":
      return "Cassette tape";

    // How would you like to receive phone calls?
    case "relay-uk":
      return "Relay UK";
    case "textphone":
      return "Textphone";
    case "signing-lipspeaking":
      return "Signing or lipspeaking";
    case "phone-call-other":
      return "Something else";
    case "standard-phone-call":
      if (alternativeDescription) {
        return "Standard phone call";
      }

      return "Standard phone call";

    // What signing or lipspeaking service do you need?
    case "british-sign-language-interpreter":
      return "British Sign Language (BSL) interpreter";
    case "hands-on-signing":
      return "Hands-on signing";
    case "sign-supported-english":
      return "Sign Supported English";
    case "lipspeaking":
      return "Lipspeaking";
    case "deafblind-manual-alphabet":
      return "Deafblind Manual alphabet";

    // Add another
    case "add-another-letter":
      return "Letters";
    case "add-another-phone-call":
      return "Phone calls";
    case "add-another-cancel":
      return "I don't need to add another format";

    default:
      console.log(
        "formatId not recognised - check altFormatsV1Journey1 in filters.js to see if the case for the given id exists.",
      );
      return "formatId not recognised - check altFormatsV1Journey1 in filters.js to see if the case for the given id exists.";
  }
}

/**
 * 2. altFormatsV2Journey1ListFormats
 * Takes the options provided by data['letterFormatV1Journey1'] or data['phoneCallFormatV1Journey1'] and removes data that is not required and
 * coverts everything else into readable text.
 *
 * Put this in as to edit the copy to give it more context e.g. instead of returning 'Blue', this can look for 'colour-paper' and
 * return 'Blue coloured paper' - if required
 *
 * @param {options} Object of options set by the form
 * @returns {array} Array of formatted strings to list the set options for each chosen format
 *
 */

function altFormatsV2Journey1ListFormats(options) {
  const _options = Object.assign({}, options); // clone the options so session data is not overwritten
  let values = []; // empty array to return any of the values we want to render

  // remove properties we don't need to render

  if (_options.format == "large-print") {
    if (_options.largePrint == "large-print-other") {
      delete _options.largePrint;
    } else {
      delete _options.largePrintOther;
    }
  }

  if (_options.format == "non-standard-letter") {
    if (_options.largePrint == "large-print-other") {
      delete _options.largePrint;
    } else {
      delete _options.largePrintOther;
    }

    if (_options.paperColour == "other-paper-colour") {
      delete _options.paperColour;
    } else {
      delete _options.paperColourOther;
    }

    if (_options.font == "font-other") {
      delete _options.font;
    } else {
      delete _options.fontOther;
    }

    delete _options.nonStandardletter;
  }

  if (_options.format == "signing-lipspeaking") {
    if (_options.signingLipspeaking == "signing-lipspeaking-other") {
      delete _options.signingLipspeaking;
    } else {
      delete _options.signingLipspeakingOther;
    }
  }

  if (
    _options.format == "british-sign-language-video" &&
    _options.britishSignLanguageVideoFormat !== "mpeg"
  ) {
    if (_options.britishSignLanguageMpegEmail) {
      delete _options.britishSignLanguageMpegEmail;
    }
  }

  if (_options.format == "audio" && _options.audioFormat !== "mp3") {
    if (_options.audioMp3Email) {
      delete _options.audioMp3Email;
    }
  }

  delete _options.format;
  delete _options.id;

  // loop through what's left, formatting values where required
  for (const prop in _options) {
    if (_options[prop] == "") {
      delete _options[prop];
    } else {
      const textTransformExcludeList = [
        "paperColourOther", // fields that do not need to go through altFormatsV2Journey1Label filter
        "fontOther",
        "britishSignLanguageMpegEmail",
        "audioMp3Email",
        "pdfEmail",
        "wordEmail",
        "emailReasonableAdjustment",
        "letterOther",
        "nonStandardLetterOther",
        "relayUkNumber",
        "textphone",
        "signingLipspeakingOther",
        "phoneCallOther",
        "id",
      ];
      let _prop = _options[prop];

      if (prop == "largePrint") {
        _prop = "Font size " + altFormatsV2Journey1Label(_prop, true);
        // _prop = altFormatsV2Journey1Label(_prop)
      } else if (prop == "largePrintOther") {
        _prop = "Size " + _prop;
      } else if (prop == "paperColour") {
        _prop = altFormatsV2Journey1Label(_prop) + " paper";
        // _prop = altFormatsV2Journey1Label(_prop)
      } else if (!textTransformExcludeList.includes(prop)) {
        // set values through altFormatsV2Journey1Label filter that require it
        _prop = altFormatsV2Journey1Label(_prop);
      }

      values.push(_prop); // add value to list
    }
  }

  return values;
}

module.exports = {
  altFormatsV2Journey1Label,
  altFormatsV2Journey1ListFormats,
};

views.addFilter("altFormatsV2Journey1Label", altFormatsV2Journey1Label);
views.addFilter(
  "altFormatsV2Journey1ListFormats",
  altFormatsV2Journey1ListFormats,
);
