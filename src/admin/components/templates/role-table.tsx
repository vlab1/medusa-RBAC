import React, { useEffect, useState } from "react";
import EditIcon from "../fundamentals/icons/edit-icon";
import Table from "../molecules/table";
import EditRole from "../organisms/edit-role-modal";
import TrashIcon from "../fundamentals/icons/trash-icon";
import { Role } from "../../types/user-type";
import DeletePrompt from "../organisms/delete-prompt";
import useNotification from "../../hooks/use-notification";
import { deleteRole as fDeleteRole } from "../../services/role";

type RoleListElement = {
  entity: any;
  entityType: string;
  tableElement: JSX.Element;
};

type RoleTableProps = {
  roles: any;
  triggerRefetch: () => void;
  showChannelsModal: (pubKey: any) => void;
};

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  triggerRefetch,
  showChannelsModal,
}) => {
  const [elements, setElements] = useState<RoleListElement[]>([]);
  const [shownElements, setShownElements] = useState<RoleListElement[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    setElements([
      ...roles.map((role, i) => ({
        entity: role,
        entityType: "role",
        tableElement: getRoleTableRow(role, i),
      })),
    ]);
  }, [roles]);

  useEffect(() => {
    setShownElements(elements);
  }, [elements]);

  const handleClose = () => {
    setSelectedRole(null);
    setDeleteRole(false);
  };

  const getRoleTableRow = (role: Role, index: number) => {
    return (
      <Table.Row
        key={`role-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Edit Role",
            onClick: () => setSelectedRole(role),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Edit Role Permissions",
            onClick: () => showChannelsModal(role),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Remove Role",
            variant: "danger",
            onClick: () => {
              setDeleteRole(true);
              setSelectedRole(role);
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          <div className="flex w-full items-center bg-inherit px-2.5 py-1.5">
            <span className="w-40 truncate pl-2.5">{role.id}</span>
          </div>
        </Table.Cell>
        <Table.Cell className="w-80">{role.store_id}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
          {role.name}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    );
  };

  const filteringOptions = [];

  const handleRoleSearch = (term: string) => {
    setShownElements(elements.filter((e) => e.entity?.name?.includes(term)));
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <Table
        filteringOptions={filteringOptions}
        handleSearch={handleRoleSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">Id</Table.HeadCell>
            <Table.HeadCell className="w-80">Store_id</Table.HeadCell>
            <Table.HeadCell className="w-72">Name</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>
      {selectedRole &&
        (deleteRole ? (
          <DeletePrompt
            text={"Are you sure you want to remove this user?"}
            heading={"Remove user"}
            onDelete={async () =>
              await fDeleteRole({ id: selectedRole.id }).then(() => {
                notification("Success", "Role has been removed", "success");
                triggerRefetch();
              })
            }
            handleClose={handleClose}
          />
        ) : (
          <EditRole
            handleClose={handleClose}
            role={selectedRole}
            onSuccess={() => triggerRefetch()}
          />
        ))}
    </div>
  );
};

export default RoleTable;
