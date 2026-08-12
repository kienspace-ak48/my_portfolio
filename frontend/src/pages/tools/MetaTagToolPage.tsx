import MetaTagTool from "../../components/tools/MetaTagTool";
import ToolPageShell from "../../components/tools/ToolPageShell";

function MetaTagToolPage() {
  return (
    <ToolPageShell
      title="Meta Tag Generator"
      description="Crawl meta từ URL hoặc tạo thẻ SEO, Open Graph và X Card — preview đúng tỷ lệ từng nền tảng."
      breadcrumbLabel="Meta Tag"
      clientSide
    >
      <MetaTagTool />
    </ToolPageShell>
  );
}

export default MetaTagToolPage;
