export class eventsUtils {

    public static addEvents(node: HTMLElement, 
                                onPointerDown: (x:number, y:number) => void,
                                onPointerUp:() => void, 
                                onPointerMove: (x:number, y:number) => void) {

        node.addEventListener('pointerdown', (e) => onPointerDown(e.clientX, e.clientY));
        node.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientX, e.touches[0].clientY));

        window.addEventListener('pointerup', (e) => onPointerUp());
        window.addEventListener('touchend', (e) => onPointerUp());

        window.addEventListener('pointermove', (e) => onPointerMove(e.clientX, e.clientY), { passive: true });
        window.addEventListener('touchmove', (e) => onPointerMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    }
}