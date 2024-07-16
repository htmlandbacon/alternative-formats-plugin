const { hasValue, generateUuidv4, cleanData } = require("./utils");
/**
 * 2. Alternative formats alternative-formats/alternative-formats/v1/journey-3
 *
 * Routing for alternative-formats/alternative-formats/v1/journey-3 experience
 */

module.exports = (router) => {
  /**
   * Start url
   *
   * Redirects a user to the start of our journey
   *
   */
  router.get("/alternative-formats/start", (req, res) => {
    res.redirect("/alternative-formats/v2/journey-1/");
  });
  /**
   * Clear data
   *
   * Clears only alternative formats alternative-formats/alternative-formats/v1/journey-3 data
   *
   */
  router.post("/alternative-formats/v2/journey-1/clear-data", (req, res) => {
    req.session.data.altFormatsV2Journey1 = {};

    res.redirect("./clear-data-success");
  });

  /**
   * gotoCallOptions
   *
   * Cleans the data
   * Checks letter has an id and if not creates one and adds to data.altFormatsV2Journey1.letters object
   * Navigate to phone-call-options after letter questions or if coming from a change then go back to check-answers
   *
   * @param {object} session request
   * @param {object} session response
   * */
  const gotoCallOptions = (req, res) => {
    const data = req.session.data.altFormatsV2Journey1;
    let letter = cleanData(data.letter);

    if (!hasValue(data.letters)) {
      data.letters = [];
    }

    if (hasValue(letter.id)) {
      const index = data.letters.findIndex((format) => format.id === letter.id);

      data.letters.splice(index, 1, letter);
    } else {
      letter.id = generateUuidv4();
      data.letters.push(letter);
    }

    if (hasValue(data.addAnother)) {
      delete data.addAnother;
    }

    if (data.skipToCheckAnswers) {
      data.skipToCheckAnswers = false;
      res.redirect("./check-answers");
    } else {
      res.redirect("./phone-call-options");
    }
  };

  /**
   * Post: feedback-found-format
   *
   * If no ask for details else redirect to check answers
   */
  router.post(
    "/alternative-formats/v2/journey-1/feedback-found-format",
    (req, res) => {
      const data = req.session.data.altFormatsV2Journey1;

      if (data.feedback.foundFormat === "yes") {
        res.redirect("feedback-format-details");
      } else {
        res.redirect("check-answers");
      }
    },
  );

  /**
   * Post: feedback-format-details
   *
   */
  router.post(
    "/alternative-formats/v2/journey-1/feedback-format-details",
    (_req, res) => {
      res.redirect("check-answers");
    },
  );

  /**
   * setPhoneData
   *
   * Cleans the data
   * Checks phoneCall has an id and if not creates one and adds to data.altFormatsV2Journey1.phoneCalls object
   * Navigate to check-answers after phone call questions
   *
   * @param {object} session request
   * @param {object} session response
   * */
  const setPhoneData = (req, res) => {
    const data = req.session.data.altFormatsV2Journey1;
    let phoneCall = cleanData(data.phoneCall);

    if (!hasValue(data.phoneCalls)) {
      data.phoneCalls = [];
    }

    if (hasValue(phoneCall.id)) {
      const index = data.phoneCalls.findIndex(
        (format) => format.id === phoneCall.id,
      );

      data.phoneCalls.splice(index, 1, phoneCall);
    } else {
      phoneCall.id = generateUuidv4();
      data.phoneCalls.push(phoneCall);
    }

    if (hasValue(data.addAnother)) {
      delete data.addAnother;
    }

    if (data.skipToCheckAnswers) {
      data.skipToCheckAnswers = false;
      res.redirect("./check-answers");
    } else {
      res.redirect("./feedback-found-format");
    }
  };

  /**
   * Get: change
   *
   * Find the format that requires amending from the added formats and load the values into the the form for editing
   *
   *  */
  router.get(
    "/alternative-formats/v2/journey-1/amend/:type/:id",
    (req, res) => {
      const data = req.session.data.altFormatsV2Journey1;
      const source = data[req.params.type + "s"].find((object) => {
        return object.id == req.params.id;
      });

      data[req.params.type] = source;
      data.skipToCheckAnswers = true;

      if (req.params.type == "phoneCall") {
        res.redirect("../../phone-call-options");
      } else {
        res.redirect("../../index");
      }
    },
  );

  /**
   * Get: remove
   *
   * Go to confirm removal page
   *
   */
  router.get(
    "/alternative-formats/v2/journey-1/remove/:type/:id",
    (req, res) => {
      let formatList =
        req.session.data.altFormatsV2Journey1[req.params.type + "s"];
      const toDelete = formatList.find((object) => {
        return object.id == req.params.id;
      });

      res.render("../views/alternative-formats/v2/journey-1/remove.html", {
        format: toDelete,
        type: req.params.type,
      });
    },
  );

  /**
   * Post: remove
   *
   * Delete format from session if yes and redirect to check answers, else go back to check answers
   */
  router.post(
    "/alternative-formats/v2/journey-1/remove/:type/:id",
    (req, res) => {
      if (req.body.removeConfirmation === "yes") {
        let formatList =
          req.session.data.altFormatsV2Journey1[req.params.type + "s"];
        const toDelete = formatList.find((object) => {
          return object.id == req.params.id;
        });

        // rewrite the list without the specified format - therefore deleted
        req.session.data.altFormatsV2Journey1[req.params.type + "s"] =
          formatList.filter((format) => format !== toDelete);
      }

      res.redirect("../../check-answers");
    },
  );

  /**
   * GET: how-would-you-like-letters - first letter question
   */
  router.get(
    [
      "/alternative-formats/v2/journey-1/index",
      "/alternative-formats/v2/journey-1/",
    ],
    (_req, _res, next) => {
      next();
    },
  );

  /**
   * POST: how-would-you-like-letters - redirect to set format options if available or go to call options
   */
  router.post(
    "/alternative-formats/v2/journey-1/how-would-you-like-letters",
    (req, res, next) => {
      let letterFormat;

      if (hasValue(req.session.data.altFormatsV2Journey1.letter)) {
        letterFormat = req.session.data.altFormatsV2Journey1.letter.format
          ? req.session.data.altFormatsV2Journey1.letter.format
          : false;

        if (letterFormat) {
          switch (letterFormat) {
            case "large-print":
              res.redirect("./large-print");
              break;
            case "non-standard-letter":
              res.redirect("./non-standard-letter");
              break;
            case "braille":
              res.redirect("./braille");
              break;
            case "british-sign-language-video":
              res.redirect("./british-sign-language-video");
              break;
            case "audio":
              res.redirect("./audio");
              break;
            case "pdf":
              res.redirect("./pdf-email");
              break;
            case "word":
              res.redirect("./word-email");
              break;
            case "email-reasonable-adjustment":
              res.redirect("./email-reasonable-adjustment-letter");
              break;
            case "letter-other":
              res.redirect("./letter-other");
              break;
            default:
              gotoCallOptions(req, res, next); // end letter question and go to next step
              break;
          }
        } else {
          console.log("do validation");
        }
      }
    },
  );

  /**
   * POST: non-standard-letter - collate what non-standrd options to set
   */
  router.post(
    "/alternative-formats/v2/journey-1/non-standard-letter",
    (req, res, next) => {
      const letterFormat = req.session.data.altFormatsV2Journey1.letter;
      const nonStandardletter = letterFormat.nonStandardletter;

      let nextletterFormat = nonStandardletter ? nonStandardletter[0] : false;

      // if any boxes have been unchecked remove any previously saved answers
      if (nonStandardletter) {
        if (!nonStandardletter.includes("large-print")) {
          delete letterFormat.largePrint;
          delete letterFormat.largePrintOther;
        }

        if (!nonStandardletter.includes("coloured-paper")) {
          delete letterFormat.paperColour;
          delete letterFormat.paperColourOther;
        }

        if (!nonStandardletter.includes("bold-text")) {
          delete letterFormat.boldText;
        }
        if (!nonStandardletter.includes("font")) {
          delete letterFormat.font;
          delete letterFormat.fontOther;
        }
        if (!nonStandardletter.includes("double-line-spacing")) {
          delete letterFormat.doubleLineSpacing;
        }
        if (!nonStandardletter.includes("non-standard-letter-other")) {
          delete letterFormat.nonStandardLetterOther;
        }
      }

      if (nextletterFormat) {
        switch (nextletterFormat) {
          case "font":
            res.redirect("./font");
            break;
          case "bold-text":
            res.redirect("./bold-text");
            break;
          case "coloured-paper":
            res.redirect("./coloured-paper");
            break;
          case "double-line-spacing":
            res.redirect("./double-line-spacing");
            break;
          case "large-print":
            res.redirect("./large-print");
            break;
          case "standard-letter":
            delete req.session.data.altFormatsV2Journey1.letter;
            req.session.data.altFormatsV2Journey1.letters = [];
            req.session.data.altFormatsV2Journey1.letter = new Object({
              letterFormat: { format: null },
            });
            req.session.data.altFormatsV2Journey1.letter.format =
              "standard-letter";
            gotoCallOptions(req, res, next); // end letter question and go to next step
            break;
          default:
            delete req.session.data.altFormatsV2Journey1.letter
              .nonStandardletter;
            console.log("do validation in case");
            break;
        }
      } else {
        delete req.session.data.altFormatsV2Journey1.letter.nonStandardletter;
        console.log("do validation in else");
      }
    },
  );

  /**
   * POST: large-print - set font size and check if other options to set
   */
  router.post(
    "/alternative-formats/v2/journey-1/large-print",
    (req, res, next) => {
      gotoCallOptions(req, res, next); // end letter question and go to next step
    },
  );

  /**
   * POST: coloured-paper - set colour and check if other options to set
   */
  router.post(
    "/alternative-formats/v2/journey-1/coloured-paper",
    (req, res, next) => {
      let nonStandardletter = req.session.data.altFormatsV2Journey1.letter
        .nonStandardletter
        ? req.session.data.altFormatsV2Journey1.letter.nonStandardletter
        : false;

      if (nonStandardletter) {
        if (nonStandardletter.includes("double-line-spacing")) {
          res.redirect("./double-line-spacing");
        } else if (nonStandardletter.includes("large-print")) {
          res.redirect("./large-print");
        } else {
          gotoCallOptions(req, res, next); // end letter question and go to next step
        }
      } else {
        gotoCallOptions(req, res, next); // end letter question and go to next step
      }
    },
  );

  /**
   * GET: bold-text - set bold font doing this so it maintains order in check your answers
   */
  router.get(
    "/alternative-formats/v2/journey-1/bold-text",
    (req, res, next) => {
      req.session.data.altFormatsV2Journey1.letter["boldText"] = "bold-text";

      let nonStandardletter = req.session.data.altFormatsV2Journey1.letter
        .nonStandardletter
        ? req.session.data.altFormatsV2Journey1.letter.nonStandardletter
        : false;

      if (nonStandardletter) {
        if (nonStandardletter.includes("coloured-paper")) {
          res.redirect("./coloured-paper");
        } else if (nonStandardletter.includes("double-line-spacing")) {
          res.redirect("./double-line-spacing");
        } else if (nonStandardletter.includes("large-print")) {
          res.redirect("./large-print");
        } else {
          gotoCallOptions(req, res, next); // end letter question and go to next step
        }
      } else {
        gotoCallOptions(req, res, next); // end letter question and go to next step
      }
    },
  );

  /**
   * POST: font - set font and check if other options to set
   */
  router.post("/alternative-formats/v2/journey-1/font", (req, res, next) => {
    let nonStandardletter = req.session.data.altFormatsV2Journey1.letter
      .nonStandardletter
      ? req.session.data.altFormatsV2Journey1.letter.nonStandardletter
      : false;

    if (nonStandardletter.includes("bold-text")) {
      res.redirect("./bold-text");
    } else if (nonStandardletter.includes("coloured-paper")) {
      res.redirect("./coloured-paper");
    } else if (nonStandardletter.includes("double-line-spacing")) {
      res.redirect("./double-line-spacing");
    } else if (nonStandardletter.includes("large-print")) {
      res.redirect("./large-print");
    } else {
      gotoCallOptions(req, res, next); // end letter question and go to next step
    }
  });

  /**
   * GET: double-line-spacing - set double line spacing doing this so it maintains order in check your answers
   */
  router.get(
    "/alternative-formats/v2/journey-1/double-line-spacing",
    (req, res, next) => {
      req.session.data.altFormatsV2Journey1.letter["doubleLineSpacing"] =
        "double-line-spacing";

      let nonStandardletter = req.session.data.altFormatsV2Journey1.letter
        .nonStandardletter
        ? req.session.data.altFormatsV2Journey1.letter.nonStandardletter
        : false;

      if (nonStandardletter && nonStandardletter.includes("large-print")) {
        res.redirect("./large-print");
      } else {
        gotoCallOptions(req, res, next); // end letter question and go to next step
      }
    },
  );

  /**
   * POST: british-sign-language-video - redirect to email question or move to call options
   */
  router.post(
    "/alternative-formats/v2/journey-1/british-sign-language-video",
    (req, res, next) => {
      if (
        req.session.data.altFormatsV2Journey1.letter.format ==
          "british-sign-language-video" &&
        req.session.data.altFormatsV2Journey1.letter
          .britishSignLanguageVideoFormat == "mpeg"
      ) {
        res.redirect("./british-sign-language-video-mpeg-email");
      } else {
        gotoCallOptions(req, res, next);
      }
    },
  );
  /**
   * POST: audio - redirect to email question or move to call options
   */
  router.post("/alternative-formats/v2/journey-1/audio", (req, res, next) => {
    if (
      req.session.data.altFormatsV2Journey1.letter.format == "audio" &&
      req.session.data.altFormatsV2Journey1.letter.audioFormat == "mp3"
    ) {
      res.redirect("./audio-mp3-email");
      console.log("here in audio");
    } else {
      gotoCallOptions(req, res, next);
    }
    console.log("email output: ");
  });

  /**
   * POST: accessible-document - set document type
   */
  router.post(
    "/alternative-formats/v2/journey-1/accessible-document",
    (_req, res) => {
      res.redirect("./accessible-document-email");
    },
  );

  /**
   * POST: letter-other - set freetext box response
   */

  router.post(
    "/alternative-formats/v2/journey-1/non-standard-letter-other",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );
  router.post("/alternative-formats/v2/journey-1/braille", (req, res, next) => {
    gotoCallOptions(req, res, next);
  });
  router.post(
    "/alternative-formats/v2/journey-1/british-sign-language-mpeg-email",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/audio-mp3-email",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/pdf-email",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/word-email",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/email-reasonable-adjustment-letter",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/letter-other",
    (req, res, next) => {
      gotoCallOptions(req, res, next);
    },
  );

  /**
   * POST: how-would-you-like-phone-calls - redirect set format options if available or go to check answers
   */
  router.post(
    "/alternative-formats/v2/journey-1/how-would-you-like-phone-calls",
    (req, res, next) => {
      let phoneCallFormat;

      if (hasValue(req.session.data.altFormatsV2Journey1.phoneCall)) {
        phoneCallFormat = req.session.data.altFormatsV2Journey1.phoneCall.format
          ? req.session.data.altFormatsV2Journey1.phoneCall.format
          : false;

        if (phoneCallFormat) {
          switch (phoneCallFormat) {
            case "relay-uk":
              res.redirect("./relay-uk");
              break;
            case "textphone":
              res.redirect("./textphone");
              break;
            case "email-reasonable-adjustment":
              res.redirect("./email-reasonable-adjustment-phone-call");
              break;
            case "signing-lipspeaking":
              res.redirect("./signing-lipspeaking");
              break;
            case "phone-call-other":
              res.redirect("./phone-call-other");
              break;
            default:
              setPhoneData(req, res, next);
              break;
          }
        } else {
          console.log("do validation");
        }
      }
    },
  );

  /**
   * POST: signing-lipspeaking - redirect to signing-lipspeaking-other question
   */
  router.post(
    "/alternative-formats/v2/journey-1/signing-lipspeaking",
    (req, res, next) => {
      if (hasValue(req.session.data.altFormatsV2Journey1.phoneCall)) {
        if (
          req.session.data.altFormatsV2Journey1.phoneCall.signingLipspeaking ==
          "signing-lipspeaking-other"
        ) {
          res.redirect("./signing-lipspeaking-other");
        } else {
          setPhoneData(req, res, next);
        }
      }
    },
  );

  router.post(
    "/alternative-formats/v2/journey-1/relay-uk",
    (req, res, next) => {
      setPhoneData(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/textphone",
    (req, res, next) => {
      setPhoneData(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/signing-lipspeaking-other",
    (req, res, next) => {
      setPhoneData(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/phone-call-other",
    (req, res, next) => {
      setPhoneData(req, res, next);
    },
  );
  router.post(
    "/alternative-formats/v2/journey-1/email-reasonable-adjustment-phone-call",
    (req, res, next) => {
      setPhoneData(req, res, next);
    },
  );
};
