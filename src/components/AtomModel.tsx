import { useEffect, useRef } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const nobleGasConfigs = {
  He: "1s2",
  Ne: "1s2 2s2 2p6",
  Ar: "[Ne] 3s2 3p6",
  Kr: "[Ar] 3d10 4s2 4p6",
  Xe: "[Kr] 4d10 5s2 5p6",
  Rn: "[Xe] 4f14 5d10 6s2 6p6",
};
//@ts-ignore
const expandNobleGasNotation = (config) => {
  let expanded = config.replace(/\s+/g, " ").trim();
  while (expanded.includes("[")) {
    const nobleGasMatch = expanded.match(/\[(.*?)\]/);
    if (nobleGasMatch) {
      const nobleGas = nobleGasMatch[1];
      const remainder = expanded.slice(nobleGasMatch[0].length).trim();
      //@ts-ignore
      expanded = `${nobleGasConfigs[nobleGas]} ${remainder}`;
    } else {
      break;
    }
  }
  return expanded;
};

//@ts-ignore
const parseElectronConfiguration = (config) => {
  const expandedConfig = expandNobleGasNotation(config);
  const shellMap = new Map();
  const regex = /(\d)([spdf])(\d*)/g;
  let match;

  while ((match = regex.exec(expandedConfig)) !== null) {
    const [_, principal, orbital, electrons] = match;
    const n = parseInt(principal);
    const electronCount = electrons ? parseInt(electrons) : 1;

    shellMap.set(n, (shellMap.get(n) || 0) + electronCount);
  }

  return Array.from(shellMap.entries())
    .sort(([n1], [n2]) => n1 - n2)
    .map(([n, electrons]) => ({
      shell: n,
      electrons,
    }));
};
//@ts-ignore
const AtomicModel = ({ elementData }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const frameRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (controlsRef.current) {
        //@ts-ignore
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        //@ts-ignore
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        //@ts-ignore
        while (sceneRef.current.children.length > 0) {
          //@ts-ignore
          const object = sceneRef.current.children[0];
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              //@ts-ignore
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
          //@ts-ignore
          sceneRef.current.remove(object);
        }
      }
      //@ts-ignore
      while (containerRef.current?.firstChild) {
        //@ts-ignore
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };

    cleanup();

    const scene = new THREE.Scene();
    scene.background = null;
    //@ts-ignore
    sceneRef.current = scene;
    //@ts-ignore

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(450, 450);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //@ts-ignore
    rendererRef.current = renderer;
    //@ts-ignore
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nucleusMaterial = new THREE.MeshPhongMaterial({
      color: `#${elementData.CPKHexColor || "808080"}`,
      shininess: 100,
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);

    const shells = parseElectronConfiguration(
      elementData.ElectronConfiguration,
    );
    //@ts-ignore
    const electronGroups = [];

    shells.forEach(({ shell, electrons }) => {
      const radius = shell * 0.5;

      const orbitCurve = new THREE.EllipseCurve(
        0,
        0,
        radius,
        radius,
        0,
        2 * Math.PI,
        false,
        0,
      );

      const orbitPoints = orbitCurve.getPoints(100);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        orbitPoints,
      );
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.6,
      });

      const orbitGroup = new THREE.Group();
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      orbitGroup.add(orbit);

      const electronGeometry = new THREE.SphereGeometry(0.08, 32, 32);
      const electronMaterial = new THREE.MeshPhongMaterial({
        color: 0xffa500,
        shininess: 100,
      });

      const electronsGroup = new THREE.Group();

      for (let i = 0; i < electrons; i++) {
        const electronPivot = new THREE.Group();
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);

        electron.position.x = radius;
        electronPivot.rotation.z = (i / electrons) * Math.PI * 2;

        electronPivot.add(electron);
        electronsGroup.add(electronPivot);
      }

      orbitGroup.rotation.x = Math.random() * Math.PI;
      orbitGroup.rotation.y = Math.random() * Math.PI;

      orbitGroup.add(electronsGroup);
      scene.add(orbitGroup);

      electronGroups.push({
        group: electronsGroup,
        radius,
        electrons,
      });
    });

    const animate = () => {
      //@ts-ignore
      frameRef.current = requestAnimationFrame(animate);
      //@ts-ignore
      electronGroups.forEach(({ group, radius }) => {
        const speed = 0.01 / Math.sqrt(radius);
        group.rotation.z += speed;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (containerRef.current) {
        //@ts-ignore
        const width = containerRef.current.clientWidth;
        renderer.setSize(width, width);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cleanup();
    };
  }, [elementData]);

  return (
    <div className="md:w-[75vh] w-[85vw] flex items-center justify-center h-[85vw] md:h-[75vh]">
      <div
        ref={containerRef}
        className="w-full aspect-square flex justify-center"
      />
    </div>
  );
};

export default AtomicModel;
