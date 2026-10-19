# Geographical hierarchy

## Simple idea

Think of geography as a family tree.

A **Lok Sabha Constituency** is the parent. An **Assembly Constituency** is a child of that parent. Below the assembly, the tree splits into two families:

- **Rural:** Block / Tehsil → Gram Panchayat → Village → Panchayat Ward
- **Urban:** Municipality → Municipal Ward → Locality/Colony (optional)

If you pick a parent, you also pick all children. A search for a Block also finds contacts in the villages of that Block.

## What it does

- It puts every contact, volunteer, visit, and request on a known area.
- It lets staff filter at any administrative level.
- It supports rural areas and urban areas under the same assembly.

## How it does it

1. `src/lib/geo.js` lists the levels in `GEO_LEVELS`.
2. `src/data/seed.js` lists the sample places in `geoNodes`. Each node has `id`, `name`, `level`, and `parentId`.
3. A record does not store only one area. It stores a **geoPath**. A geoPath is an object. Keys are level ids. Values are node ids.

Example:

```
lok_sabha: ls-1
assembly: ac-1
areaType: rural
block_tehsil: blk-1
gram_panchayat: gp-1
village: vil-1
```

4. `childrenOf` returns the next level under a parent.
5. `descendantIds` starts at one area. It keeps adding children until the set stops growing.
6. `contactInArea` says yes if any id in the geoPath is in that descendant set.
7. `GeoPicker` (`src/components/GeoPicker.js`) shows one dropdown per level. When you change a parent, it deletes child fields. Rural and Urban buttons stay disabled until `assembly` has a value.

## Files

- `src/lib/geo.js` — level list and match functions
- `src/data/seed.js` — sample tree (Jaipur Rural → Chomu)
- `src/components/GeoPicker.js` — UI to pick a path
