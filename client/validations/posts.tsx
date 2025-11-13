import joi from "joi";

export const ValidatePost = joi
  .object({
    _id: joi.string().required(),
    author: joi.string().required(),
    content: joi.string().allow(null, "").optional(),
    image: joi.string().allow(null, "").optional(),
    views: joi.number().optional(),
    createdAt: joi.string().optional(),
    updatedAt: joi.string().optional(),
  })
  .strict(false)
  .options({
    allowUnknown: true,
  });

export const ValidatePosts = joi.array().items(ValidatePost); // Posts - plural, array.
