var userName;
var size = 10;//step de la un pixel la altul
var milliseconds = 100;//1 secunda
var speed = 100;
var colors = ['blue', 'red', 'green', 'black', 'purple', 'pink', 'yellow', 'brown', 'orange'];
let color = {'snake': '','food': ''};
var viewScore = "Score \n\n";
var context;	
var generateFood=setInterval(food, 10000);
let snakePoint = {'x':'', 'y': ''};
let foodPoint = {'x':'', 'y': ''};
var wall=[];
var wall1=[];
var wall2=[];
let wallSize = 10;
let movingWallPoint = {'x': 150, 'y': 150};
let movingWallPoint1 = {'x':520,'y':420};
let movingWallPoint2 = {'x':340,'y':280};
let db = openDatabase('MySnakeGame', '1.0', 'DB', 2 * 1024 * 1024);

db.transaction(function(tx){
tx.executeSql('CREATE TABLE IF NOT EXISTS USER (ID INTEGER PRIMARY KEY, name TEXT, score INTEGER)');
});

db.transaction(function(tx){
    tx.executeSql('SELECT name, score FROM USER Order by score desc', [], function(tx, result){
        var rows = result.rows;
        var i = 0;
        while(i < rows.length && i < 5){
           viewScore += rows[i].name + " --> " + rows[i].score + "\n";
            i ++;  
        }
    });
}, null);

var keyCodes =
{
    '72': function() {//H
        window.open('help.html');
        pause();
        
    },
    '13': function() {//Enter pentru incepere joc nou
        window.location.reload();
        clearInterval(timer);
		clearInterval(timer2);
        isPaused = true;
        start();
    },
    '27': function() {//Escape pentru pauza
        if(isPaused){
            continueGame();
        }else{
            pause();
        }
    },
    '90': function() {//z pentru a creste viteza
        milliseconds -= 5;
        speed += 15;
        setSpeed();
    },  
    '88': function() {//x pentru a scadea viteza
        if(speed>50){
            milliseconds += 5;    
            speed -= 15;
            setSpeed();
        }
    },
    '65': function() {//l
        if(direction !== 'right' && !isPaused)
            move('left');
    },
    '87': function() {//w
        if(direction !== 'down' && !isPaused)
            move('up');
    },
    '68': function() {//d
        if(direction !== 'left' && !isPaused)
            move('right');
    },
    '83': function() {//s
        if(direction !== 'up' && !isPaused)
            move('down');
    },
    '82': function() {//R afiseaza scorurile
       windowRecord();
    }
};

function awakeExpert(){
    canvas = document.getElementById('base4');
    context = canvas.getContext('2d');
  start();
    enterName();
	
}
function drawWall(){
	
	for(let i = 0; i < wallSize; i++) {
		wall.push([movingWallPoint['x'], movingWallPoint['y'] + i * size]);	
		context.fillStyle = color['wall'];	
		context.fillRect(movingWallPoint['x'], movingWallPoint['y'] + i * size, size, size);
	//}
	
	//for(let i = 0; i < wallSize; i++) {
		wall1.push([movingWallPoint1['x'], movingWallPoint1['y'] + i * size]);	
		context.fillStyle = color['wall1'];	
		context.fillRect(movingWallPoint1['x'], movingWallPoint1['y'] + i * size, size, size);
		
		wall2.push([movingWallPoint2['x'], movingWallPoint2['y'] + i * size]);	
		context.fillStyle = color['wall2'];	
		context.fillRect(movingWallPoint2['x'], movingWallPoint2['y'] + i * size, size, size);
	}
}

