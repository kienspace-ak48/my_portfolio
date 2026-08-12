import Breadcrumbs from "../../components/layout/Breadcrumbs";
import ToolCard from "../../components/tools/ToolCard";
import ToolsHero from "../../components/tools/ToolsHero";
import { TOOLS_CATALOG } from "../../data/toolsCatalog";

function ToolsIndex() {
  return (
    <div className="pb-8">
      <Breadcrumbs items={[{ label: "Công cụ miễn phí" }]} />

      <div className="mb-8">
        <ToolsHero
          total={TOOLS_CATALOG.length}
          clientSideCount={TOOLS_CATALOG.filter((t) => t.clientSide).length}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS_CATALOG.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default ToolsIndex;
