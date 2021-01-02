import Form from "../models/form";

export const formAcceptedMoves = {
    ArrowLeft(form: Form, forms: Array<Form>) {
        form.move("left", forms);
    },
    ArrowRight(form: Form, forms: Array<Form>){
        form.move("right", forms);
    },
    ArrowUp(form: Form, forms: Array<Form>){
        form.rotate(forms)
    },
    ArrowDown(form: Form, forms: Array<Form>){
        form.move("down",forms)
    }
}
