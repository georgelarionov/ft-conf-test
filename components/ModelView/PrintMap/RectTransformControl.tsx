import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, TextureLoader, Vector2 } from 'three';
import { PrintMapItem } from "./PrintMapItem";
import { Keys } from "./Keys";

enum HandleSide {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    Rotator
}

export class RectTransformControl extends Mesh
{
    private topLeft     = new RectTransformHandle(HandleSide.TopLeft);
    private topRight    = new RectTransformHandle(HandleSide.TopRight);
    private bottomLeft  = new RectTransformHandle(HandleSide.BottomLeft);
    private bottomRight = new RectTransformHandle(HandleSide.BottomRight);

    private rotator = new RectTransformRotateHandle();

    private isActive = true;
    
    constructor(item: PrintMapItem) {
        super();
        
        this.add(this.topLeft);
        this.add(this.topRight);
        this.add(this.bottomLeft);
        this.add(this.bottomRight);
        this.add(this.rotator);
        
        this.position.copy(item.position);
        
        const vert = Keys.Vert
        const hor = Keys.Hor
        const line = Keys.Line
        
        const height = 0.01;
        const params = { color: "#54A3FF", opacity: 0.5, transparent: true }
        
        const left = new Mesh(new PlaneGeometry(height,  1), new MeshBasicMaterial(params));
        left.userData.vertType = vert;
        left.name = line;
        left.position.set(-0.5, 0, 0);
        
        const right = new Mesh(new PlaneGeometry(height,  1), new MeshBasicMaterial(params));
        right.userData.vertType = vert;
        right.name = line;
        right.position.set(0.5, 0, 0);
        
        const bottom = new Mesh(new PlaneGeometry(1, height), new MeshBasicMaterial(params));
        bottom.userData.vertType = hor;
        bottom.name = line;
        bottom.position.set(0, -0.5, 0);
        
        const top = new Mesh(new PlaneGeometry(1, height), new MeshBasicMaterial(params));
        top.userData.vertType = hor;
        top.name = line;
        top.position.set(0, 0.5, 0);

        this.add(left);
        this.add(right);
        this.add(bottom);
        this.add(top);

        this.visible = false;
        
    }
    
    public update(){
        if (!this.isActive) {
            return;
        }
    }
    
    public setActive(isActive: boolean){
        
        this.topLeft.visible = isActive;
        this.topRight.visible = isActive;
        this.bottomLeft.visible = isActive;
        this.bottomRight.visible = isActive;
        this.rotator.visible = isActive;
        
        this.isActive = isActive;
    }
}


export class RectTransformHandle extends Object3D {
    
    
    constructor(side: HandleSide) {
        super();
        this.name = Keys.Rect;
        
        const color = "#66C4FF";
        const z = 0.001;
        
        switch (side)
        {
            case HandleSide.TopLeft:
                this.position.set(0.5, -0.5, z);
                this.userData = new Vector2(1, -1);
                break;
            case HandleSide.TopRight:
                this.position.set(-0.5, -0.5, z);
                this.userData = new Vector2(-1, -1);
                break;
            case HandleSide.BottomLeft:
                this.position.set(0.5, 0.5, z);
                this.userData = new Vector2(1, 1);
                break;
            case HandleSide.BottomRight:
                this.position.set(-0.5, 0.5, z);
                this.userData = new Vector2(-1, 1);
                break;
            case HandleSide.Rotator:
                this.position.set(0, 1, z);
                break;

        }
        
        const size = side === HandleSide.Rotator ? 0.15 : 0.1;

        const handle = new Mesh(
            new PlaneGeometry(size, size), 
            new MeshBasicMaterial({ color, map: null, transparent: false })
        );
        
        handle.position.setZ(0.001);
        handle.name = side === HandleSide.Rotator ? Keys.RotChild : Keys.RectChild;

        this.add(handle);
        
        this.load(handle, side);
        
    }
    
    private async load(handle: Mesh<PlaneGeometry, MeshBasicMaterial>, side: HandleSide) {
        handle.material.map = await new TextureLoader().loadAsync(`images/${side === HandleSide.Rotator ? Keys.Rot : Keys.Rect}.png`);
        handle.material.transparent = true;
        handle.material.needsUpdate = true;
    }
}

export class RectTransformRotateHandle extends RectTransformHandle
{
    constructor() {
        super(HandleSide.Rotator);
        this.name = Keys.Rot;
    }
}