import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { findByRoleAndSearch } from "../../../services/role";
import Button from "../../../components/fundamentals/button";
import SideModal from "../../../components/molecules/modal/side-modal";
import CrossIcon from "../../../components/fundamentals/icons/cross-icon";
import useNotification from "../../../hooks/use-notification";
import InputField from "../../../components/molecules/input";
import SearchIcon from "../../../components/fundamentals/icons/search-icon";
import PermissionsTable from "../tables/permissions-table";
import UTurnIcon from "../../../components/fundamentals/icons/u-turn-icon";
import {findPermissions} from "../../../services/permission";
import { deleteRolePermissions } from "../../../services/role";
import { addRolePermissions } from "../../../services/role";

const LIMIT = 12;

function AddScreen(props: {
  keyId: string;
  close: () => void;
  goBack: () => void;
  isVisible: boolean;
}) {
  const tableRef = useRef();

  const [selectedPermissions, setSelectedPermissions] = useState({});
  const notification = useNotification();

  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const permissions = await findPermissions({
          search,
          limit: LIMIT,
          offset, 
        });
        setData(permissions.data);
        setCount(permissions.count);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, [search, LIMIT, offset]);

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0);
      setSearch("");
      setSelectedPermissions({});
      // @ts-ignore
      tableRef.current?.toggleAllRowsSelected(false);
    }
  }, [props.isVisible]);

  const onSave = (callback: () => void) => async () => {
    await addRolePermissions({
      permissions_ids: Object.keys(selectedPermissions).map((id) => ({
        id,
      })),
      role_id: props.keyId,
    })
      .then(() => {
        notification("Success", "Permissions added", "success");
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while adding permissions",
          "success"
        );
      })
      .finally(callback);
  };

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
          <Button
            variant="secondary"
            className="text-grey-50 h-8 w-8 p-2"
            onClick={props.goBack}
          >
            <UTurnIcon size={18} />
          </Button>
          Add permissions
        </h3>
        <Button
          variant="secondary"
          className="h-8 w-8 p-2"
          onClick={props.close}
        >
          <CrossIcon size={20} className="text-grey-50" />
        </Button>
      </div>
      <div className="flex-grow">
        <div className="my-6">
          <InputField
            small
            name="name"
            type="string"
            value={search}
            className="h-[32px]"
            placeholder="Find permissions"
            prefix={<SearchIcon size={16} />}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>

        <PermissionsTable
          ref={tableRef}
          query={search}
          data={data}
          offset={offset}
          count={count || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedPermissions}
          setSelectedChannels={setSelectedPermissions}
        />
      </div>
      <div
        className="block h-[1px] bg-gray-200"
        style={{ margin: "24px -24px" }}
      />
      <div className="flex justify-end gap-2">
        <Button size="small" variant="ghost" onClick={props.close}>
          Cancel
        </Button>

        <Button
          size="small"
          variant="primary"
          onClick={onSave(props.close)}
          disabled={!Object.keys(selectedPermissions).length}
        >
          Add and close
        </Button>
      </div>
    </div>
  );
}

function EditScreen(props: {
  keyId: string;
  close: () => void;
  goAdd: () => void;
  isVisible: boolean;
}) {
  const { close } = props;

  const tableRef = useRef();
  const [selectedPermissions, setSelectedPermissions] = useState({});

  const selectedCount = Object.keys(selectedPermissions).length;

  const notification = useNotification();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [shouldRefetch, setShouldRefetch] = useState(0);

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const permissions = await findByRoleAndSearch({
          search,
          role_id: props.keyId,
        });
        setData(permissions.data);
        setCount(permissions.count);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, [search, props.keyId, shouldRefetch]);

  const onDeselect = () => {
    setSelectedPermissions({});
    // @ts-ignore
    tableRef.current?.toggleAllRowsSelected(false);
  };

  const onRemove = async () => {
    await deleteRolePermissions({
      permissions_ids: Object.keys(selectedPermissions).map((id) => ({
        id,
      })),
      role_id: props.keyId,
    })
      .then(() => {
        notification(
          "Success",
          "Permissions removed from the scope",
          "success"
        );
        setSelectedPermissions({});
        // @ts-ignore
        tableRef.current?.toggleAllRowsSelected(false);
        triggerRefetch();
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while removing permissions",
          "success"
        );
      });
  };

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0);
      setSearch("");
      setSelectedPermissions({});
      // @ts-ignore
      tableRef.current?.toggleAllRowsSelected(false);
    }
  }, [props.isVisible]);

  const displayData = useMemo(
    () => data?.slice(offset, offset + LIMIT),
    [data, offset]
  );

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
          Edit permissions
        </h3>
        <Button
          variant="secondary"
          className="h-8 w-8 p-2"
          onClick={props.close}
        >
          <CrossIcon size={20} className="text-grey-50" />
        </Button>
      </div>

      <div className="flex-grow">
        <div className="my-6 flex items-center justify-between gap-2">
          <InputField
            small
            name="name"
            type="string"
            value={search}
            className="h-[32px]"
            placeholder="Find permissions"
            prefix={<SearchIcon size={14} />}
            onChange={(ev) => setSearch(ev.target.value)}
          />

          {selectedCount ? (
            <div className="flex h-[32px] items-center justify-between gap-2">
              <span className="text-small text-grey-50 whitespace-nowrap px-2">
                {selectedCount} selected
              </span>
              <Button
                size="small"
                className="h-[32px] flex-shrink-0"
                variant="secondary"
                onClick={onDeselect}
              >
                Deselect
              </Button>
              <Button
                size="small"
                className="h-[32px] flex-shrink-0 text-rose-500"
                variant="secondary"
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button
              size="small"
              className="h-[32px] flex-shrink-0"
              variant="secondary"
              onClick={props.goAdd}
            >
              Add permissions
            </Button>
          )}
        </div>

        <PermissionsTable
          ref={tableRef}
          query={search}
          data={displayData}
          offset={offset}
          count={data.length || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedPermissions}
          setSelectedChannels={setSelectedPermissions}
        />
      </div>

      <div
        className="block h-[1px] bg-gray-200"
        style={{ margin: "24px -24px" }}
      />

      <div className="flex justify-end gap-2">
        <Button size="small" variant="secondary" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}

type ManagePermissionsSideModalProps = {
  keyId?: string;
  close: () => void;
};

function ManagePermissionsSideModal(props: ManagePermissionsSideModalProps) {
  const { keyId, close } = props;

  const isVisible = !!keyId;

  const [isAddNew, setIsAddNew] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsAddNew(false);
    }
  }, [isVisible]);

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <motion.div
        style={{ width: 560 * 2, display: "flex", height: "100%" }}
        animate={{ x: isAddNew ? -560 : 0 }}
        transition={{ ease: "easeInOut" }}
      >
        <motion.div
          style={{ height: "100%", width: 560 }}
          animate={{ opacity: isAddNew ? 0 : 1 }}
        >
          <EditScreen
            close={close}
            keyId={keyId!}
            isVisible={isVisible && !isAddNew}
            goAdd={() => setIsAddNew(true)}
          />
        </motion.div>
        <motion.div
          style={{ height: "100%", width: 560 }}
          animate={{ opacity: !isAddNew ? 0 : 1 }}
        >
          <AddScreen
            close={close}
            keyId={keyId!}
            isVisible={isVisible && isAddNew}
            goBack={() => setIsAddNew(false)}
          />
        </motion.div>
      </motion.div>
    </SideModal>
  );
}

export default ManagePermissionsSideModal;
