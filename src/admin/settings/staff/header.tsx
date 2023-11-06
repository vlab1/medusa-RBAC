import { useNavigate } from "react-router-dom";
import TableViewHeader from "../../components/organisms/custom-table-header";

type P = {
  activeView: "staff" | "role" | "permission";
};

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate();
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "staff") {
          navigate(`/a/settings/staff`);
        } else if (v === "role") {
          navigate(`/a/role`);
        } else {
          navigate(`/a/permission`);
        }
      }}
      views={["staff", "role", "permission"]}
      activeView={props.activeView}
    />
  );
}

export default CustomersPageTableHeader;
