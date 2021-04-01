var userName;
var size = 10;//step de la un pixel la altul
var milliseconds = 100;//1 secunda
var speed = 100;
var colors = ['blue', 'red', 'green', 'black', 'purple', 'pink', 'yellow', 'brown', 'orange'];
let color = {'snake': '','food': ''};//culori snake si food
var viewScore = "Score \n\n";
let db = openDatabase('MySnakeGame', '1.0', 'DB', 2 * 1024 * 1024);
let snakePoint = {'x':'', 'y': ''};
let foodPoint = {'x':'', 'y': ''};

let eatSound=document.getElementById("myAudio"); 
 
 /* var database=(function(){
	  function openDB(){
		  database.openDatabase('MySnakeGame', '1.0', 'DB', 2 * 1024 * 1024);
	  }
	  function createTable(){
		  database.transaction(function(tx){
tx.executeSql('CREATE TABLE IF NOT EXISTS USER (ID INTEGER PRIMARY KEY, name TEXT, score INTEGER)');
});
	  }
	  function viewScore(){
		  database.transaction(function(tx){
    tx.executeSql('SELECT name, score FROM USER Order by score desc', [], function(tx, result){
        var rows = result.rows;
        var i = 0;
        while(i < rows.length && i < 5){
           viewScore += rows[i].name + " --> " + rows[i].score + "\n";
            i ++;  
        }
    });
}, null);
	  }
	  
	   return {
        openData: openDB,
        table: createTable,
        score: viewScore
    };
  })();
*/

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

function awake(){
    canvas = document.getElementById('base');
    context = canvas.getContext('2d');
  start();
    enterName();
	
}


/*var upload=(function(){
    canvas = document.getElementById('base');
    context = canvas.getContext('2d');
	
   function updateSnake(){//verificam daca cel putin un element din snake verifica killedHimself
    if(snake.some(killedHimself)){
        //dead();
        return 0;
    }
   snake.push([snakePoint['x'], snakePoint['y']]);	
    context.fillStyle = color['snake'];	
    context.fillRect(snakePoint['x'], snakePoint['y'], size, size);
   
}
   function start(){
	snake = [];
    foodPoint = [];
    length = 3;
    snakePoint = {'x': 250, 'y': 250};
    direction = 'right';   
    context.clearRect(0, 0, canvas.width, canvas.height);
    isPaused = false;
    color['snake'] = '#000000';
    
   updateSnake();
   

    timer = setInterval(function(){
        move(direction);
    },milliseconds);
	   
   }
   //enterName();
   }
   return{
	   first:start,
	   second:updateSnake
	   //second:name
   };
})();
	*/
	function start(){
    snake = [];
    foodPoint = [];
    length = 3;
    snakePoint = {'x': 250, 'y': 250};
    direction = 'right';   
    context.clearRect(0, 0, canvas.width, canvas.height);
    isPaused = false;
    color['snake'] = '#000000';
    
  
    setScore();
    updateSnake();
    food();
   

    timer = setInterval(function(){
        move(direction);
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
    document.getElementById('score').innerText = length - 3;
}

function setSpeed(){
    clearInterval(timer);
    timer = setInterval(function(){
            move(direction);
    },milliseconds);

    document.getElementById('milli').innerText = speed;	
}

function continueGame(){
    timer = setInterval(function() { 
        move(direction);}, milliseconds);
    isPaused = false;
}

function foodRespawnSnake(snake){
    return (snake[0] === foodPoint['x'] && snake[1] === foodPoint['y']);
}

function food(){
    foodPoint = {'x': Math.floor(Math.random() * (canvas.width / size)) * size,
             'y': Math.floor(Math.random() * (canvas.height / size)) * size};

    if(snake.some(foodRespawnSnake)){
		eatSound.play();
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


function move(direction){
    if(direction === 'left'){
        if(position(direction) >= 0)//daca nu ne lovim de perete in stanga
            executeDirection(direction, 'x', position(direction));
        else
            //dead();
			executeDirection(direction,'x',position(direction)+750);
    }else if(direction === 'right'){// daca nu am depasit dimensiunea ferestrei, adica daca nu ne-am lovit de peretele drept
        if(position(direction) < (canvas.width))
            executeDirection(direction, 'x', position(direction));
        else
            //dead();  
            executeDirection(direction,'x',position(direction)-750);			
    }else if(direction === 'up'){
        if(position(direction) >= 0)//daca nu ne am lovit de peretele de sus
            executeDirection(direction, 'y', position(direction));
        else
            //dead(); 
			executeDirection(direction,'y',position(direction)+500);
    }else if(direction === 'down'){
        if(position(direction) < canvas.height)
            executeDirection(direction, 'y', position(direction));
        else
            //dead();
			executeDirection(direction,'y',position(direction)-500);
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
	//dead.play();
    isPaused = true;
    document.write('<center><h3>"You died"</h3><img src="deadGif.gif" usemap="#dead"><map name="dead"><area shape="rect" coords="500,556,810,590" href="easy.html"><area shape="rect" coords="1000,556,1100,590" href="index.html"></map></center> <script type= "text/javascript" src="javascript/snakeDead.js"></script>');
}

function pause(){
    clearInterval(timer);//oprim timerul
    isPaused = true;
}

function continueGame(){
    timer = setInterval(function() { 
        move(direction);}, milliseconds);
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