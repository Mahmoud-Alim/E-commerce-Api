import { sendError } from "../utils/apiResponse.js";

/**
 * Higher-order function that returns a middleware for validating requests with Zod.
 * Validates req.body, req.query, or req.params.
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 * @param {'body' | 'query' | 'params'} property - The property on req to validate.
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const flattened = result.error.flatten();
      const errorMessages = Object.entries(flattened.fieldErrors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('; ');
      return sendError(res, 400, "Validation failed", errorMessages || "Invalid input");
    }

    // Replace req properties with parsed & sanitized data from Zod
    req[property] = result.data;
    next();
  };
};

export default validateRequest;
