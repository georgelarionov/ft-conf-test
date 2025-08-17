import * as THREE from 'three';
import { BufferGeometry, MeshStandardMaterial, Object3D, RepeatWrapping } from 'three';
import { GLTFExporter, GLTFExporterOptions } from 'three/examples/jsm/exporters/GLTFExporter';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter';
import { PrintMapCanvas } from '../PrintMap/PrintMapCanvas';
import { ModelView } from '../ModelView';
import { skeletonUtils } from "../../../utils/skeletonUtils";

export const CONVERTING_VIDEO_EVENT = 'converting';

export enum ExportModelFormat {
  USDZ = "usdz",
  GLB = "glb",
  GLTF = "gltf"
}

export class ExportModel {

  public static async export(format: ExportModelFormat, exportNormalRoughnessMaps = true, textureSize: number = 512) {

    if (ModelView.Instance == null || ModelView.Instance.Model == null) return;

    ModelView.Instance.Model.rotation.set(0, 0, 0);
    ModelView.Instance.update(0);

    let newMaterial: MeshStandardMaterial;

    const clone = skeletonUtils.clone(ModelView.Instance.Model);
    clone.scale.set(1,1,1);
    clone.position.set(0,0,0);

    const defaultExportSize = 512;
    const exportSize =
      PrintMapCanvas.Instance == null
        ? defaultExportSize
        : PrintMapCanvas.Instance.setExportSize(textureSize);

    const flipBaseMapY = ModelView.Instance.LastLoadedProduct?.flipBaseMapY;

    console.log(`Start export format: ${ExportModelFormat[format]} exportNormalRoughnessMaps: ${exportNormalRoughnessMaps} exportSize: ${exportSize} flip: ${flipBaseMapY}`);

    const materialsCount = ExportModel.getMaterialCount(clone);

    console.log("Materials count: " + materialsCount);

    if(PrintMapCanvas.Instance != null){
      PrintMapCanvas.Instance.clearActive();
      PrintMapCanvas.Instance.update(0);
    }


    console.log("Start traverse...");
    clone.traverse(o => {
      const mesh = o as THREE.Mesh;
      if (mesh != null) {
        const mats = mesh.material as MeshStandardMaterial[];
        if (mats != null) {
          const geo = mesh.geometry.clone() as BufferGeometry;

          console.log(`Start material export mesh: ${mesh.name}...`)

          geo.clearGroups();
          geo.addGroup(0, mesh.geometry.index?.count ?? 250_000, 0);

          mesh.geometry = geo;

          console.log("Materials process: Create print");
          // Append print
          let exportCanvas = document.getElementById('export-canvas') as HTMLCanvasElement;
          if (exportCanvas) exportCanvas.outerHTML = '';
          exportCanvas = document.createElement('canvas');
          exportCanvas.id = 'export-canvas';
          exportCanvas.style.display = 'none';
          exportCanvas.width = exportSize;
          exportCanvas.height = exportSize;

          document.body.appendChild(exportCanvas);

          let ctx = exportCanvas.getContext('2d') as CanvasRenderingContext2D;

          if (mats.length >= 2 && mats[1].map != null) {

            const flip = -1;
            ctx.scale(1, flip);
            
            ctx.drawImage(mats[1].map.image, 0, -exportCanvas.height);
          }

          console.log("Materials process: Create background");
          // Append background
          let exportCanvas2 = document.getElementById('export-canvas-2') as HTMLCanvasElement;
          if (exportCanvas2) exportCanvas2.outerHTML = '';
          exportCanvas2 = document.createElement('canvas');
          exportCanvas2.id = 'export-canvas-2';
          exportCanvas2.style.display = 'none';
          exportCanvas2.width = exportSize;
          exportCanvas2.height = exportSize;

          document.body.appendChild(exportCanvas2);

          ctx = exportCanvas2.getContext('2d') as CanvasRenderingContext2D;

          ctx.globalCompositeOperation = "multiply";

          if(mats[0].map != null) {

            if (mats[0].map?.wrapT == RepeatWrapping && mats[0].map?.repeat.x > 1 && mats[0].map?.repeat.y > 1) {

              console.log(`Create pattern: ${mesh.name} ${mats[0].map?.name}...`)

              // Create a pattern
              let patternCanvas = document.getElementById('export-canvas-pattern') as HTMLCanvasElement;
              if (patternCanvas) patternCanvas.outerHTML = '';
              patternCanvas = document.createElement('canvas');
              patternCanvas.id = "export-canvas-pattern";
              patternCanvas.style.display = 'none';

              console.log(`exportCanvas2: ${exportCanvas2.width}, ${exportCanvas2.height}`);
              console.log(`mat.repeat: ${mats[0].map.repeat.x}, ${mats[0].map.repeat.y}`);

              patternCanvas.width  = exportCanvas2.width  / mats[0].map.repeat.x;
              patternCanvas.height = exportCanvas2.height / mats[0].map.repeat.y;

              document.body.appendChild(patternCanvas);

              const patternContext = patternCanvas.getContext('2d')  as CanvasRenderingContext2D;

              patternContext.drawImage(mats[0].map.image, 0, 0, patternCanvas.height, patternCanvas.height);

              console.log(`pattern function: ${patternContext.createPattern}`)
              console.log(patternContext)
              console.log(patternCanvas)
              try {
                const pattern: CanvasPattern = patternContext.createPattern(patternCanvas, 'repeat') as CanvasPattern;

                ctx.fillStyle = pattern;
                console.log(`fill pattern rect. canvas: ${exportCanvas2} pattern: ${pattern} patternCanvas ${patternCanvas}`)
                ctx.fillRect(0, 0, exportCanvas2.width, exportCanvas2.height);
              }
              catch(ex) {
                console.error("patternContext.createPattern? exception");
                console.error(ex);
              }
            }
            else
            {
              ctx.drawImage(mats[0].map.image, 0, 0, exportCanvas2.width, exportCanvas2.height);
            }
          }

          console.log("Materials process: add print(exportCanvas) to background(exportCanvas2)");
          ctx.fillStyle = mats[0].color
            .clone()
            .getStyle();
          ctx.fillRect(0, 0, exportCanvas2.width, exportCanvas2.height);

          ctx.globalCompositeOperation = "source-over";
          // draw print
          if(format !== ExportModelFormat.USDZ) {
            console.log("drawImage flip -1 / gltf/glb");
            ctx.scale(1, -1);
            ctx.drawImage(exportCanvas, 0, -exportCanvas.height);
          }
          else {
            console.log("drawImage flip 1 / usdz");
            ctx.drawImage(exportCanvas, 0, 0);
          }

          console.log("Material finishing...");

          newMaterial = (mats[0] as MeshStandardMaterial).clone() as MeshStandardMaterial;
          newMaterial.map = new THREE.CanvasTexture(exportCanvas2);

          if(format == ExportModelFormat.GLB || format == ExportModelFormat.GLTF) {
            newMaterial.map.flipY = false;
          }

          // todo: return? limit after tests
          // if(materialsCount > 5) {
          //   if(newMaterial.normalMap != null){
          //     console.log("drop normal map because too many materials...");
          //   }
          //   newMaterial.normalMap = null;
          // }

          if(!exportNormalRoughnessMaps)
          {
            newMaterial.roughnessMap = null;
            newMaterial.normalMap = null;
          }

          newMaterial.color = new THREE.Color('#fff');
          newMaterial.needsUpdate = true;

          mesh.material = newMaterial;

          console.log("Materials processed: " + newMaterial.uuid + " mesh: " + mesh.name);

        }
      }
    });

    if (PrintMapCanvas.Instance != null)
      PrintMapCanvas.Instance.onWindowResize();

    console.log("Traverse done");

    const exportUsdz = async (clonedModel: Object3D) => {

      // iOS export bugs workaround
      const makeImage = () => {
        console.log("Make image...");
        const c = document.createElement('canvas');

        const i = new Image();
        i.src = c.toDataURL();
        return i;
      };

      // USDZ
      const exporter = new USDZExporter();

      console.log("Start model parse...");
      const arraybuffer = await exporter.parseAsync(clonedModel);
      console.log("End model parse");
      
      const blob = new Blob([arraybuffer], { type: 'application/octet-stream' });

      console.log("Create link...");
      const link = document.createElement('a');
      link.style.display = 'none';
      link.rel = 'ar';
      link.download = 'asset.usdz';

      const img = makeImage();
      link.appendChild(img);
      document.body.appendChild(link);

      console.log("Create object url from blob...");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.click();
      console.log("Click link...");

      setTimeout(()=>{
        console.log("Cleanup/Revoke: ar url")
        URL.revokeObjectURL(url);
      }, 500);

    }

    if(format === ExportModelFormat.USDZ) await exportUsdz(clone);
    else if(format === ExportModelFormat.GLTF) await ExportModel.exportGLTF(clone, false);
    else if(format === ExportModelFormat.GLB) await ExportModel.exportGLTF(clone, true);


    // cleanup
    setTimeout(()=>{
      console.log("Cleanup/Revoke: ar export...");
      const exportCanvas = document.getElementById('export-canvas');
      if (exportCanvas) exportCanvas.outerHTML = '';

      const exportCanvas2 = document.getElementById('export-canvas-2');
      if (exportCanvas2) exportCanvas2.outerHTML = '';

      const exportCanvasPatterns = document.getElementById('export-canvas-pattern');
      if (exportCanvasPatterns) exportCanvasPatterns.outerHTML = '';

      // Revert export size to default
      if(PrintMapCanvas.Instance != null)
        PrintMapCanvas.Instance.setExportSize()

      console.log("Cleanup/Revoke: ar export end");

    }, 250);
  }

