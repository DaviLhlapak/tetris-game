export default function createKeyboardListener(document: HTMLDocument) {
    const state = {
        observers: []
    }

    function subscribe(observerFunction: Function){
        state.observers.push(observerFunction);
    }

    function notifyAll(command: object){
        for(const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    document.addEventListener("keydown", handleKeyDown);

    function handleKeyDown(event: KeyboardEvent){
        const keyPress = event.key;
        
        const command = {
            keyPressed: keyPress
        }

        notifyAll(command)
    }

    return{
        subscribe
    }
}