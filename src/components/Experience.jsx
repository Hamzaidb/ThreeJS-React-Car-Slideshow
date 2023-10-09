import {
  CameraControls,
  Dodecahedron,
  Environment,
  Grid,
  MeshDistortMaterial,
  RenderTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { slideAtom } from "./Overlay";
import { Scene } from "./Scene";
import { TextureLoader } from 'three';
import Datsunlogo from "../assets/logos/DatsunLogo.png";
import BmwLogo from "../assets/logos/BmwLogo.png";
import PolestarLogo from "../assets/logos/PolestarLogo.png";

const datsunTexture = new TextureLoader().load(Datsunlogo);
const bmwTexture = new TextureLoader().load(BmwLogo);
const polestarTexture = new TextureLoader().load(PolestarLogo);

export const scenes = [
  {
    path: "models/free_datsun_280z.glb",
    mainColor: "#FFE6C3",
    name: "Datsun 280z",
    //description:"Better utility than a truck with more performance than a sports car",
    speed: 6, 
    maneuverability: 4, 
    acceleration: 7, 
  },
  {
    path: "models/free_bmw_m3_e30.glb",
    mainColor: "#FFC3C3",
    name: "BMW M3 e30",
    //description: "The car of the future",
    speed: 8, 
    maneuverability: 7, 
    acceleration: 6, 
  },
  {
    path: "models/free_polestar_1.glb",
    mainColor: "#ffdec0",
    name: "Polestar",
    //description: "The Future of Trucking",
    speed: 5, //
    maneuverability: 10, 
    acceleration: 5, 
  },
];

const CameraHandler = ({ slideDistance }) => {
  const viewport = useThree((state) => state.viewport);
  const cameraControls = useRef();
  const [slide] = useAtom(slideAtom);
  const lastSlide = useRef(0);

  const { dollyDistance } = useControls({
    dollyDistance: {
      value: 10,
      min: 0,
      max: 50,
    },
  });

  const moveToSlide = async () => {
    await cameraControls.current.setLookAt(
      lastSlide.current * (viewport.width + slideDistance),
      3,
      dollyDistance,
      lastSlide.current * (viewport.width + slideDistance),
      0,
      0,
      true
    );
    await cameraControls.current.setLookAt(
      (slide + 1) * (viewport.width + slideDistance),
      1,
      dollyDistance,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );

    await cameraControls.current.setLookAt(
      slide * (viewport.width + slideDistance),
      0,
      5,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );
  };

  useEffect(() => {
    // Used to reset the camera position when the viewport changes
    const resetTimeout = setTimeout(() => {
      cameraControls.current.setLookAt(
        slide * (viewport.width + slideDistance),
        0,
        5,
        slide * (viewport.width + slideDistance),
        0,
        0
      );
    }, 200);
    return () => clearTimeout(resetTimeout);
  }, [viewport]);

  useEffect(() => {
    if (lastSlide.current === slide) {
      return;
    }
    moveToSlide();
    lastSlide.current = slide;
  }, [slide]);
  return (
    <CameraControls
      ref={cameraControls}
      touches={{
        one: 0,
        two: 0,
        three: 0,
      }}
      mouseButtons={{
        left: 0,
        middle: 0,
        right: 0,
      }}
    />
  );
};

export const Experience = () => {
  const viewport = useThree((state) => state.viewport);
  const { slideDistance } = useControls({
    slideDistance: {
      value: 1,
      min: 0,
      max: 10,
    },
  });
  return (
    <>
      <ambientLight intensity={0.2} />
      <Environment preset={"city"} />
      <CameraHandler slideDistance={slideDistance} />
      {/* MAIN WORLD */}
      <group>
        <mesh position-y={viewport.height / 2 + 1}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={datsunTexture} transparent={true} />
      </mesh>

       <mesh position-x={viewport.width + slideDistance} position-y={viewport.height / 2 + 1}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={bmwTexture} transparent={true} />
      </mesh>

      <mesh position-x={2 * (viewport.width + slideDistance)} position-y={viewport.height / 2 + 1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={polestarTexture} transparent={true} />
      </mesh>
    </group>

    
      <Grid
        position-y={-viewport.height / 2}
        sectionSize={1}
        sectionColor={"purple"}
        sectionThickness={1}
        cellSize={0.5}
        cellColor={"#6f6f6f"}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
      />
      {scenes.map((scene, index) => (
        <mesh
          key={index}
          position={[index * (viewport.width + slideDistance), 0, 0]}
        >
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial toneMapped={false}>
            <RenderTexture attach="map">
              <Scene {...scene} />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      ))}
    </>
  );
};