function updateMovingWall() {
	for(let i = 0; i < wallSize; i++) {
		wall.shift();
		wall1.shift();
		wall2.shift();
	}
		
	context.clearRect(movingWallPoint['x'], movingWallPoint['y'], size, size);
	movingWallPoint['y'] = (movingWallPoint['y'] + size) % 500;
	
	context.clearRect(movingWallPoint1['x'], movingWallPoint1['y'], size, size);
	movingWallPoint1['y'] = (movingWallPoint1['y'] + size) % 500;
	
	context.clearRect(movingWallPoint2['x'], movingWallPoint2['y'], size, size);
	movingWallPoint2['y'] = (movingWallPoint2['y'] + size) % 500 ;
	
	for(let i = 0; i < wallSize; i++) {

		wall.push([movingWallPoint['x'], (movingWallPoint['y'] + i * size) % 500]);
		context.fillStyle = color['wall'];	
		context.fillRect(movingWallPoint['x'], (movingWallPoint['y'] + i * size) % 500, size, size);

        wall1.push([movingWallPoint1['x'], (movingWallPoint1['y'] + i * size) % 500]);
		context.fillStyle = color['wall1'];	
		context.fillRect(movingWallPoint1['x'], (movingWallPoint1['y'] + i * size) % 500, size, size);
		
		 wall2.push([movingWallPoint2['x'], (movingWallPoint2['y'] + i * size) % 500]);
		context.fillStyle = color['wall2'];	
		context.fillRect(movingWallPoint2['x'], (movingWallPoint2['y'] + i * size) % 500 , size, size);

	}
	
}

function start(){
   snake = [];
    foodPoint = [];
    length = 3;
    snakePoint = {'x': 250, 'y': 250};
    direction = 'right';   
    //context.clearRect(0, 0, canvas.width, canvas.height);
    isPaused = false;
    color['snake'] = '#000000';
    color['wall'] = '#ff0afb';
	color['wall1'] = '#ff0afb';
	color['wall2'] = '#ff0afb';
  
    setScore();
    updateSnake();
    food();
   

    timer = setInterval(function(){
        move(direction);
    },milliseconds);
	
	timer2 = setInterval(function(){
        updateMovingWall();
    },milliseconds);
}

function enterName(){
    do {
        userName = prompt ("Name to start the game:");
        } while (userName == null || userName == "");

        if(userName.length > 10)
            userName = userName.substring(0,10);
}

function windowRecord(){
    alert(viewScore);//fereasta care afiseaza scorurile
}



function updateSnake(){//verificam daca cel putin un element din snake verifica killedHimself
    if(snake.some(killedHimself)){
        dead();
        return 0;
    }
    snake.push([snakePoint['x'], snakePoint['y']]);	
    context.fillStyle = color['snake'];	
    context.fillRect(snakePoint['x'], snakePoint['y'], size, size);
   
    updateSnakeLength();
    snakeFed();
}



function killedHimself(snake){
    return (snake[0] === snakePoint['x'] && snake[1] === snakePoint['y']);
}

function setScore(){
    document.getElementById('scoreExp').innerText = length - 3;
}

function setSpeed(){
    clearInterval(timer);
    timer = setInterval(function(){
            move(direction);
    },milliseconds);
	clearInterval(timer2);
	timer2 = setInterval(function(){
        updateMovingWall();
    },milliseconds);
    document.getElementById('milliExp').innerText = speed;	
}

function continueGame(){
    timer = setInterval(function() { 
        move(direction);}, milliseconds);
		timer2 = setInterval(function(){
        updateMovingWall();
    },milliseconds);
    isPaused = false;
}

function foodRespawnSnake(snake){
    return (snake[0] === foodPoint['x'] && snake[1] === foodPoint['y']);
}

function food(){
	context.clearRect(foodPoint['x'], foodPoint['y'], canvas.width, canvas.height);
	drawWall();
    foodPoint = {'x': Math.floor(Math.random() * (canvas.width / size)) * size,
				 'y': Math.floor(Math.random() * (canvas.height / size)) * size};
				 if(foodOverWall(food)){
					 food();
				 }

    if(snake.some(foodRespawnSnake)){
		
        food();
    }   
    else{	
        color['food'] = colors[Math.floor(Math.random() * colors.length)];
        context.fillStyle = color['food'];
        context.fillRect(foodPoint['x'], foodPoint['y'], size, size);
    }
}

function snakeFed(){
    if(snakePoint['x'] === foodPoint['x'] && snakePoint['y'] === foodPoint['y']){	

        color['snake'] = color['food'];
        length++;
        setScore();
        food();
    }	
}

function updateSnakeLength(){
    if(snake.length > length){
        body = snake.shift();
        context.clearRect(body[0], body[1], size, size);
    }
}

