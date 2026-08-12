import PasswordGeneratorTool from "../../components/tools/PasswordGeneratorTool";
import ToolPageShell from "../../components/tools/ToolPageShell";

function PasswordGeneratorToolPage() {
  return (
    <ToolPageShell
      title="Tạo mật khẩu"
      description="Tạo mật khẩu ngẫu nhiên an toàn với các tùy chọn tùy chỉnh."
      breadcrumbLabel="Tạo mật khẩu"
      clientSide
    >
      <PasswordGeneratorTool />
    </ToolPageShell>
  );
}

export default PasswordGeneratorToolPage;
