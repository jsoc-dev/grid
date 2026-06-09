import { Table, type TableProps } from "antd";

export function AntTable(props: TableProps) {
  return (
    <div style={{ backgroundColor: "canvas", overflow: "auto" }}>
      <Table {...props} />
    </div>
  );
}
