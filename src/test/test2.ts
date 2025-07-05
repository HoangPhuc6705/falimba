import '../style.css'
import Konva from 'konva'
import type {KonvaEventObject} from "konva/lib/Node";

// @ts-ignore
interface ShapeProps {
    shape: Konva.Rect,
    isSelect: boolean
}

interface AreaProps {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}

interface PosProps {
    x: number,
    y: number
}

const container: Konva.Stage = new Konva.Stage({
    container: 'app',
    width: 700,
    height: 500,
})

const layer: Konva.Layer = new Konva.Layer();

const shapes: Konva.Rect[] = [];
// @ts-ignore
let firstPostionMouse: AreaProps | null = null;
for (let i = 0; i < 5; ++i) {
    const newShapes: Konva.Rect = new Konva.Rect({
        x: Math.floor(Math.random() * container.width()) - 50,
        y: Math.floor(Math.random() * container.height()) - 50,
        width: 50,
        height: 50,
        fill: "#6385dd"
    })
    shapes.push(newShapes);
    layer.add(newShapes)
}

// @ts-ignore, is mouse position is inside one of rects
function isInside(shape: Konva.Rect, event: KonvaEventObject<MouseEvent, Konva.Layer>) {
    const {x, y} = event.target.getStage()?.getRelativePointerPosition()!;
    const {x1, x2, y1, y2} = {
        x1: shape.x(),
        y1: shape.y(),
        x2: shape.x() + shape.width(),
        y2: shape.y() + shape.height(),
    }
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

// mouse event
// @ts-ignore
let keydown: string | null = null
let isMouseDown: boolean = false;
// @ts-ignore
let selectedShape: Konva.Rect | null = null;
let firstPosition: { x: number, y: number } | null = null;
let firstPosShapes: PosProps[] = []

function handleMouseDown(event: KonvaEventObject<MouseEvent, Konva.Layer>) {
    isMouseDown = true;
    // find the shape contain the mouse position (x, y)
    shapes.forEach(shape => {
        const {x, y} = event.target.getStage()?.getRelativePointerPosition()!;
        if (isInside(shape, event)) {
            firstPosition = {
                x: x,
                y: y,
            }
            return;
        }
    })

    // save shape's position
    if (firstPosition) {
        shapes.forEach(shape => {
            firstPosShapes.push({
                x: shape.x(),
                y: shape.y()
            })
        })
    }
}

// @ts-ignore
function handleMouseMove(event: KonvaEventObject<MouseEvent, Konva.Layer>) {
    if (isMouseDown) {
        const {x, y} = event.target.getStage()?.getRelativePointerPosition()!;
        const {vx, vy}: { vx: number, vy: number } = {
            vx: x - firstPosition!.x,
            vy: y - firstPosition!.y
        }

        for (let i = 0; i < shapes.length; ++i) {
            shapes.at(i)?.x(firstPosShapes.at(i)!.x + vx)
            shapes.at(i)?.y(firstPosShapes.at(i)!.y + vy)
        }
    }
}

// @ts-ignore
function handleMouseUp() {
    selectedShape = null;
    firstPostionMouse = null;
    firstPosition = null;
    firstPosShapes = []
    isMouseDown = false;
}

// @ts-ignore
function handleMouseLeave(event: KonvaEventObject<MouseEvent, Konva.Layer>) {

}

function handleKeyDown(event: KeyboardEvent) {
    keydown = event.key;
}

function handleKeyUp() {
    keydown = null;
}

layer.on('mousedown', (e) => handleMouseDown(e));
layer.on('mousemove', (e) => handleMouseMove(e));
layer.on('mouseup', () => handleMouseUp());
layer.on('mouseleave', (e) => handleMouseLeave(e))
window.addEventListener('keydown', (e) => handleKeyDown(e));
window.addEventListener('keyup', handleKeyUp);

// create the outline
layer.add(new Konva.Rect({
    x: 0, y: 0, width: container.width(), height: container.height(), stroke: '#000000'
}))

container.add(layer);
layer.draw()
