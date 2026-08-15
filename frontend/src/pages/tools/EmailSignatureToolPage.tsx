import EmailSignatureTool from "../../components/tools/EmailSignatureTool";
import ToolPageShell from "../../components/tools/ToolPageShell";

function EmailSignatureToolPage() {
  return (
    <ToolPageShell
      title="Tạo chữ ký email"
      description="Tạo chữ ký email HTML chuyên nghiệp cho Gmail, Outlook, Apple Mail — xem trước trực tiếp và copy vào clipboard."
      breadcrumbLabel="Tạo chữ ký email"
      clientSide
    >
      <EmailSignatureTool />
    </ToolPageShell>
  );
}

export default EmailSignatureToolPage;
