import { RouteConfig } from "@medusajs/admin";
import { useEffect, useState } from "react";
import BodyCard from "../../components/organisms/body-card";
import RoleTable from "../../components/templates/role-table";
import { allRoles } from "../../services/role";
import {allPermissionsAsOptions} from "../../services/permission";
import PlusIcon from "../../components/fundamentals/icons/plus-icon";
import AddPermissionsSideModal from "./modals/add-permissions-channels";
import useToggleState from "../../hooks/use-toggle-state";
import Button from "../../components/fundamentals/button"; 
import ChannelsIcon from "../../components/fundamentals/icons/channels-icon";
import PermissionsSummary from "../../components/molecules/permissions-summary";
import useNotification from "../../hooks/use-notification";
import FocusModal from "../../components/molecules/modal/focus-modal";
import CrossIcon from "../../components/fundamentals/icons/cross-icon";
import InputField from "../../components/molecules/input";
import Fade from "../../components/atoms/fade-wrapper";
import { createOneRole } from "../../services/role";
import { medusa } from "../../constants/medusa-client";
import { associateRole } from "../../services/role";
import ManagePermissionsSideModal from "./modals/manage-permissions";
import CustomersPageTableHeader from "../../settings/staff/header";

type AddRolesSectionProps = {
  setSelectedPermissions: (arg: any) => void;
  selectedPermissions: Record<string, any>;
};

function AddSalesChannelsSection(props: AddRolesSectionProps) {
  const { setSelectedPermissions, selectedPermissions } = props;
  const [isModalVisible, showModal, hideModal] = useToggleState(false);

  const hasSelectedPermissions = !!Object.keys(selectedPermissions).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h5 className="inter-base-semibold text-grey-90 pb-1">Permissions</h5>
          <p className="text-grey-50">Create and manage permissions</p>
        </div>
        {!hasSelectedPermissions && (
          <Button
            size="small"
            variant="secondary"
            className="h-[40px]"
            onClick={showModal}
          >
            Add permissions
          </Button>
        )}
      </div>
      {hasSelectedPermissions && (
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded border p-1">
              <div className="rounded bg-gray-100 p-2">
                <ChannelsIcon />
              </div>
            </div>
            <PermissionsSummary
              channels={Object.values(selectedPermissions)}
              showCount={2}
            />
          </div>
          <Button
            size="small"
            variant="secondary"
            className="h-[40px]"
            onClick={showModal}
          >
            Edit roles
          </Button>
        </div>
      )}

      <AddPermissionsSideModal
        close={hideModal}
        isVisible={isModalVisible}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
    </div>
  );
}

type CreateroleProps = {
  closeModal: () => void;
  triggerRefetch: () => void;
};

function CreateRole(props: CreateroleProps) {
  const { closeModal, triggerRefetch } = props;
  const notification = useNotification();

  const [name, setName] = useState("");
  const [keyId, setKeyId] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});

  const onSubmit = async () => {
    try {
      const { store } = await medusa.admin.store.retrieve();
      const res = await createOneRole({ name, store_id: store.id });
      setKeyId(res.id);
      notification("Success", "Created a new Role", "success");
      triggerRefetch();
    } catch (e) {
      notification("Error", "Failed to create a new Role", "error");
    }
  };

  useEffect(() => {
    const associateRoles = async () => {
      if (keyId) {
        try {
          await associateRole({
            role_id: keyId,
            permissions_ids: Object.keys(selectedPermissions).map((id) => ({
              id,
            })),
          });
          notification("Success", "Permissions added", "success");
        } catch (error) {
          notification(
            "Error",
            "An error occurred while adding permissions",
            "error"
          );
        } finally {
          closeModal();
        }
      }
    };

    associateRoles();
  }, [keyId, selectedPermissions]);

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 flex w-full justify-between px-8">
          <Button size="small" variant="ghost" onClick={closeModal}>
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              onClick={onSubmit}
              disabled={!name}
              className="rounded-rounded"
            >
              Publish Role
            </Button>
          </div>
        </div>
      </FocusModal.Header>

      <FocusModal.Main className="no-scrollbar flex w-full justify-center">
        <div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-8">
            Create Role
          </h1>
          <h5 className="inter-base-semibold text-grey-90 pb-1">
            General Information
          </h5>
          <p className="text-grey-50 pb-8">Create and manage role</p>
          <InputField
            label="Name"
            type="string"
            name="name"
            value={name}
            className="w-[338px]"
            placeholder="Name your role"
            onChange={(ev) => setName(ev.target.value)}
          />

          <div className="mt-16 mb-8 h-[1px] w-[100%] bg-gray-200" />

          <AddSalesChannelsSection
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
          />
        </div>
      </FocusModal.Main>
    </FocusModal>
  );
}

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [setSelectedChannels, selectedChannels] = useState([]);
  const [editKey, setEditKey] = useState<any>();

  const _openChannelsModal = (role: any) => {
    setEditKey(role);
  };

  const _closeChannelsModal = () => {
    setEditKey(null);
  };

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1);
  };

  const [isCreateModalVisible, openCreateModal, closeCreateModal] =
    useToggleState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = await allRoles();
        const permissions = await allPermissionsAsOptions();
        setPermissions(permissions);
        setRoles(roles);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, [shouldRefetch]);

  const actionables = [
    {
      label: "Create Role",
      // onClick: () => setShowCreateModal(true),
      onClick: openCreateModal,
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          title="Roles"
          subtitle="Manage your roles in the Medusa store"
          actionables={actionables}
          customHeader={<CustomersPageTableHeader activeView="role" />}
        >
          <div className="flex grow flex-col justify-between">
            {!isLoading && (
              <RoleTable
                roles={roles}
                triggerRefetch={triggerRefetch}
                showChannelsModal={_openChannelsModal}
              />
            )}
            <p className="inter-small-regular text-grey-50">
              {roles.length} role
              {roles.length === 1 ? "" : "s"}
            </p>
          </div>
          <Fade isVisible={isCreateModalVisible} isFullScreen>
            <CreateRole
              closeModal={closeCreateModal}
              triggerRefetch={triggerRefetch}
            />
          </Fade>
          <ManagePermissionsSideModal
            keyId={editKey?.id}
            close={_closeChannelsModal}
          />
        </BodyCard>
      </div>
    </div>
  );
};


export default RolePage;
