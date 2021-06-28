const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const Joi = require("joi");

const { UserStory } = require("../models/user-story");
const { Request } = require("../models/request");

const { sanitizeText } = require("../middleware/input-sanitize");

const { WRONG_FORM_STRUCTURE, MISSING_STORY_FIELDS, WRONG_CAPTCHA, REQUEST_ACCEPTED, REQUEST_FAILURE } = require("../utils/response-messages");
const tokenPattern = /([A-Za-z0-9-_])/;

const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { OK, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const requestSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    stories: Joi.string().required(),
    token: Joi.string().pattern(tokenPattern).required(),
})

const userStorySchema = Joi.object({
    role: Joi.string().required(),
    verb: Joi.string().required(),
    action: Joi.string().required()
})

router.get("/api/orders/uc/:ucParam", async (req, res) => {
    let order;

    try {
        order = await Request.findOne({ ucParam: req.params.ucParam }).exec();
    } catch(error) {
        console.log(error);
        return res.sendStatus(INTERNAL_SERVER_ERROR);
    }

    if(!order) return res.sendStatus(NOT_FOUND);

    return res.status(OK).send({ useCases: order["actorsWithUseCases"] });
})

router.post("/api/stories", async (req, res) => {
    let captcha, storiesReceived;
    let validForm = false;

    const userStories = [];

    try {
        validForm = await requestSchema.validateAsync(req.body);
    } catch(error) {
        console.log(error);
        return res.status(BAD_REQUEST).send(WRONG_FORM_STRUCTURE);
    }

    if(!validForm) return res.status(BAD_REQUEST).send(WRONG_FORM_STRUCTURE);

    try {
        captcha = await axios.post(`${process.env.CAPTCHA_API}?secret=${process.env.CAPTCHA_SECRET}&response=${req.body.token}`, {});
    } catch(error) {
        console.log(error);
        return res.status(UNAUTHORIZED).send(WRONG_CAPTCHA);
    }

    if(!captcha) return res.status(UNAUTHORIZED).send(WRONG_CAPTCHA);

    if(!captcha.data.success) return res.status(UNAUTHORIZED).send(WRONG_CAPTCHA);

    try {
        storiesReceived = JSON.parse(req.body.stories);
    } catch(error) {
        console.log(error);
        return res.status(BAD_REQUEST).send(WRONG_FORM_STRUCTURE);
    }

    for(const story of storiesReceived) {
        let validUserStory = false;

        try {
            validUserStory = await userStorySchema.validateAsync(story);
        } catch(error) {
            console.log(error);
            return res.status(BAD_REQUEST).send(WRONG_FORM_STRUCTURE);
        }
    
        if(!validUserStory) return res.status(BAD_REQUEST).send(MISSING_STORY_FIELDS);

        const role = sanitizeText(story.role);
        const verb = sanitizeText(story.verb);
        const action = sanitizeText(story.action);

        if(!role || !action || !verb) return res.status(BAD_REQUEST).send(MISSING_STORY_FIELDS);

        userStories.push(new UserStory({ role: role, verb: verb, action: action }));
    }

    const request = new Request({
        email: req.body.email,
        completed: false,
        userStories: userStories,
        fullSentences: [],
        diagrams: {
            class: "",
            useCase: ""
        }
    });

    try {
        await request.save();
    } catch(error) {
        console.log(error);
        return res.status(INTERNAL_SERVER_ERROR).send(REQUEST_FAILURE);
    }

    return res.status(OK).send(REQUEST_ACCEPTED);
})

module.exports = router;