import Form from "./models/form";

import KeyboardListener from "./listeners/keyboard-listener";

import { formAcceptedMoves } from './config/controllers';
import { formsPatern } from './config/forms';

import { generateNumber } from './utils/functions'

export interface Game{
    startGame(): void
}

interface GameState{
    isPlaying: boolean,
    forms: Array<Form>,
    velocity: number,
}

export function createGame(screen: HTMLCanvasElement){

    const keyboard = KeyboardListener(document);
    const context = screen.getContext('2d');

    const state: GameState = {
        isPlaying: false,
        forms: [],
        velocity: 300,
    };
    
    function startGame(){
        keyboard.subscribe(moveForm)

        state.isPlaying = true;
        generateSquare();

        renderScreen();

        setInterval(update,state.velocity)
    }

    function update(){
        let form = state.forms[state.forms.length - 1];
        
        let collid = form.isColliding(state.forms);

        if(collid){
            verifyLine();
            
            generateSquare();
        }else{
            form.update()
        }
    }

    function verifyLine(){
        let line: number;
        let y: number;

        state.forms.forEach(form1 => {
            form1.squares.forEach(square1 => {
                state.forms.forEach(form2 => {
                    form2.squares.forEach(square2 => {
                        if(square1.y == square2.y){
                            line++;
                        }
                    });
                }); 

            
                if(line == 10){
                    y = square1.y;
                    
                    state.forms.forEach(form => {
                        form.deleteSquare(y);
                    });
                }
    
                line = 0;
            });
        });


    }

    function generateSquare(){

        let piece = generateNumber(formsPatern.length - 1);

        let x = generateNumber(formsPatern[piece].max);

        while (x%20 !== 0) {
            x = generateNumber(formsPatern[piece].max);
        }

        let form = new Form(state.forms.length,x,-20,piece,formsPatern[piece].image);
        form.create();

        state.forms.push(
            form
        );
    }

    function renderScreen(){
        context.clearRect(0,0,screen.width,screen.height)

        state.forms.forEach(elem => {
            elem.draw(context)
        });

        requestAnimationFrame(renderScreen);
    }

    function moveForm(command: any){
        let form = state.forms[state.forms.length - 1]; 

        const keyPressed = command.keyPressed;
        const moveFunction = formAcceptedMoves[keyPressed];
       
        if(moveFunction){
            moveFunction(form, state.forms);
        }

    }

    return {
        startGame,
    }
}
