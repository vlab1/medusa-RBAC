import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import Button from "../../fundamentals/button";
import InputField from "../../molecules/input";
import Modal from "../../molecules/modal";
import { createPermission } from "../../../services/permission";

type CreateModalProps = {
  handleClose: () => void;
  onSuccess: () => void;
};

type CreateModalFormData = {
  name: string;
  endpoint: string;
};

const Create: React.FC<CreateModalProps> = ({ handleClose, onSuccess }) => {
  const notification = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<CreateModalFormData>();

  const onSubmit = async (data: CreateModalFormData) => {
    try {
      await createPermission({
        name: data.name,
        metadata: { [data.endpoint]: true },
      });
      notification("Success", `Permission was created`, "success");
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
            <span className="inter-xlarge-semibold">Create Permission</span>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-y-base flex flex-col">
              <InputField
                label="Name"
                placeholder="Allow products"
                required
                {...register("name", { required: true })}
              />
              <InputField
                label="Endpoint"
                placeholder="/products"
                required
                {...register("endpoint", { required: true })}
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="text-small mr-2 w-32 justify-center"
                size="large"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
              >
                Create
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default Create;
