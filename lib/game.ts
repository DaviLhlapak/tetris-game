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
        generateForm();

        renderScreen();

        setInterval(update,state.velocity)
    }

    function update(){
        let form = state.forms[state.forms.length - 1];
        
        form.verifyEnabled(state.forms);

        if (form.enabled) {
            form.update();
        } else {
            verifyLine();
            generateForm();
        }
    }

    function verifyLine() {
        
        for (let y = 0; y < screen.height; y += 20) {
            let line: number = 0;

            state.forms.forEach(form => {
                form.squares.forEach(square => {
                    if(square.y == y){
                        line++;
                    }
                });
            });

            if(line == 10){
                state.forms.forEach(form => {
                    form.deleteSquare(y);
                });
            }
        }

    }

    function generateForm(){
        let piece = generateNumber(formsPatern.length - 1);

        let x = 0;

        do {
            x = generateNumber(formsPatern[piece].max);
        } while (x%20 !== 0);

        let form = new Form(state.forms.length,x,-20,piece,formsPatern[piece].image, screen.width);
        form.generateSquares();

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
