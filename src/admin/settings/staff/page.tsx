import type { SettingConfig } from "@medusajs/admin";
import type { SettingProps } from "@medusajs/admin";
import { useEffect, useState } from "react";
import { medusa } from "../../constants/medusa-client";
import BodyCard from "../../components/organisms/body-card";
import UserTable from "../../components/templates/user-table";
import { allRoles } from "../../services/role";
import CustomersPageTableHeader from "./header";
import Spacer from "../../components/atoms/spacer";
import { Route, Routes } from "react-router-dom";

const StaffSettingIndex = () => {
  const [users, setUsers] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await allRoles();
        setRoles(fetchedData);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, [shouldRefetch]);

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1);
  };

  useEffect(() => {
    medusa.admin.users.list().then(({ users }) => {
      setUsers(users);
    });
  }, [shouldRefetch]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={<CustomersPageTableHeader activeView="staff" />}
          title="Staff"
          subtitle="Manage your employees' permissions in the Medusa store"
          actionables={[]}
        >
          <div className="flex grow flex-col justify-between">
            {!isLoading && (
              <UserTable
                roles={roles}
                users={users}
                triggerRefetch={triggerRefetch}
              />
            )}
            <p className="inter-small-regular text-grey-50">
              {users.length} member
              {users.length === 1 ? "" : "s"}
            </p>
          </div>
        </BodyCard>
      </div>
      <Spacer />
    </div>
  );
};

const StaffSettingPage = ({ notify }: SettingProps) => {
  return (
    <Routes>
      <Route index element={<StaffSettingIndex />} />
    </Routes>
  );
};

export const config: SettingConfig = {
  card: {
    label: "Staff",
    description: "Manage your staff settings",
  },
};

export default StaffSettingPage;
