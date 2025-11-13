import joi from "joi";

export const UserValidation = joi
  .object({
    _id: joi.string(),
    username: joi.string(),
    thumbnail: joi.string(),
  })
  .options({ allowUnknown: true })
  .strict(false);
