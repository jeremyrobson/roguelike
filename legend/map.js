function create_door(x, y, submap, type) {
    return {
        x: x,
        y: y,
        submap: submap,
        type: type,
        color: doortypes[type].color
    };
}

function create_tile(tiletype) {
    var newtile = clone(tileset[tiletype]);
    newtile.type = tiletype;
    if (Math.random() < newtile.prevalence) {
        var fringetype = select_random(newtile.fringelist);
        newtile.fringe = fringeset[fringetype];
    }
    return newtile;
}

function carve_path(map, template, startx, starty, endx, endy) {
    console.log("carving " + map.type);
    var x = startx;
    var y = starty;
    
    var xmove = [-1, 0, 1, 0];
    var ymove = [0, -1, 0, 1];
    for (var i=0; i<1000; i++) {
        var tiletype = select_random(template.tileset);
        map.tile[x][y] = create_tile(tiletype);
        
        if (map.tile[x][y-1] && map.tile[x][y-1].type == "blackness")
            map.tile[x][y-1] = create_tile(template["northwall"]);
        
        //todo
        if (template["border"] && map.tile[x-1] && map.tile[x-1][y] && map.tile[x-1][y].type == template["default"])
            map.tile[x-1][y] = create_tile(template["border"]);
        
        var randnum = randint(0, 4);
        x = wrap(x + xmove[randnum], map.width);
        y = wrap(y + ymove[randnum], map.height);
    }
}

function draw_tile(ctx, t, x, y) {
    ctx.fillStyle = t.color;
    ctx.fillRect(x*4,y*4,4,4);
}

var Map = function(type, parent, level) {
    var template = maptypes[type];
    this.type = type;
    this.width = randint(template.width.min, template.width.max);
    this.height = randint(template.height.min, template.height.max);
    
    this.doors = [];
    
    if (level < 5) {
        var submapcount = randint(template.submapcount.min, template.submapcount.max);
        submapcount = submapcount - level; //limit submaps based on level
        
        for (var i=0; i<submapcount; i++) {
            var submaptype = select_random(template.submapset);
            var x = randint(0, this.width);
            var y = randint(0, this.height);
            var newsubmap = new Map(submaptype, this, level+1, x, y);
            var door = create_door(x, y, newsubmap, "entrance");
            this.doors.push(door);
        }
    }
    
     //create exit
    if (parent) {
        var x = randint(0, this.width);
        var y = randint(0, this.height);
        var door = create_door(x, y, parent, "exit");
        this.doors.push(door);
    }
    
    //create default tiles
    this.tile = [];
    for (var x=0; x<this.width; x++) {
        this.tile[x] = [];
        for (var y=0; y<this.height; y++) {
            var tiletype = template["default"];
            this.tile[x][y] = create_tile(tiletype);
        }
    }
    
    //generate map using doors
    this.doors.forEach(function(door) {
        carve_path(this, template, door.x, door.y);
        this.tile[door.x][door.y].door = door;
    }, this);
};

Map.prototype.mouse_down = function(mx, my) {
    if (this.tile[mx] && this.tile[mx][my] && this.tile[mx][my].door)
        return this.tile[mx][my].door.submap;
    return this;
};

Map.prototype.mouse_move = function(mx, my) {
    if (this.tile[mx] && this.tile[mx][my] && this.tile[mx][my].door)
        console.log(this.tile[mx][my].door);
};

Map.prototype.loop = function() {

};

Map.prototype.draw = function(ctx) {
    for (var x=0; x<this.width; x++) {
        for (var y=0; y<this.height; y++) {
            var t = this.tile[x][y];
            draw_tile(ctx, t, x, y);
            if (t.fringe)
                draw_tile(ctx, t.fringe, x, y)
        }
    }
    
    this.doors.forEach(function(door) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(door.x*4-2, door.y*4-2, 8, 8);
        ctx.fillStyle = door.color;
        ctx.fillRect(door.x*4, door.y*4, 4, 4);
    });
};
