import GameObject from '../interfaces/game-object';
import Square from './square';

export interface FormCollisions{
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean
}

export default class Form implements GameObject{
    
    id: number;
    initialX: number;
    initialY: number;
    formCode: number;
    color: string;
    squares: Array<Square>;
    isMoving: boolean;
    enabled: boolean;
    max: number;
    cicles: {
        connected: object,
        disconnected: object,
    };

    constructor (id: number, x: number, y: number, formCode: number, color: string, max: number){
        this.id = id;
        this.initialX = x;
        this.initialY = y;
        this.formCode = formCode;
        this.color = color;
        this.max = max;
        this.squares = [];
        this.isMoving = false;
        this.enabled = true;
        this.cicles = {
            connected: [
                {x:20,y:20},
                {x:-20,y:20},
                {x:-20,y:-20},
                {x:20,y:-20},
            ],
            disconnected: [
                {x:-40,y:0},
                {x:0,y:-40},
                {x:40,y:0},
                {x:0,y:40},
            ]
        };
    }

    generateSquares(){
        switch(this.formCode){
            case 0:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color,3,true,true),
                    new Square(this.id,this.initialX + 20,this.initialY,20,this.color,0,false, true),
                    new Square(this.id,this.initialX + 40,this.initialY,20,this.color,1,true, true),
                    new Square(this.id,this.initialX + 20,this.initialY - 20,20,this.color,0,true,true),
                );
                break;
            case 1:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color,1,true,false),
                    new Square(this.id,this.initialX,this.initialY - 20,20,this.color,3,true,true),
                    new Square(this.id,this.initialX + 20,this.initialY - 20,20,this.color,0,false,true),
                    new Square(this.id,this.initialX + 20,this.initialY - 40,20,this.color,0,true,true),
                );
                break;
            case 2:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color, 0, false, false),
                    new Square(this.id,this.initialX,this.initialY - 20,20,this.color, 0, false, false),
                    new Square(this.id,this.initialX,this.initialY - 40,20,this.color, 0, false, false),
                    new Square(this.id,this.initialX,this.initialY - 60,20,this.color, 0, false, false),
                );
                break;
            case 3:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color, 3, true, true),
                    new Square(this.id,this.initialX + 20,this.initialY,20,this.color, 0, false, true),
                    new Square(this.id,this.initialX + 40,this.initialY,20,this.color, 1, true, true),
                    new Square(this.id,this.initialX + 40,this.initialY - 20,20,this.color, 3, true, false),
                );
                break;
            case 4:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color,2,true,true),
                    new Square(this.id,this.initialX,this.initialY - 20,20,this.color,0,false,true),
                    new Square(this.id,this.initialX,this.initialY - 40,20,this.color,0,true,true),
                    new Square(this.id,this.initialX + 20,this.initialY - 40,20,this.color, 3, true, false),
                );
                break;
            case 5:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color, 3, true, true),
                    new Square(this.id,this.initialX + 20,this.initialY,20,this.color,0, false, true),
                    new Square(this.id,this.initialX + 20,this.initialY - 20,20,this.color,0, true, true),
                    new Square(this.id,this.initialX + 40,this.initialY - 20,20,this.color, 3, true, false),
                );
                break;
            case 6:
                this.squares.push(
                    new Square(this.id,this.initialX,this.initialY,20,this.color, 0, false, false),
                    new Square(this.id,this.initialX,this.initialY - 20,20,this.color, 0, false, false),
                    new Square(this.id,this.initialX + 20,this.initialY,20,this.color, 0, false, false),
                    new Square(this.id,this.initialX + 20,this.initialY - 20,20,this.color, 0, false, false),
                );
                break;
        }

        this.squares.forEach(element => {
            element.start();
        });
    }

    draw(drawer: CanvasRenderingContext2D) {
        this.squares.forEach(element => {
            element.draw(drawer);
        });
    }

    update():void {
        if(!this.isMoving){
            this.squares.forEach(element => {
                element.update();
            });
        }
    }

    move(command: string, forms: Array<Form>){
        this.isMoving = true;
        let collisions = this.getCollisions(forms);

        switch(command){
            case "left":
                if (!collisions.left) {
                    this.squares.forEach(element => {
                        element.x -= element.size 
                    });
                }
                break;

            case "right":
                if (!collisions.right) {
                    this.squares.forEach(element => {
                        element.x += element.size 
                    });
                }
                break;
            
            case "down":
                if (!collisions.down) {
                    this.squares.forEach(element => {
                        element.y += element.size 
                    });
                }
                break;
        }

        this.isMoving = false;
    }

    rotate(forms: Array<Form>) {
        
        if(this.formCode == 6 || this.formCode == 2){
            return;
        }

        let rotateEnabled = true;

        this.squares.forEach(square => {
            let angle = square.angle;
            let connected = square.connected;
            let nextX = 0;
            let nextY = 0;
            
            if (connected) {
                nextX = this.cicles.connected[angle].x;
                nextY = this.cicles.connected[angle].y;
            } else {
                nextX = this.cicles.disconnected[angle].x;
                nextY = this.cicles.disconnected[angle].y;
            }

            if ((square.y + nextY) + square.size >= 420) {
                rotateEnabled = false;
            }
            if ((square.x + nextX) + square.size >= this.max + square.size) {
                rotateEnabled = false;
            }
            if ((square.x + nextX) - square.size <= -40) {
                rotateEnabled = false;
            }

            forms.forEach(form => {
                form.squares.forEach(obj => {
                    if (obj.id != square.id) {
                        if (obj.x == (square.x + nextX) && obj.y == (square.y + nextY)) {
                            rotateEnabled = false;
                        }
                        
                    }
                })
            })
        });

        if (rotateEnabled) {
            this.squares.forEach(square => {
                let angle = square.angle;
                let connected = square.connected;
                
                if(connected){
                    square.rotate(this.cicles.connected[angle].x,this.cicles.connected[angle].y);
                }else{
                    square.rotate(this.cicles.disconnected[angle].x,this.cicles.disconnected[angle].y);
                }
            });
        }
    }

    verifyEnabled(forms: Array<Form>) {
        let collisions = this.getCollisions(forms);

        if (collisions.down) {
            this.enabled = false;
        }
    }

    private downSquares(y: number){
        this.squares.forEach(square => {
            if(square.y < y){
                square.y = square.y + square.size;
            }
        })
    }

    deleteSquare(y: number){
        let newSquares = [];

        this.squares.forEach(square => {
            if(square.y != y){
                newSquares.push(square);
            }
        })

        this.squares = newSquares;

        this.downSquares(y);
    }

    private getCollisions(forms: Array<Form>): FormCollisions {
        
        let collisions: FormCollisions = {
            left: false,
            right: false,
            up: false,
            down: false,
        }

        this.squares.forEach(square => {
            if (square.y + square.size >= 400) {
                collisions.down = true;
            }
            if (square.x + square.size == this.max) {
                collisions.right = true;
            }
            if (square.x - square.size <= -20) {
                collisions.left = true;
            }

            forms.forEach(form => {
                if(form.id != this.id){
                    let findedObj = form.squares.find((obj) => {return obj.x == square.x - square.size && obj.y == square.y});
                    if(findedObj != undefined){
                        collisions.left = true;
                    }
                }
            });

            forms.forEach(form => {
                if(form.id != this.id){
                    let findedObj = form.squares.find((obj) => {return obj.x == square.x + square.size && obj.y == square.y});
                    if(findedObj != undefined){
                        collisions.right = true;
                    }
                }
            });

            forms.forEach(form => {
                if(form.id != this.id){
                    let findedObj = form.squares.find((element) => {return element.x == square.x && element.y == square.y + square.size;});
                    if(findedObj != undefined){
                        collisions.down = true;
                    }
                }
            });
        });


        return collisions;
    }

    outOfScreen(): boolean {
        let out = true;

        this.squares.forEach(square => {
            if (square.y > -20) {
                out = false;
            }
        })

        return out;
    }
    
};

