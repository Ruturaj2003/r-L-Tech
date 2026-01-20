// features/otherMaster/components/OtherMasterTable.tsx
import { Eye, Pencil, Trash2 } from "lucide-react";

type OtherMasterRow = {
  code: string;
  name: string;
  category: string;
  department: string;
  owner: string;
  status: string;
  createdOn: string;
  remarks: string;
};

const TABLE_DATA: OtherMasterRow[] = [
  {
    code: "OM-001",
    name: "Vendor Classification",
    category: "Master Data",
    department: "Procurement",
    owner: "Rakesh Sharma",
    status: "Active",
    createdOn: "12 Jan 2024",
    remarks: "Used across purchase flows",
  },
  {
    code: "OM-002",
    name: "Payment Terms",
    category: "Finance",
    department: "Accounts",
    owner: "Neha Verma",
    status: "Active",
    createdOn: "05 Feb 2024",
    remarks: "Linked to vendor master",
  },
  {
    code: "OM-003",
    name: "Tax Category",
    category: "Compliance",
    department: "Finance",
    owner: "Amit Kulkarni",
    status: "Inactive",
    createdOn: "22 Dec 2023",
    remarks: "GST specific mapping",
  },
  {
    code: "OM-004",
    name: "Item Group",
    category: "Inventory",
    department: "Stores",
    owner: "Pooja Nair",
    status: "Active",
    createdOn: "18 Jan 2024",
    remarks: "Controls stock grouping",
  },
  {
    code: "OM-005",
    name: "Warehouse Type",
    category: "Logistics",
    department: "Operations",
    owner: "Sanjay Mehta",
    status: "Active",
    createdOn: "09 Mar 2024",
    remarks: "Used for location rules",
  },
  {
    code: "OM-006",
    name: "Approval Level",
    category: "Workflow",
    department: "Admin",
    owner: "Kiran Deshpande",
    status: "Active",
    createdOn: "27 Feb 2024",
    remarks: "Approval hierarchy",
  },
  {
    code: "OM-007",
    name: "Cost Center",
    category: "Finance",
    department: "Accounts",
    owner: "Rahul Iyer",
    status: "Inactive",
    createdOn: "11 Nov 2023",
    remarks: "Budget allocation",
  },
  {
    code: "OM-008",
    name: "UOM Conversion",
    category: "Inventory",
    department: "Stores",
    owner: "Sneha Patil",
    status: "Active",
    createdOn: "03 Jan 2024",
    remarks: "Unit conversion rules",
  },
  {
    code: "OM-009",
    name: "Freight Type",
    category: "Logistics",
    department: "Operations",
    owner: "Vikram Singh",
    status: "Active",
    createdOn: "14 Feb 2024",
    remarks: "Inbound / outbound",
  },
  {
    code: "OM-010",
    name: "Document Series",
    category: "System",
    department: "IT",
    owner: "Anjali Rao",
    status: "Active",
    createdOn: "01 Apr 2024",
    remarks: "Auto numbering setup",
  },
];

export const OtherMasterTable = () => {
  return (
    <div className="flex-1 overflow-hidden bg-card border border-border rounded-sm">
      {/* Horizontal scroll container */}
      <div className="h-full overflow-x-auto">
        {/* Vertical scroll container */}
        <div className="max-h-full overflow-y-auto">
          <table className="min-w-[1100px] w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-muted text-muted-foreground">
              <tr>
                <th className="border-b border-border px-3 py-2 text-left">
                  Code
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Name
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Category
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Department
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Owner
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Status
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Created On
                </th>
                <th className="border-b border-border px-3 py-2 text-left">
                  Remarks
                </th>
                <th className="border-b border-border px-3 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {TABLE_DATA.map((row) => (
                <tr
                  key={row.code}
                  className="hover:bg-accent transition-colors"
                >
                  <td className="border-b border-border px-3 py-2">
                    {row.code}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.name}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.category}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.department}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.owner}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.status}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.createdOn}
                  </td>
                  <td className="border-b border-border px-3 py-2">
                    {row.remarks}
                  </td>
                  <td className="border-b border-border px-2 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}
                      <button
                        type="button"
                        title="View"
                        className="h-7 w-7 rounded-md flex items-center justify-center
                  text-accent-foreground
                 hover:opacity-80
                 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        title="Edit"
                        className="h-7 w-7 rounded-md flex items-center justify-center
                 text-primary
                 hover:opacity-90
                 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        title="Delete"
                        className="h-7 w-7 rounded-md flex items-center justify-center
                text-destructive
                
                 hover:opacity-90
                 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
