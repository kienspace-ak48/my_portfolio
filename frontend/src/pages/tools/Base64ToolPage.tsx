import Base64Tool from "../../components/tools/Base64Tool";
import ToolPageShell from "../../components/tools/ToolPageShell";

function Base64ToolPage() {
  return (
    <ToolPageShell
      title="Mã hóa / Giải mã Base64"
      description="Mã hóa và giải mã văn bản Base64 trực tiếp trên trình duyệt."
      breadcrumbLabel="Base64"
      clientSide
    >
      <Base64Tool />
    </ToolPageShell>
  );
}

export default Base64ToolPage;
