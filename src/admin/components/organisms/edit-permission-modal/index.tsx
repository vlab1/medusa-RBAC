import React, { useState } from "react";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import Button from "../../fundamentals/button";
import InputField from "../../molecules/input";
import Modal from "../../molecules/modal";
import { useForm } from "react-hook-form";
import FormValidator from "../../../utils/form-validator";
import { updatePermission } from "../../../services/permission";

type EditPermissionModalProps = {
  handleClose: () => void;
  permission: any;
  onSuccess: () => void;
};

const EditUserModal: React.FC<EditPermissionModalProps> = ({
  handleClose,
  permission,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const [form, setForm] = useState({
    name: permission.name,
    endpoint: Object.keys(permission.metadata).join(", "),
  });

  const notification = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await updatePermission({
        id: permission.id,
        name: data.name,
        metadata: { [data.endpoint]: true },
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
                label="Name"
                placeholder="Name..."
                className="mb-base"
                {...register("name", {
                  required: FormValidator.required("Name"),
                  pattern: FormValidator.whiteSpaceRule("Name"),
                  minLength: FormValidator.minOneCharRule("Name"),
                })}
                defaultValue={form.name}
                errors={errors}
              />
              <InputField
                label="Endpoint"
                placeholder="/products..."
                className="mb-base"
                {...register("endpoint", {
                  required: FormValidator.required("Endpoint"),
                  pattern: FormValidator.whiteSpaceRule("Endpoint"),
                  minLength: FormValidator.minOneCharRule("Endpoint"),
                })}
                defaultValue={form.endpoint}
                errors={errors}
              />
            </div>
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

export default EditUserModal;
