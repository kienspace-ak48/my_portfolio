import IpLookupTool from "../../components/tools/IpLookupTool";
import ToolPageShell from "../../components/tools/ToolPageShell";

function IpLookupToolPage() {
  return (
    <ToolPageShell
      title="IP của tôi là gì?"
      description="Kiểm tra IP công khai, nhà mạng, vị trí ước lượng và xem trên bản đồ."
      breadcrumbLabel="IP của tôi"
    >
      <IpLookupTool />
    </ToolPageShell>
  );
}

export default IpLookupToolPage;