function hit(snake){
	//console.log(wall1[0]);
	for( i = 0; i < wall.length; i++){
		//console.log("M am bagat in perete");
		if((wall[i][0] == snake[0] && wall[i][1] == snake[1]) ) {
			//console.log("M am bagat in perete");
		return true;}
		//console.log(wall[i] + ' ' + snake[0] + ' ' + snake[1]); 
        if((wall1[i][0] == snake[0] && wall1[i][1] == snake[1])){
			//console.log("M am bagat in perete");
			return true;
		}
		if((wall2[i][0] == snake[0] && wall2[i][1] == snake[1])){
			//console.log("M am bagat in perete");
			return true;
		}
	}
	
	return false;
}
function foodOverWall(food){
	//console.log(wall[0]);
	for( i = 0; i < wall.length; i++){
		if(wall[i][0] == foodPoint['x'] && wall[i][1] == foodPoint['y'] ) {
			return true;	
		}
	}
	return false;
}
function move(direction){
    if(direction === 'left'){
        if(position(direction) >= 0 )
			 if( hit(snake[snake.length-1]))
				dead();
			else
				executeDirection(direction, 'x', position(direction));
		else dead();
    }else if(direction === 'right'){// daca nu am depasit dimensiunea ferestrei, adica daca nu ne-am lovit de peretele drept
        if(position(direction) < (canvas.width) )
			if( hit(snake[snake.length-1]))
				dead();
			else
				executeDirection(direction, 'x', position(direction));
        else dead();  
    }else if(direction === 'up'){
        if(position(direction) >= 0) //daca nu ne am lovit de peretele de sus
		 if( hit(snake[snake.length-1]) )
			dead(); 
        else
            executeDirection(direction, 'y', position(direction));
		else dead();	
    }else if(direction === 'down'){
        if(position(direction) < canvas.height)
		
			if( hit(snake[snake.length-1]))
				dead();
			else
				executeDirection(direction, 'y', position(direction));
		else dead();	
    }	
}


function position(direction){
    if(direction === 'left')
        newPosition = snakePoint['x'] - size;
    else if(direction === 'right')
        newPosition = snakePoint['x'] + size;
    else if(direction === 'up')
        newPosition = snakePoint['y'] - size;    
    else if(direction === 'down'){
        newPosition = snakePoint['y'] + size;	
    }
    return newPosition;	
}

function executeDirection(direction, axis, value){
    this.direction = direction;
    snakePoint[axis] = value;
    updateSnake();
}

function dead(){
    dataBaseNewUser();//verificam daca exista sau nu userul si facem update la tabela de scor
    clearInterval(timer);
	clearInterval(timer2);
	//dead.play();
    isPaused = true;
    document.write('<center><h3>"You died"</h3><img src="deadGif.gif" usemap="#dead"><map name="dead"><area shape="rect" coords="500,556,810,590" href="expert.html"><area shape="rect" coords="1000,556,1100,590" href="index.html"></map></center> <script type= "text/javascript" src="javascript/snakeDead.js"></script>');
}

function pause(){
    clearInterval(timer);//oprim timerul
	clearInterval(timer2);//oprim timerul
    isPaused = true;
}

function continueGame(){
    timer = setInterval(function() { 
        move(direction);}, milliseconds);
		timer2 = setInterval(function(){
        updateMovingWall();
    },milliseconds);
    isPaused = false;
}

document.onkeydown = function(event){
    keyCode = window.event.keyCode;//luam tasta pe care am apasat
    keyCodes.hasOwnProperty(keyCode) && keyCodes[keyCode]();//vedem daca se potriveste 
};

function dataBaseNewUser(){
    var newRecord = length - 3;
    db.transaction(function(tx){
        tx.executeSql('SELECT name, score FROM USER WHERE name=? Order by score desc', [userName], function(tx, result){
            if(result.rows.length == 0){
                tx.executeSql('INSERT INTO USER (name, score) VALUES(?, ?)', [userName, newRecord]);
            }else{
                if(result.rows[0].score < newRecord)
                    tx.executeSql('UPDATE USER SET score=? WHERE name=?', [newRecord,userName]);
            }
        });
    });
}