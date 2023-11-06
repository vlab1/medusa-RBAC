import { MEDUSA_BACKEND_URL } from "../../constants/medusa-backend-url";

const findPermissions = async ({ search, limit, offset }) => {
  try {
    const queryParams = new URLSearchParams({
      search: search,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    const url = `${MEDUSA_BACKEND_URL}/admin/permissions/find?${queryParams.toString()}`;

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

const allPermissions = async () => {
  try {
    const url = `${MEDUSA_BACKEND_URL}/admin/permissions`;

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

const allPermissionsAsOptions = async () => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/permissions/options`,
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

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const deletePermissionAndRolePermissions = async ({ id }) => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/permissions/remove`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to find roles");
    }
  } catch (error) {
    throw error;
  }
};

const createPermission = async ({ name, metadata }) => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/permissions/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, metadata }),
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

const updatePermission = async ({ id, name, metadata }) => {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/permissions/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, metadata }),
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

export {
  findPermissions,
  allPermissionsAsOptions,
  allPermissions,
  deletePermissionAndRolePermissions,
  createPermission,
  updatePermission,
};
