const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(1, 0.96, 0.86, 1); // Background cream

  // Tambahkan kamera
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3,
    5,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);
  camera.wheelPrecision = 50;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 20;

  // Lampu hemisferik putih terang
  const hemiLight = new BABYLON.HemisphericLight(
    "hemiLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  hemiLight.intensity = 1.2;
  hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
  hemiLight.specular = new BABYLON.Color3(1, 1, 1);
  hemiLight.groundColor = new BABYLON.Color3(0.8, 0.8, 0.8);

  // Lampu directional putih terang dari kanan atas
  const dirLight = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(-1, -2, -1),
    scene
  );
  dirLight.position = new BABYLON.Vector3(5, 10, 5);
  dirLight.intensity = 1.5;
  dirLight.diffuse = new BABYLON.Color3(1, 1, 1);
  dirLight.specular = new BABYLON.Color3(1, 1, 1);

  // Tambahkan shadow generator
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
  shadowGenerator.usePoissonSampling = true; // Bayangan lembut
  shadowGenerator.bias = 0.0001;

  // Tambahkan ground plane untuk menerima bayangan, diturunkan ke y = -1
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );
  ground.position.y = -1; // Turunkan alas ke y = -1
  const groundMaterial = new BABYLON.PBRMaterial("groundMat", scene);
  groundMaterial.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.85);
  groundMaterial.metallic = 0.1;
  groundMaterial.roughness = 0.6;
  ground.material = groundMaterial;
  ground.receiveShadows = true;

  return scene;
}

const scene = createScene();

function loadModel(filename) {
  const fileExtension = filename.split(".").pop().toLowerCase();

  if (fileExtension === "gltf" || fileExtension === "glb") {
    BABYLON.SceneLoader.ImportMesh(
      "",
      "./", // Load dari direktori yang sama
      filename,
      scene,
      function (meshes) {
        console.log("Model GLTF berhasil dimuat!", meshes);
        const model = meshes[0];

        // Hitung bounding box untuk menempatkan model di atas ground
        const boundingInfo = model.getHierarchyBoundingVectors(true);
        const modelBottom = boundingInfo.min.y;

        // Turunkan model agar lebih dekat ke ground
        model.position = new BABYLON.Vector3(0, -modelBottom + 0.1, 0); // Dekatkan ke alas
        model.scaling = new BABYLON.Vector3(5, 5, 5); // Perbesar model

        // Terapkan material PBR untuk shading realistis
        const pbrMaterial = new BABYLON.PBRMaterial("pbrMat", scene);
        pbrMaterial.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.9); // Warna dasar netral
        pbrMaterial.metallic = 0.3; // Sedikit kilau logam
        pbrMaterial.roughness = 0.4; // Permukaan agak halus
        pbrMaterial.subSurface.isRefractionEnabled = true; // Efek tembus cahaya
        pbrMaterial.subSurface.indexOfRefraction = 1.5;
        pbrMaterial.environmentTexture =
          BABYLON.CubeTexture.CreateFromPrefilteredData(
            "https://assets.babylonjs.com/environments/environmentSpecular.env",
            scene
          ); // Refleksi lingkungan
        model.material = pbrMaterial;

        // Tambahkan bayangan
        scene
          .getLightByName("dirLight")
          .getShadowGenerator()
          .addShadowCaster(model);

        // Pusatkan kamera pada model
        scene.getCameraByName("camera").setTarget(model.position);

        // Log untuk debugging
        console.log("Model position:", model.position);
        console.log("Model bounding info:", boundingInfo);
        console.log("Ground position:", scene.getMeshByName("ground").position);
      },
      null,
      function (scene, message, exception) {
        console.error("Gagal memuat model:", message, exception);
        document.getElementById("modelInfo").innerText = "Gagal memuat model!";
      }
    );
  } else {
    console.error("Format tidak didukung:", fileExtension);
    document.getElementById("modelInfo").innerText = "Format tidak didukung!";
  }
}

// Panggil fungsi loadModel dengan nama file model
loadModel("model.gltf");

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
