document.onkeydown = function(event){
    keyCode = window.event.keyCode;
    if(keyCode === 13)//escape
        window.location.reload();
};
