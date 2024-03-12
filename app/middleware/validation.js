const Joi = require('joi');

const registerValidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    conformpassword: Joi.string().valid(Joi.ref('password')).required(),
});

const loginvalidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const postvalidation = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    active: Joi.boolean().required(),
    address: Joi.string().required(),
})

module.exports = {
    registerValidation,
    loginvalidation,
    postvalidation
}