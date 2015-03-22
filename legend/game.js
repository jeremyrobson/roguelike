function get_maptree(map) {
    var html = "<ul>" + map.type;
    
    map.doors.forEach(function(door) {
        if (door.type == "entrance")
            html += "<li>" + get_maptree(door.submap) + "</li>";
    });
    
    html += "</ul>";
    return html;
}

var Game = function(canvas) {
    canvas.onmousedown = this.mouse_down.bind(this);
    canvas.onmousemove = this.mouse_move.bind(this);
    
    this.mode = new Map("world", null, 0, -1, -1);
    
    var maptree = document.getElementById("maptree");
    maptree.innerHTML = get_maptree(this.mode);
};

Game.prototype.mouse_down = function(e) {
    var mx = Math.floor(e.offsetX / 4);
    var my = Math.floor(e.offsetY / 4);
    this.mode = this.mode.mouse_down(mx, my);
};

Game.prototype.mouse_move = function(e) {
    var mx = Math.floor(e.offsetX / 4);
    var my = Math.floor(e.offsetY / 4);
    this.mode.mouse_move(mx, my);
};

Game.prototype.loop = function() {
    this.mode.loop();
    this.draw();
};

Game.prototype.draw = function() {
    context.fillStyle = "rgb(200,200,200)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    this.mode.draw(context);
};
