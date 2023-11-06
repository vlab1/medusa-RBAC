import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";
import { isObjectEmpty } from "../../utils/is-object-empty";

function validationMiddleware(schema: Joi.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    let data: any;

    if (!isObjectEmpty(req.body)) {
      data = req.body;
    } else if (!isObjectEmpty(req.query)) {
      data = req.query;
    } else if (!isObjectEmpty(req.params)) {
      data = req.params;
    } else {
      return next();
    }

    try {
      const value = await schema.validateAsync(data, validationOptions);

      if (!isObjectEmpty(req.body)) {
        req.body = value;
      } else if (!isObjectEmpty(req.query)) {
        req.query = value;
      } else if (!isObjectEmpty(req.params)) {
        req.params = value;
      }

      next();
    } catch (e: any) {
      const errors: string[] = e.details.map(
        (error: Joi.ValidationErrorItem) => error.message
      );
      res.status(400).send({ errors });
    }
  };
}

export default validationMiddleware;
