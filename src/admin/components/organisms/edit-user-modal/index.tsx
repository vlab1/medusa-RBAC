import { User } from "@medusajs/medusa";
import React, { useEffect, useState } from "react";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import Button from "../../fundamentals/button";
import InputField from "../../molecules/input";
import Modal from "../../molecules/modal";
import { NextSelect } from "../../molecules/select/next-select";
import { Controller, useForm } from "react-hook-form";
import { associateUserWithRole  } from "../../../services/role";

type EditUserModalProps = {
  handleClose: () => void;
  user: User;
  roles: any;
  onSuccess: () => void;
};

type EditUserModalFormData = {
  role_id: { value: string | null; label: string };
};

const EditUserModal: React.FC<EditUserModalProps> = ({
  handleClose,
  user,
  roles,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserModalFormData>();

  const notification = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    reset(mapUser(user, roles));
  }, [user]);

  const onSubmit = async (data: EditUserModalFormData) => {
    try {
      await associateUserWithRole({
        id: data.role_id.value,
        user_id: user.id,
      });

      notification("Success", `User was updated`, "success");
      onSuccess();
      setIsLoading(false);
    } catch (error) {
      notification("Error", getErrorMessage(error), "error");
    } finally {
      handleClose();
    }
  };

  const roleOptions: any[] = [
    { value: null, label: "No role" },
    ...roles.map((role) => ({
      value: role.id,
      label: role.name,
    })),
  ];

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Edit User</span>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-large mb-base grid w-full grid-cols-2">
              <InputField
                label="First Name"
                placeholder="First name..."
                disabled
                errors={errors}
              />
              <InputField
                label="Last Name"
                placeholder="Last name..."
                disabled
                errors={errors}
              />
            </div>
            <InputField
              label="Email"
              className="mb-base"
              disabled
              value={user.email}
            />
            <Controller
              name="role_id"
              control={control}
              defaultValue={{
                value: user.role_id || null,
                label: user.role_id
                  ? roles.find((role) => role.id === user.role_id)?.name
                  : "No role",
              }}
              render={({ field: { value, onChange, onBlur, ref } }) => {
                return (
                  <NextSelect
                    label="Role"
                    placeholder="Select role"
                    onBlur={onBlur}
                    ref={ref}
                    onChange={onChange}
                    options={roleOptions}
                    value={value}
                  />
                );
              }}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                size="small"
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  );
};

const mapUser = (user: User, roles: any): EditUserModalFormData => {
  return {
    role_id: {
      value: user.role_id || null,
      label: user.role_id
        ? roles.find((role) => role.id === user.role_id)?.name
        : "No role",
    },
  };
};

export default EditUserModal;
