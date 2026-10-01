# 3D models

Drop Blender exports (`.glb` / `.gltf`) here and reference them from a product's
`modelUrl` field, e.g. `modelUrl: "/3d-models/dog-bed.glb"`.

Products without a `modelUrl` (or whose file fails to load) automatically fall
back to the built-in procedural 3D models in `src/components/3d/PetModels.tsx`,
so the store works out of the box with no binary assets.

Tips for web-ready models:
- Apply transforms and keep the model centred on the origin, ~1-2 units tall.
- Compress with `npx gltf-transform optimize in.glb out.glb --compress draco`.
- Keep textures at 1024px or smaller.
