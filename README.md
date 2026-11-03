# 3D Model Viewer — Lighting & Shadows

A Babylon.js computer-graphics coursework exercise focused on loading a glTF model, camera control, lighting, materials, and ground shadows.

[Open web demo](https://web-based-simple-model-shadow.vercel.app)

**Stack:** HTML · JavaScript · Babylon.js · glTF

## Run locally

```sh
git clone https://github.com/mrafi-aditya/Web-Based-Simple-Model-Shadow.git
cd Web-Based-Simple-Model-Shadow
python -m http.server 8000
```

Open `http://localhost:8000`. Drag to orbit the camera and scroll to zoom. No npm build is required. Babylon.js and environment assets are fetched from external hosts, so an internet connection is needed.

## Implementation

- `index.html` contains the page **and the inline scene code used by the page**.
- `model.gltf` supplies the model.
- `script.js` preserves a separate scene implementation; the current page does not load it as an external script.

The inline implementation sets hemispheric and directional lighting, a ground plane that receives shadows, a shadow generator, and material configuration. This is a learning exercise in rendering behavior, not a claim of original 3D asset authorship or production rendering quality.

Learning progression: [basic viewer](https://github.com/mrafi-aditya/Web_Based_Simple_Model) → **lighting and shadows** → [Movase interactive scene](https://github.com/mrafi-aditya/Web-Based-Simple-Interactive).
