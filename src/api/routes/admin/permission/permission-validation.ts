import Joi from "joi";

const findFilter = Joi.object({
  search: Joi.string().allow("", null),
  limit: Joi.number(),
  offset: Joi.number(),
});

const deletePermissionAndRolePermissions = Joi.object({
  id: Joi.string().required(),
});

const create = Joi.object({
  metadata: Joi.object().pattern(Joi.string(), Joi.boolean()).required(),
  name: Joi.string().required(),
});

const update = Joi.object({
  id: Joi.string().required(),
  metadata: Joi.object().pattern(Joi.string(), Joi.boolean()).required(),
  name: Joi.string().required(),
});

export default {
  findFilter,
  deletePermissionAndRolePermissions,
  create,
  update,
};
