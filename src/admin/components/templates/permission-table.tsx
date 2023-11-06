import React, { useEffect, useState } from "react";
import EditIcon from "../fundamentals/icons/edit-icon";
import Table from "../molecules/table";
import EditPermission from "../organisms/edit-permission-modal";
import TrashIcon from "../fundamentals/icons/trash-icon";
import DeletePrompt from "../organisms/delete-prompt";
import { deletePermissionAndRolePermissions } from "../../services/permission";
import useNotification from "../../hooks/use-notification";

type PermissionListElement = {
  entity: any;
  entityType: string;
  tableElement: JSX.Element;
};

type PermissionTableProps = {
  permissions: any[];
  triggerRefetch: () => void;
};

const PermissionTable: React.FC<PermissionTableProps> = ({
  permissions,
  triggerRefetch,
}) => {
  const [elements, setElements] = useState<PermissionListElement[]>([]);
  const [shownElements, setShownElements] = useState<PermissionListElement[]>(
    []
  );
  const [deletePermission, setDeletePermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any | null>(
    null
  );
  const notification = useNotification();
  useEffect(() => {
    setElements([
      ...permissions.map((permission, i) => ({
        entity: permission,
        entityType: "permission",
        tableElement: getPermissionTableRow(permission, i),
      })),
    ]);
  }, [permissions]);

  useEffect(() => {
    setShownElements(elements);
  }, [elements]);

  const handleClose = () => {
    setSelectedPermission(null);
  };

  const getPermissionTableRow = (permission: any, index: number) => {
    const metadataKeys = Object.keys(permission.metadata);
    const metadataString = metadataKeys.join(", ");
    return (
      <Table.Row
        key={`permission-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Edit Permission",
            onClick: () => setSelectedPermission(permission),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Remove Permission",
            variant: "danger",
            onClick: () => {
              setDeletePermission(true);
              setSelectedPermission(permission);
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell className="w-80">{permission.id}</Table.Cell>
        <Table.Cell className="w-80">{permission.name}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
          {`${metadataString}`}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    );
  };

  const handlePermissionSearch = (term: string) => {
    setShownElements(elements.filter((e) => e.entity?.name?.includes(term)));
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <Table
        filteringOptions={[]}
        enableSearch
        handleSearch={handlePermissionSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">Id</Table.HeadCell>
            <Table.HeadCell className="w-80">Name</Table.HeadCell>
            <Table.HeadCell className="w-72">Endpoint</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>

      {selectedPermission &&
        (deletePermission ? (
          <DeletePrompt
            text={"Are you sure you want to remove this permission?"}
            heading={"Remove permission"}
            onDelete={async () => {
              await deletePermissionAndRolePermissions({
                id: selectedPermission.id,
              }).then(() => {
                notification(
                  "Success",
                  "Permission has been removed",
                  "success"
                );
                triggerRefetch();
              });
            }}
            handleClose={handleClose}
          />
        ) : (
          <EditPermission
            handleClose={handleClose}
            permission={selectedPermission}
            onSuccess={() => triggerRefetch()}
          />
        ))}
    </div>
  );
};

export default PermissionTable;
