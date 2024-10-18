const Joi = require('joi'); 

exports.registerValidator = (req, res, next) => {
    const schema = Joi.object().keys({ 
        firstName: Joi.string().alphanum().min(2).max(30).required(),
        lastName: Joi.string().alphanum().min(2).max(30).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^[0-9-]+$/).optional(),
        password: Joi.string().alphanum().min(6).max(30).required(),
        confirmPassword: Joi.string().alphanum().min(6).max(30).required(),
    }); 

    const { error } = schema.validate(req.body); 
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }
    next();
}

exports.loginValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).max(30).required(),
    }); 

    const { error } = schema.validate(req.body); 
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }
    next();
}

exports.roleValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        roleName: Joi.string().required(),
    }); 

    const { error } = schema.validate(req.body); 
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }
    next();
}

exports.editRoleValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        id: Joi.string().required(),
        roleName: Joi.string().required(),
    }); 

    const { error } = schema.validate(req.body); 
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }
    next();
}

exports.assignRoleValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        userId: Joi.string().required(),
        roleId: Joi.string().required(),
    }); 

    const { error } = schema.validate(req.body); 
    if (error) {
        return res.status(400).send({ success: false, message: error.details[0].message });
    }
    next();
}
