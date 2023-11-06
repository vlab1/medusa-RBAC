import { Role } from "../../../types/user-type";
import React, { useEffect, useState } from "react";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import Button from "../../fundamentals/button";
import InputField from "../../molecules/input";
import Modal from "../../molecules/modal";
import { useForm } from "react-hook-form";
import { renameRole  } from "../../../services/role";
import FormValidator from "../../../utils/form-validator";

type EditUserModalProps = {
  handleClose: () => void;
  role: Role;
  onSuccess: () => void;
};

type EditRoleModalFormData = {
  name?: string;
};

const EditRoleModal: React.FC<EditUserModalProps> = ({
  handleClose,
  role,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditRoleModalFormData>();

  const notification = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    reset(mapRole(role));
  }, [role]);

  const onSubmit = async (data: EditRoleModalFormData) => {
    try {
      await renameRole({
        id: role.id,
        name: data.name,
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
            <span className="inter-xlarge-semibold">Edit Role</span>
          </Modal.Header>
          <Modal.Content>
     
            <InputField
              label="Role id"
              className="mb-base"
              disabled
              value={role.id}
            />
            <InputField
              label="Name"
              placeholder="Name..."
              className="mb-base"
              {...register("name", {
                required: FormValidator.required("Name"),
                pattern: FormValidator.whiteSpaceRule("Name"),
                minLength: FormValidator.minOneCharRule("Name"),
              })}
              defaultValue={role.name}
              errors={errors}
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

const mapRole = (role: Role): EditRoleModalFormData => {
  return { name: role.name };
};

export default EditRoleModal;
