import GameObject from '../interfaces/game-object';
import Square from './square';

export default class Form implements GameObject{
    
    id: number;
    initialX: number;
    initialY: number;
    formCode: number;
    color: string;
    squares: Array<Square>;
    isMoving: boolean;
    cicles: {
        connected: object,
        disconnected: object,
    };

    constructor (id: number, x: number, y: number, formCode: number, color: string){
        this.id = id;
        this.initialX = x;
        this.initialY = y;
        this.formCode = formCode;
        this.color = color;
        this.squares = [];
        this.isMoving = false;
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

    move(command: string, collision: Array<Form>){
        let max = 200;

        this.isMoving = true;
        let needMove = true;

        switch(command){

            case "left":
                this.squares.forEach(element => {
                    if(element.x - element.size <= -20){
                        needMove = false;
                    }

                    let value = false;

                    collision.forEach(form => {
                        if(form.id != this.id){
                            let findedObj = form.squares.find((obj) => {return obj.x == element.x - element.size && obj.y == element.y});
                            if(findedObj != undefined){
                                value = true;
                            }
                        }
                    });

                    if(value){
                        needMove = false;
                    }
                });

                if(needMove){
                    this.squares.forEach(element => {
                        element.x -= element.size 
                    });
                }
                break;

            case "right":

                this.squares.forEach(element => {
                    if(element.x + element.size == max){
                        needMove = false;
                    }

                    let value = false;

                    collision.forEach(form => {
                        if(form.id != this.id){
                            let findedObj = form.squares.find((obj) => {return obj.x == element.x + element.size && obj.y == element.y});
                            if(findedObj != undefined){
                                value = true;
                            }
                        }
                    });
                    ;

                    if(value){
                        needMove = false;
                    }
                });

                if(needMove){
                    this.squares.forEach(element => {
                        element.x += element.size 
                    });
                }
                break;
        }

        this.isMoving = false;
    }

    draw(drawer: CanvasRenderingContext2D){
        this.squares.forEach(element => {
            element.draw(drawer);
        });
    }

    update(){
        if(!this.isMoving){
            this.squares.forEach(element => {
                element.update();
            });
        }
    }

    downSquares(y: number){
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

    isColliding(collision: Array<Form>){
        let generate = false;

        this.squares.forEach(square => {

            if(square.y + square.size >= 400){
                this.squares.forEach(element2 => {
                    element2.stop();
                });
                
                generate = true;
            }

            let value = false;

            collision.forEach(form => {
                if(form.id != this.id){
                    let findedObj = form.squares.find((element) => {return element.x == square.x && element.y == square.y + square.size;});
                    if(findedObj != undefined){
                        value = true;
                    }
                }
            });


            if(value){

                this.squares.forEach(element2 => {
                    element2.stop();
                });

                generate = true;
            }
        });
        
        return generate;
    }

    create(){
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

    rotate(collision: Array<Form>){

        if(this.formCode == 6 || this.formCode == 2){
            return;
        }

        let max = 200;
        let rotateEnabled = true;

        this.squares.forEach(element => {
            if(!element.rotateEnabled){
                if(element.x - element.size <= -20){
                    rotateEnabled = false;
                    return;
                }
                if(element.x + element.size == max){
                    rotateEnabled = false;
                    return;
                }
            }
        });

        if(rotateEnabled){
            
            let value = false;
            let oldSquares = [];

            this.squares.forEach(element => {

                oldSquares.push(element);

                let angle = element.angle;
                let connected = element.connected;
                
                if(connected){
                    element.rotate(this.cicles.connected[angle].x,this.cicles.connected[angle].y);
                }else{
                    element.rotate(this.cicles.disconnected[angle].x,this.cicles.disconnected[angle].y);
                }


            });

            this.squares.forEach(element => {
                collision.forEach(form => {
                    if(form.id != this.id){
                        let findedObj = form.squares.find((obj) => {return obj.x == element.x && obj.y == element.y});
                        if(findedObj != undefined){
                            value = true;
                            console.log(`Colidiu com objeto`);
                        }
                    }
                });
            });

            if(value){
                this.squares = oldSquares;
            }
        
        }
    }
};

