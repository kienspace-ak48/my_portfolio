import IpLookupTool from "../../components/tools/IpLookupTool";
import ToolPageShell from "../../components/tools/ToolPageShell";

function IpLookupToolPage() {
  return (
    <ToolPageShell
      title="IP của tôi là gì?"
      description="Kiểm tra địa chỉ IP công khai, nhà mạng và thông tin vị trí ước lượng của bạn."
      breadcrumbLabel="IP của tôi"
    >
      <IpLookupTool />
    </ToolPageShell>
  );
}

export default IpLookupToolPage;
