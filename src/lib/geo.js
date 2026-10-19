export const GEO_LEVELS = [
  { id: "lok_sabha", label: "Lok Sabha Constituency", parent: null },
  { id: "assembly", label: "Assembly Constituency", parent: "lok_sabha" },
  {
    id: "block_tehsil",
    label: "Block / Tehsil",
    parent: "assembly",
    areaType: "rural",
  },
  {
    id: "gram_panchayat",
    label: "Gram Panchayat",
    parent: "block_tehsil",
    areaType: "rural",
  },
  {
    id: "village",
    label: "Village",
    parent: "gram_panchayat",
    areaType: "rural",
  },
  {
    id: "panchayat_ward",
    label: "Panchayat Ward",
    parent: "village",
    areaType: "rural",
  },
  {
    id: "municipality",
    label: "Municipality",
    parent: "assembly",
    areaType: "urban",
  },
  {
    id: "municipal_ward",
    label: "Municipal Ward",
    parent: "municipality",
    areaType: "urban",
  },
  {
    id: "locality",
    label: "Locality/Colony",
    parent: "municipal_ward",
    areaType: "urban",
    optional: true,
  },
];

export const RURAL_LEVELS = GEO_LEVELS.filter((l) => l.areaType === "rural");
export const URBAN_LEVELS = GEO_LEVELS.filter((l) => l.areaType === "urban");
export const SEARCH_LEVELS = GEO_LEVELS.filter((l) =>
  [
    "assembly",
    "block_tehsil",
    "gram_panchayat",
    "village",
    "panchayat_ward",
    "municipality",
    "municipal_ward",
  ].includes(l.id),
);

export function nodeById(nodes, id) {
  return nodes.find((n) => n.id === id) ?? null;
}

export function childrenOf(nodes, parentId, level) {
  return nodes.filter(
    (n) => n.parentId === parentId && (!level || n.level === level),
  );
}

export function descendantIds(nodes, areaId) {
  const ids = new Set([areaId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const n of nodes) {
      if (n.parentId && ids.has(n.parentId) && !ids.has(n.id)) {
        ids.add(n.id);
        grew = true;
      }
    }
  }
  return ids;
}

export function pathValues(geoPath = {}) {
  return Object.values(geoPath).filter(Boolean);
}

export function pathIncludes(geoPath, areaId) {
  if (!areaId) return true;
  return pathValues(geoPath).includes(areaId);
}

/** Contact in this area or any descendant (filter at parent includes children). */
export function contactInArea(nodes, geoPath, areaId) {
  if (!areaId) return true;
  const ids = descendantIds(nodes, areaId);
  return pathValues(geoPath).some((id) => ids.has(id));
}

export function formatPath(nodes, geoPath = {}) {
  const order = GEO_LEVELS.map((l) => l.id);
  return order
    .map((level) => {
      const id = geoPath[level];
      if (!id) return null;
      return nodeById(nodes, id)?.name;
    })
    .filter(Boolean)
    .join(" · ");
}

export function areaName(nodes, areaId) {
  return nodeById(nodes, areaId)?.name ?? "Unknown area";
}

export function levelLabel(levelId) {
  return GEO_LEVELS.find((l) => l.id === levelId)?.label ?? levelId;
}