  private static async exportGLTF(model: Object3D, binary: boolean) {

    const save = (blob: any, filename: string) => {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);

      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    };

    const saveString = (text: string, filename: string) => {
      save(new Blob([text], { type: 'text/plain' }), filename);
    };

    const saveArrayBuffer = (buffer: ArrayBuffer, filename: string) => {
      save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
    };

    const exportGltf = async (input: Object3D) => {

      const gltfExporter = new GLTFExporter();

      const options: GLTFExporterOptions = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: false,
        embedImages: true,
        binary: binary,
        forceIndices: false,
      };

      const result: any = await gltfExporter.parseAsync(
          input,
          options
      );

      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, 'scene.glb');
      } else {
        const output = JSON.stringify(result, null, 2);
        saveString(output, 'scene.gltf');
      }
    };

    await exportGltf(model);
  }

  private static getMaterialCount(clone: Object3D) {
    let materialsCount = 0;
    let lastMaterialId = "";
    clone.traverse(o => {
      const mesh = o as THREE.Mesh;
      if (mesh != null) {
        const mats = mesh.material as MeshStandardMaterial[];
        if (mats != null) {
          if(mats[0].map != null) {
            console.log(mats[0].map?.uuid);
            if (lastMaterialId != mats[0].map.uuid) {
              materialsCount++;
              lastMaterialId = mats[0].map.uuid;
            }
          }
        }
      }
    });
    return materialsCount;
  }

}
