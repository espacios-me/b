import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  datosEntities,
  datosRelationships,
  getEntityById,
  getRelatedRelationships,
  type DatosEntity,
  type EntityType,
} from "@/lib/datos";
import { Network, LayoutGrid, Table2, Filter } from "lucide-react";

type ViewMode = "board" | "table" | "graph";

const entityTypeOrder: EntityType[] = [
  "person",
  "company",
  "broker",
  "developer",
  "project",
  "property",
  "community",
  "campaign",
  "engagement",
  "source",
  "document",
  "household",
  "opportunity",
];

function EntityCard({ entity, onSelect }: { entity: DatosEntity; onSelect: (entity: DatosEntity) => void }) {
  return (
    <Card
      className="mb-4 break-inside-avoid rounded-3xl border-white/25 bg-white/10 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300"
      onClick={() => onSelect(entity)}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base text-white">{entity.title}</CardTitle>
            <p className="text-xs text-white/65 mt-1">{entity.subtitle}</p>
          </div>
          <Badge variant="secondary" className="capitalize bg-blue-500/20 text-blue-100 border border-blue-200/20">
            {entity.type}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {entity.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-white/25 text-[11px] text-white/80 bg-transparent">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
          <div className="rounded-xl bg-white/10 px-2 py-1.5">
            Confidence: <span className="font-semibold">{Math.round(entity.confidence * 100)}%</span>
          </div>
          <div className="rounded-xl bg-white/10 px-2 py-1.5">
            Sources: <span className="font-semibold">{entity.sourceCount}</span>
          </div>
        </div>
        {entity.timeline ? <p className="text-xs text-sky-100/90">Timeline: {entity.timeline}</p> : null}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<ViewMode>("board");
  const [activeType, setActiveType] = useState<EntityType | "all">("all");
  const [selected, setSelected] = useState<DatosEntity | null>(datosEntities[0] ?? null);

  const filtered = useMemo(() => {
    if (activeType === "all") return datosEntities;
    return datosEntities.filter((entity) => entity.type === activeType);
  }, [activeType]);

  const selectedRelationships = useMemo(() => {
    if (!selected) return [];
    return getRelatedRelationships(selected.id);
  }, [selected]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(91,140,255,0.25),_transparent_48%),linear-gradient(180deg,#050b1a_0%,#0a1022_100%)] text-white">
      <div className="mx-auto flex max-w-[1450px] gap-5 px-4 py-6 lg:px-8">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 flex-col rounded-[28px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl lg:flex">
          <h1 className="text-xl font-semibold tracking-tight">DATOS</h1>
          <p className="mt-1 text-xs text-white/70">AI-native relationship intelligence</p>
          <div className="mt-6 space-y-2">
            <Button variant={view === "board" ? "default" : "ghost"} className="w-full justify-start rounded-xl" onClick={() => setView("board")}>
              <LayoutGrid className="mr-2 size-4" /> Board
            </Button>
            <Button variant={view === "table" ? "default" : "ghost"} className="w-full justify-start rounded-xl" onClick={() => setView("table")}>
              <Table2 className="mr-2 size-4" /> Table
            </Button>
            <Button variant={view === "graph" ? "default" : "ghost"} className="w-full justify-start rounded-xl" onClick={() => setView("graph")}>
              <Network className="mr-2 size-4" /> Graph
            </Button>
          </div>

          <div className="mt-6">
            <p className="mb-2 flex items-center gap-2 text-xs uppercase text-white/60"><Filter className="size-3.5" /> Entity filters</p>
            <div className="space-y-1">
              <Button size="sm" variant={activeType === "all" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveType("all")}>All entities</Button>
              {entityTypeOrder.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={activeType === type ? "secondary" : "ghost"}
                  className="w-full justify-start capitalize"
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-4 rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">Entity + Relationship Workspace</h2>
            <p className="mt-1 text-sm text-white/75">
              People, companies, brokers, developers, projects, properties, communities, campaigns, engagements, sources,
              documents, households, opportunities, and inferred links with confidence.
            </p>
          </header>

          {view === "board" ? (
            <section className="columns-1 gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
              {filtered.map((entity) => (
                <EntityCard key={entity.id} entity={entity} onSelect={setSelected} />
              ))}
            </section>
          ) : null}

          {view === "table" ? (
            <Card className="rounded-[28px] border-white/15 bg-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Operational table view</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-white/70">
                    <tr className="border-b border-white/20">
                      <th className="px-2 py-2">Entity</th>
                      <th className="px-2 py-2">Type</th>
                      <th className="px-2 py-2">Bedrooms</th>
                      <th className="px-2 py-2">Budget</th>
                      <th className="px-2 py-2">Communities</th>
                      <th className="px-2 py-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entity) => (
                      <tr
                        key={entity.id}
                        className="cursor-pointer border-b border-white/10 text-white/90 hover:bg-white/10"
                        onClick={() => setSelected(entity)}
                      >
                        <td className="px-2 py-3">{entity.title}</td>
                        <td className="px-2 py-3 capitalize">{entity.type}</td>
                        <td className="px-2 py-3">{String(entity.facts.bedrooms ?? "-")}</td>
                        <td className="px-2 py-3">{String(entity.facts.budget ?? entity.facts.estimated_value ?? "-")}</td>
                        <td className="px-2 py-3">
                          {Array.isArray(entity.facts.preferred_communities)
                            ? entity.facts.preferred_communities.join(", ")
                            : String(entity.facts.current_community ?? "-")}
                        </td>
                        <td className="px-2 py-3">{Math.round(entity.confidence * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : null}

          {view === "graph" ? (
            <Card className="rounded-[28px] border-white/15 bg-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Relationship graph panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {datosRelationships.map((edge) => {
                  const from = getEntityById(edge.fromId);
                  const to = getEntityById(edge.toId);
                  return (
                    <button
                      key={edge.id}
                      className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left hover:bg-white/10"
                      onClick={() => setSelected(from ?? null)}
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {from?.title ?? edge.fromId} <span className="text-white/60">→</span> {to?.title ?? edge.toId}
                        </p>
                        <p className="text-xs text-white/65 capitalize">{edge.type.replaceAll("_", " ")}</p>
                      </div>
                      <div className="text-right text-xs text-white/70">
                        <p>{Math.round(edge.confidence * 100)}%</p>
                        <p>{edge.inferred ? "Inferred" : "Explicit"}</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </main>

        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[360px] rounded-[28px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl xl:block">
          <h3 className="text-lg font-semibold">Detail panel</h3>
          {selected ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className="text-sm font-semibold">{selected.title}</p>
                <p className="text-xs text-white/70 capitalize">{selected.type} • {selected.subtitle}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} className="bg-blue-500/20 text-blue-100">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className="mb-2 text-xs uppercase text-white/65">Granular facts</p>
                <div className="space-y-1 text-sm">
                  {Object.entries(selected.facts).map(([key, value]) => (
                    <p key={key} className="text-white/85">
                      <span className="text-white/60">{key.replaceAll("_", " ")}:</span>{" "}
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className="mb-2 text-xs uppercase text-white/65">Related entities</p>
                <div className="space-y-2">
                  {selectedRelationships.map((rel) => {
                    const counterpart = rel.fromId === selected.id ? getEntityById(rel.toId) : getEntityById(rel.fromId);
                    return (
                      <button
                        key={rel.id}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-2 py-2 text-left text-xs hover:bg-white/10"
                        onClick={() => counterpart && setSelected(counterpart)}
                      >
                        <p className="font-medium text-white">{counterpart?.title ?? "Unknown"}</p>
                        <p className="capitalize text-white/70">{rel.type.replaceAll("_", " ")} • {Math.round(rel.confidence * 100)}%</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/70">Pick any card to inspect details.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
