export default class Square {
    constructor(id, x, y, size, color, angle, rotate, connected) {
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
        
        this.draw = function (drawer) {
            this.img.src = this.color;
            drawer.drawImage(this.img, this.x, this.y)
        };

        this.start = function (){
            this.isMoving = true;
        }

        this.stop = function (){
            this.isMoving = false;
        }

        this.update = function (){
            if(this.isMoving){
                this.y += size
            }
        }

        this.rotate = function(x,y) {
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

}
