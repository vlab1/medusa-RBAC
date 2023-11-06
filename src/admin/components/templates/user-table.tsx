import { User } from "@medusajs/medusa";
import React, { useEffect, useState } from "react";
import EditIcon from "../fundamentals/icons/edit-icon";
import SidebarTeamMember from "../molecules/sidebar-team-member";
import Table from "../molecules/table";
import EditUser from "../organisms/edit-user-modal";

type UserListElement = {
  entity: any;
  entityType: string;
  tableElement: JSX.Element;
};

type UserTableProps = {
  users: any[];
  roles: any;
  triggerRefetch: () => void;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  triggerRefetch,
}) => {
  const [elements, setElements] = useState<UserListElement[]>([]);
  const [shownElements, setShownElements] = useState<UserListElement[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setElements([
      ...users.map((user, i) => ({
        entity: user,
        entityType: "user",
        tableElement: getUserTableRow(user, i),
      })),
    ]);
  }, [users]);

  useEffect(() => {
    setShownElements(elements);
  }, [elements]);

  const handleClose = () => {
    setSelectedUser(null);
  };

  const getUserTableRow = (user: User, index: number) => {
    const userRole = roles.find((role) => role.id === user.role_id);
    const roleName = userRole ? userRole.name : "No Role";

    return (
      <Table.Row
        key={`user-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Edit User",
            onClick: () => setSelectedUser(user),
            icon: <EditIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          <SidebarTeamMember user={user} />
        </Table.Cell>
        <Table.Cell className="w-80">{user.email}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
          {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    );
  };

  const filteringOptions = [
    {
      title: "Roles",
      options: [
        {
          title: "All",
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: "No role",
          count: elements.filter(
            (e) => e.entityType === "user" && e.entity.role_id === null
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) => e.entityType === "user" && e.entity.role_id === null
              )
            ),
        },
        ...roles.map((role) => ({
          title: role.name,
          count: elements.filter(
            (e) => e.entityType === "user" && e.entity.role_id === role.id
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) => e.entityType === "user" && e.entity.role_id === role.id
              )
            ),
        })),
      ],
    },
  ];

  const handleUserSearch = (term: string) => {
    setShownElements(
      elements.filter(
        (e) =>
          e.entity?.first_name?.includes(term) ||
          e.entity?.last_name?.includes(term) ||
          e.entity?.email?.includes(term) ||
          e.entity?.user_email?.includes(term)
      )
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        handleSearch={handleUserSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">Name</Table.HeadCell>
            <Table.HeadCell className="w-80">Email</Table.HeadCell>
            <Table.HeadCell className="w-72">Role</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>
      {selectedUser && (
        <EditUser
          handleClose={handleClose}
          user={selectedUser}
          roles={roles}
          onSuccess={() => triggerRefetch()}
        />
      )}
    </div>
  );
};

export default UserTable;
