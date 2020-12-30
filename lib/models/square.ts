import GameObject from "../interfaces/game-object";

export default class Square implements GameObject{
    
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    img: HTMLImageElement;
    isMoving: boolean;
    rotateEnabled: boolean;
    angle: number;
    connected: boolean;

    constructor(id: number, x: number, y: number, size: number, color: string, angle: number, rotate: boolean, connected: boolean) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.img = new Image();
        this.isMoving = true;
        this.rotateEnabled = rotate;
        this.angle = angle;
        this.connected = connected;
    }
    
    draw(drawer: CanvasRenderingContext2D): void {
        this.img.src = this.color;
        drawer.drawImage(this.img, this.x, this.y)
    }

    update(): void {
        if(this.isMoving){
            this.y += this.size
        }
    }

    start(): void{
        this.isMoving = true;
    }

    stop(): void{
        this.isMoving = false;
    }

    rotate(x: number,y: number): void {
        if(this.rotateEnabled){
            this.x = this.x + (x);
            this.y = this.y + (y);

            this.angle++;

            if(this.angle > 3){
                this.angle = 0;
            }
        }
    }

}
