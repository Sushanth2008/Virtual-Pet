class Food {
    constructor() {
        this.foodStock = 0;
        this.lastFed;
        this.image = loadImage('images/Milk.png');
        this.bedroom=loadImage('images/Bed Room.png');
        this.garden=loadImage('images/Garden.png');
        this.washroom=loadImage('images/Wash Room.png')
    }

    updateFoodStock(foodStock) {
        this.foodStock = foodStock;
    }

    bedroomBackground(){
        background(this.bedroom);
    }

    gardenBackground(){
        background(this.garden);
    }

    washroomBackground(){
        background(this.washroom);
    }

    display() {
        var x = 80, y = 75;

        if (this.foodStock != 0) {
            for (var i = 0; i < this.foodStock; i++) {
                if (i % 10 == 0) {
                    x = 80;
                    y = y + 50;
                }

                image(this.image, x, y, 50, 50);
                x = x + 30;
            }
        }
    }

}

