import { useEffect, useState } from "react";
import { RouteConfig } from "@medusajs/admin";
import BodyCard from "../../components/organisms/body-card";
import PermissionTable from "../../components/templates/permission-table";
import { allPermissions } from "../../services/permission";
import PlusIcon from "../../components/fundamentals/icons/plus-icon";
import CreateModal from "../../components/organisms/create-modal";
import CustomersPageTableHeader from "../../settings/staff/header";

const PermissionPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await allPermissions();
        setPermissions(fetchedData);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, [shouldRefetch]);

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await allPermissions();
        setPermissions(fetchedData);
      } catch (error) {}
    };
    fetchData();
  }, [shouldRefetch]);

  const actionables = [
    {
      label: "Create Permission",
      onClick: () => setShowCreateModal(true),
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
          title="Permission"
          subtitle="Manage your permission"
          actionables={actionables}
          customHeader={<CustomersPageTableHeader activeView="permission" />}
        >
          <div className="flex grow flex-col justify-between">
            {!isLoading && (
              <PermissionTable
                permissions={permissions}
                triggerRefetch={triggerRefetch}
              />
            )}
            <p className="inter-small-regular text-grey-50">
              {permissions.length} permission
              {permissions.length === 1 ? "" : "s"}
            </p>
          </div>
          {showCreateModal && (
            <CreateModal
              onSuccess={triggerRefetch}
              handleClose={() => {
                triggerRefetch();
                setShowCreateModal(false);
              }}
            />
          )}
        </BodyCard>
      </div>
    </div>
  );
};

export default PermissionPage;
