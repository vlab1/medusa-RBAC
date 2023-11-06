import { MEDUSA_BACKEND_URL } from "../../constants/medusa-backend-url";

const associateUserWithRole = async ({ id, user_id }) => {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/roles/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, user_id }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to associate user with role");
    }
    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const renameRole = async ({ id, name }) => {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/roles/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to rename user  role");
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const findByRoleAndSearch = async ({ search, role_id }) => {
  try {
    const queryParams = new URLSearchParams({
      search: search ? search.toString() : "",
      role_id: role_id ? role_id.toString() : "",
    });
    const url = `${MEDUSA_BACKEND_URL}/admin/roles/search?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`);
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const deleteRole = async ({ id }) => {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/roles`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user  role");
    }
  } catch (error) {
    throw error;
  }
};

const deleteRolePermissions = async ({ role_id, permissions_ids }) => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/roles/permissions`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id, permissions_ids }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user  role");
    }
  } catch (error) {
    throw error;
  }
};

const createOneRole = async ({ name, store_id }) => {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/roles/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, store_id }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to rename user  role");
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const associateRole = async ({ role_id, permissions_ids }) => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/roles/associate-permissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id, permissions_ids }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to associate");
    }
    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const allRoles = async () => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/roles/unique-roles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to find roles");
    }
    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const addRolePermissions = async ({ role_id, permissions_ids }) => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/roles/add-permissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id, permissions_ids }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user  role");
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export {
  associateUserWithRole,
  renameRole,
  findByRoleAndSearch,
  deleteRole,
  deleteRolePermissions,
  createOneRole,
  associateRole,
  allRoles,
  addRolePermissions,
};
