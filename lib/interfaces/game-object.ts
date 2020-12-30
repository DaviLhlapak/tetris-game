export default interface GameObject{
    id: number,
    draw(drawer: CanvasRenderingContext2D): void,
    update(): void
}