import Joi from "joi";

const rename = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
});

const find = Joi.object({
  search: Joi.string().allow("", null),
  role_id: Joi.string().required(),
});

const remove = Joi.object({
  id: Joi.string().required(),
});

const removePermissions = Joi.object({
  role_id: Joi.string().required(),
  permissions_ids: Joi.array()
    .items({
      id: Joi.string().required(),
    })
    .required(),
});

const create = Joi.object({
  name: Joi.string().required(),
  store_id: Joi.string().required(),
});

const associateRoleWithUser = Joi.object({
  id: Joi.string().allow("", null).required(),
  user_id: Joi.string().required(),
});

const associateRoleWithPermission = Joi.object({
  role_id: Joi.string().required(),
  permissions_ids: Joi.array()
    .items({
      id: Joi.string().required(),
    })
    .required(),
});

const addRolePermissions = Joi.object({
  role_id: Joi.string().required(),
  permissions_ids: Joi.array()
    .items({
      id: Joi.string().required(),
    })
    .required(),
});

export default {
  rename,
  find,
  remove,
  removePermissions,
  create,
  associateRoleWithUser,
  associateRoleWithPermission,
  addRolePermissions
};
