import { useRef, useState, useEffect } from "react";
import SideModal from "../../../components/molecules/modal/side-modal";
import Button from "../../../components/fundamentals/button";
import CrossIcon from "../../../components/fundamentals/icons/cross-icon";
import InputField from "../../../components/molecules/input";
import SearchIcon from "../../../components/fundamentals/icons/search-icon";
import PermissionsTable from "../tables/permissions-table";
import { findPermissions } from "../../../services/permission";

const LIMIT = 12;

const containsIdenticalKeys = (
  a: Record<string, any>,
  b: Record<string, any>
) => {
  a = Object.keys(a);
  b = Object.keys(b);
  return a.length === b.length && a.every((value) => b.includes(value));
};

type AddPermissionsSideModalProps = {
  close: () => void;
  isVisible: boolean;
  selectedPermissions: Record<string, any>;
  setSelectedPermissions: (arg: any) => void;
};

function AddPermissionsSideModal(props: AddPermissionsSideModalProps) {
  const tableRef = useRef();
  const { isVisible, close, selectedPermissions, setSelectedPermissions } =
    props;

  const [_selectedPermissions, _setSelectedPermissions] = useState<
    Record<number, any>
  >({});
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

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

  const onSave = () => {
    setSelectedPermissions(_selectedPermissions);
    setOffset(0);
    setSearch("");
    close();
  };

  const onClose = () => {
    setOffset(0);
    setSearch("");

    _setSelectedPermissions(selectedPermissions);

    Object.values(selectedPermissions).map((channel) =>
      // @ts-ignore
      tableRef.current?.toggleRowSelected(channel.id, true)
    );

    close();
  };

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
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
        {/* === DIVIDER === */}

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
            selectedChannels={_selectedPermissions}
            setSelectedChannels={_setSelectedPermissions}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="block h-[1px] bg-gray-200"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            disabled={containsIdenticalKeys(
              _selectedPermissions,
              selectedPermissions
            )}
          >
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  );
}

export default AddPermissionsSideModal;
