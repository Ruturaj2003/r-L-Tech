import { PageHeader } from "@/components/PageHeader";

interface OtherMasterHeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  setModalOpen: () => void;
}

export const OtherMasterHeader = ({
  globalFilter,
  setGlobalFilter,
  setModalOpen,
}: OtherMasterHeaderProps) => {
  return (
    <PageHeader
      title="Other Master"
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      onActionClick={setModalOpen}
      actionLabel="Add +"
    />
  );
};
