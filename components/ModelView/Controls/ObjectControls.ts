import { eventsUtils } from "../../../utils/eventsUtils";
import { ModelView } from "../ModelView";
import { IRaycastView } from "../Raycaster/Raycaster";
import scrollLock from 'scroll-lock';
import { PrintMapCanvas } from "../PrintMap/PrintMapCanvas";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";


export class ObjectControls implements IRaycastView {
    
    // Public
    public get Rect() { return this.view.Rect; }
    public get Camera() { return this.view.Camera; }
    public get Model() { return this.view.Model; }

    
    // Private
    private controls: OrbitControls;
    private view: ModelView;
    
    private isDrag = false
    private isScrollDisabled = false;

    private clearInterval!: NodeJS.Timeout;
    
    
    constructor(view: ModelView) {

        this.view = view;
        this.controls = new OrbitControls(this.view.Camera, this.view.Renderer.domElement);

        this.controls.target = new Vector3(0, 0, 0);
        this.controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;
        this.controls.enablePan = false;

        this.controls.minDistance = 0.1;
        this.controls.maxDistance = 1;

        this.controls.maxPolarAngle = Math.PI / 2;
        this.initEvents();
    }

    public setMinMax(minDist: number, maxDist: number) {
        this.controls.minDistance = minDist;
        this.controls.maxDistance = maxDist;
    }
    
    private initEvents() {

        const onPointerUp = () => {

            this.isDrag = false;
        };

        const onPointerDown = () => {
            this.isDrag = true;

            this.disableScroll();
        };

        const onPointerMove = (x: number, y: number) => {

            const tempDisable = !PrintMapCanvas.Instance?.AnyDrag;
            if (this.isDrag && tempDisable) {
                this.disableScroll();
            }
        };

        eventsUtils.addEvents(this.view.Renderer.domElement, onPointerDown, onPointerUp, onPointerMove);

    }

    public disableScroll() {
        
        if (this.isScrollDisabled) {
            return;
        }

        scrollLock.clearQueueScrollLocks();
        scrollLock.disablePageScroll();
        this.isScrollDisabled = true;

        clearTimeout(this.clearInterval);

        this.clearInterval = setTimeout(() => {

            scrollLock.clearQueueScrollLocks();
            scrollLock.enablePageScroll();
            this.isScrollDisabled = false;

        }, 500)
    }

    update(dt: number) {
        this.controls.update(dt);
    }


    saveState() {
        this.controls.saveState()
    }

    reset() {
        this.controls.reset()
    }
}