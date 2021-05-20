var database;
var dog;
var foodStock;
var foodLeft;
var feedHour, fedHour;
var feedMinute, fedMinute;
var backgroundImg;
var currentHour;
var readState, gameState

function preload() {
  dogImg = loadImage("images/dog.png")
  doghappyImg = loadImage("images/happydog.png")
}

function setup() {
  createCanvas(500, 600);
  database = firebase.database();

  feedHour = database.ref('feedHour');
  feedHour.on("value", function (data) {
    fedHour = data.val();
  });

  readState = database.ref('GameState');
  readState.on("value", function (data) {
    gameState = data.val();
  });

  feedMinute = database.ref('feedMinute');
  feedMinute.on("value", function (data) {
    fedMinute = data.val();
  });

  foodObj = new Food();
  backgroundImg = new Food();

  dog = createSprite(250, 400, 10, 10)
  dog.addImage(dogImg, "dog")
  dog.scale = 0.2;

  foodStock = database.ref('Food')
  foodStock.on("value", readStock)

  feedButton = createButton("Feed The Dog")
  feedButton.position(620, 17.5)
  feedButton.mousePressed(feedDog)

  addFoodButton = createButton("Add Food")
  addFoodButton.position(745, 17.5)
  addFoodButton.mousePressed(addFood)

  currentHour = hour()
}


function draw() {

  background(46, 139, 87)

  GameStates()

  textSize(15)
  fill("white")

  if (fedHour < currentHour) {

    if (fedHour > 12) {
      text("Last Fed : " + fedHour % 12 + ":" + fedMinute + " PM", 20, 22);
    }
    else if (fedHour == 12) {
      text("Last Fed : 12" + ":" + fedMinute + " PM", 20, 22)
    }
    else if (fedHour == 0) {
      text("Last Fed : 12:" + fedMinute + " AM", 20, 22);
    }
    else {
      text("Last Fed : " + fedHour + ":" + fedMinute + " AM", 20, 22);
    }
  }

  drawSprites();

}

function readStock(data) {
  foodLeft = data.val();
  foodObj.updateFoodStock(foodLeft)
}

function feedDog() {

  if (foodLeft > 1) {
    foodLeft = foodLeft - 1
  }

  database.ref('/').update({
    Food: foodLeft,
    feedHour: hour(),
    feedMinute: minute(),
  })
}

function addFood() {

  if (foodLeft < 20)
    foodLeft = foodLeft + 1

  database.ref('/').update({
    Food: foodLeft
  })
}

function gameStateRef() {
  database.ref('/').update({
    GameState: gameState,
  })
}

function GameStates() {

  if (fedHour == currentHour) {
    backgroundImg.bedroomBackground()
    textSize(35)
    fill("black")
    text("The Dog is sleeping", 80, 190)
    text("You can feed it after 4 hours", 25, 230)
    gameState = "sleeping"
    gameStateRef()
  }

  if (fedHour + 1 == currentHour) {
    console.log(fedHour, currentHour);
    backgroundImg.gardenBackground()
    textSize(35)
    fill("black")
    text("The Dog is sleeping", 80, 190)
    text("You can feed it after 3 hours", 25, 230)
    gameState = "playing"
    gameStateRef()
  }

  if (fedHour + 2 <= currentHour && fedHour + 4 > currentHour) {
    backgroundImg.washroomBackground()
    textSize(35)
    fill("black")
    text("The Dog is sleeping", 80, 190)
    text("You can feed it after 2 hours", 25, 230)
    gameState = "bathing"
    gameStateRef()
  }

  if (fedHour + 4 <= currentHour) {
    gameState = "hungry"
    gameStateRef()
  }

  if (fedHour > currentHour) {
    textSize(15)
    fill("white")
    text("Last Fed : Yesterday", 20, 22);
    gameState = "hungry"
    gameStateRef()
  }

  if (gameState != "hungry") {
    feedButton.hide()
    addFoodButton.hide()
    dog.visible = false
  }

  else {
    feedButton.show()
    addFoodButton.show()
    foodObj.display()
    dog.visible = true
    textSize(25)
    fill("black")
    text("The Dog is Hungry, Feed it.",90,540)
  }
}
