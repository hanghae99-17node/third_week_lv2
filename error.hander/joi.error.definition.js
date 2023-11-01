import joi from "joi";

const createComments = joi.object({
  content: joi.string().required(),
  author: joi.string(),
  password: joi.number(),
});

const createReviews = joi.object({
  bookTitle: joi.string(),
  title: joi.string(),
  content: joi.string().required(),
  starRating: joi.number().min(1).max(10).required(),
  author: joi.string().required(),
  password: joi.number().required(),
});

export { createComments, createReviews };
