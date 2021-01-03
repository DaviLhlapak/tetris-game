import Form from "./models/form";

import KeyboardListener from "./listeners/keyboard-listener";

import { formAcceptedMoves } from './config/controllers';
import { formsPatern } from './config/forms';

import { generateNumber } from './utils/functions'

export interface Game{
    startGame(): void,
    points: number
}

interface GameState{
    isPlaying: boolean,
    prevForms: Array<Form>,
    forms: Array<Form>,
    velocity: number,
    points: number,
    gameTime: NodeJS.Timeout
}

export function createGame(screen: HTMLCanvasElement, preview: HTMLCanvasElement, pointsCallback: (value: number) => void): Game{

    const keyboard = KeyboardListener(document);
    const mainContext = screen.getContext('2d');
    const previewContext = preview.getContext('2d');

    const state: GameState = {
        isPlaying: false,
        prevForms: [],
        forms: [],
        velocity: 300,
        points: 0,
        gameTime: null,
    };
    
    function startGame(){
        keyboard.subscribe(moveForm)

        state.isPlaying = true;
        generateForm();

        renderScreen();

        state.gameTime = setInterval(update,state.velocity)
    }

    function stopGame() {
        state.isPlaying = false;
        clearInterval(state.gameTime);
    }

    function update() {
        let form = state.forms[state.forms.length - 1];
        
        form.verifyEnabled(state.forms);

        if (form.enabled) {
            form.update();
        } else {
            if (form.outOfScreen()) {
                stopGame()
            }

            let lines: number = verifyLine();
            state.points += lines * 100;

            pointsCallback(state.points)
            
            generateForm();
        }
    }

    function verifyLine(): number {
        let linesDeleted = 0;

        for (let y = 0; y < screen.height; y += 20) {
            let line: number = 0;

            state.forms.forEach(form => {
                form.squares.forEach(square => {
                    if(square.y == y){
                        line++;
                    }
                });
            });

            if (line == 10) {
                linesDeleted++;
                state.forms.forEach(form => {
                    form.deleteSquare(y);
                });
            }
        }

        return linesDeleted;
    }

    function generateForm() {
        while (state.prevForms.length < 2) {
            let piece = generateNumber(formsPatern.length - 1);

            let x = 0;

            do {
                x = generateNumber(formsPatern[piece].max);
            } while (x%20 !== 0);

            let form = new Form(state.forms.length + state.prevForms.length,x,-20,piece,formsPatern[piece].image, screen.width);
            form.generateSquares();

            state.prevForms.push(
                form
            )
        }

        state.forms.push(
            state.prevForms.shift()
        );
    }

    function renderScreen(){
        mainContext.clearRect(0,0,screen.width,screen.height)

        updatePreview();

        state.forms.forEach(elem => {
            elem.draw(mainContext)
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

    function updatePreview() {
        previewContext.clearRect(0, 0, preview.width, preview.height)

        state.prevForms.forEach((form) => {
            let previewForm = new Form(0,20,80,form.formCode,form.color,0)
            previewForm.generateSquares();
            previewForm.draw(previewContext)
        })
    }

    return {
        startGame,
        points: state.points
    }
}
