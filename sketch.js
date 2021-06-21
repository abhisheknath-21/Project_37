var dog, dog1;
var happyDog, happyDog1;
var database;
var foodS;
var foodStock;
var feedDog;
var addFoods;
var fedTime;
var lastFed;
var bedroom;
var garden;
var washroom;
var sadDog;
var gameState;
var changeState;
var readeState;

function preload()
{
	dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  sadDog = loadImage("images/deadDog.png");
}

function setup() {
  database=firebase.database();
	createCanvas(500, 700);

  dog1 = createSprite(250, 550, 50, 50);
  dog1.addImage(dog);
  dog1.scale = 0.2;

  foodStock=database.ref('Food');
  foodStock.on("value", function(data){
     foodS = data.val();
  });

  foodObj = new Food( );

  feed=createButton("Feed the Dog");
  feed.position(600, 65);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(720, 65);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });


}


function draw() {  
  
  background(46, 139, 87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })

  if(gameState!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog1.remove();
  }else{
    feed.show();
    addFood.show();
    dog1.addImage(sadDog);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
    }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
    }else if(currentTime>(lastFed+2)  &&  currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
    }else{ 
      update("Hungry");
      foodObj.display();
    }

  drawSprites();

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>= 12){
    text("Last  Feed  :  "  + lastFed%12  + "  PM"  ,  50, 30);
 }else if(lastFed==0){
     text("Last  Feed :  12 AM", 50, 30);
    }else{
     text("Last Feed :  "  + lastFed +  "  AM" , 50, 30);
    }
}


function feedDog(){
  dog1.addImage(happyDog); 

  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val*0);
    }else{
      foodObj.updateFoodStock(food_stock_val-1);

  }
      database.ref('/').update({
      Food : foodObj.getFoodStock(),
      FeedTime : hour()
     })
 }

/*function feedDog(){
    dog1.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock(-1));
    database.ref(' / ').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour()
      }) 
}*/

function  addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}

function update(State){
  database.ref('/').update({
    gameState: State
   } );
}
