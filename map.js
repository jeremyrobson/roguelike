var colors = {};
colors["water"] = "rgb(0,0,255)";
colors["shallow"] = "rgb(50,150,255)";
colors["grass"] = "rgb(0,255,0)";
colors["tree"] = "rgb(0,155,0)";
colors["mountain"] = "rgb(100,100,100)";
colors["stone"] = "rgb(50,50,75)";
colors["dirt"]= "rgb(200,150,100)";
colors["wall"] = "rgb(55,55,25)";
colors["floor"] = "rgb(200,200,100)";
colors["door"] = "rgb(255,255,0)";
colors["party"] = "rgb(255,0,255)";

var maptypes = {}
maptypes["world"] = {"base":"water","walk":"grass","border":"shallow","wall":"none"};
maptypes["cave"] = {"base":"stone","walk":"dirt"};
maptypes["town"] = {"base":"tree","walk":"grass"};
maptypes["house"] = {"base":"wall","walk":"floor"};

function create_empty_tiles(width, height, maptype) {
    var tile = [];
    for (var x=0;x<width;x++) {
        tile[x] = [];
        for (var y=0;y<height;y++) {
            tile[x][y] = {};
            tile[x][y].type = maptype.base;
            tile[x][y].door = null;
        }
    }
    return tile;
}

function carve_room(newmap, x, y, type) {
    var width = randint(6,25);
    var height = randint(6,25);
    for (var w=0;w<width;w++) {
        for (var h=0;h<height;h++) {
            var dx = wrap(x+w-Math.floor(width/2),newmap.width);
            var dy = wrap(y+h-Math.floor(height/2),newmap.height);
            newmap.tile[dx][dy].type = type;
        }
    }
    return {"x":dx,"y":dy};
}

function carve_path(newmap, x, y, type) {
    var tilelist = [{"x":x,"y":y}];
    var xlist = [-1,0,1,0,-1,0,1,0];
    var ylist = [0,-1,0,1,0,-1,0,-1];
    for (var i=0;i<100;i++) {
        var j = randint(0,xlist.length);
        x = wrap(x + xlist[j], newmap.width);
        y = wrap(y + ylist[j], newmap.height);
        tilelist.push({"x":x, "y":y});
        newmap.tile[x][y].type = type;
    }
    return {"x":x,"y":y};
}

function carve_island(newmap, x, y, type) {
    var tilelist = [{"x":x,"y":y}];
    var xlist = [-1,0,1,0];
    var ylist = [0,-1,0,1];
    for (var i=0;i<1000;i++) {
        var j = randint(0,xlist.length);
        x = wrap(x + xlist[j], newmap.width);
        y = wrap(y + ylist[j], newmap.height);
        tilelist.push({"x":x, "y":y});
        newmap.tile[x][y].type = type;
    }
    return {"x":x,"y":y};
}

function nearest_neighbor(newmap, oldtype, newtype) {
    var newtile = clone(newmap.tile);
    for (var x=0;x<newmap.width;x++) {
        for (var y=0;y<newmap.height;y++) {
            var total = 0;
            for (var a=-1;a<=1;a++) {
                for (var b=-1;b<=1;b++) {
                    if (newmap.tile[wrap(x+a,newmap.width)][wrap(y+b,newmap.height)].type == newtype)
                        total += 1;
                }
            }
            if (total > 4 && newtile[x][y].type == oldtype)
                newtile[x][y].type = newtype;
        }   
    }
    newmap.tile = newtile;
}

function perimeter(newmap, oldtype, newtype) {
    var newtile = clone(newmap.tile);
    var xlist = [-1,0,1,0];
    var ylist = [0,-1,0,1];
    for (var x=0;x<newmap.width;x++) {
        for (var y=0;y<newmap.height;y++) {
            for (var j=0;j<4;j++) {
                if (newmap.tile[x][y].type == oldtype && newmap.tile[wrap(x+xlist[j],newmap.width)][wrap(y+ylist[j],newmap.height)].type != oldtype)
                    newtile[x][y].type = newtype;
            }
        }   
    }
    newmap.tile = newtile;
}

function carve_mountain(newmap, submap) {
    for (var x=0;x<newmap.width;x++) {
        for (var y=0;y<newmap.height;y++) {
            if (submap.tile[x][y].type == maptypes[submap.type].walk)
                newmap.tile[x][y].type = "mountain";
        }
    }
}

function create_door(x, y, xx, yy, newmap, parent) {
    newmap.doors.push({"x":x, "y":y, "xx": xx, "yy": yy, "submap":parent});
    parent.doors.push({"x":xx, "y":yy, "xx":x, "yy":y, "submap": newmap});
}

function create_map(maptype, width, height, levels, doorcount, parent) {
    var newmap = {};
    newmap.type = maptype;
    newmap.width = width;
    newmap.height = height;
    newmap.parent = parent;
    newmap.tile = create_empty_tiles(width,height,maptypes[maptype]);
    newmap.doors = [];
    
    if (newmap.type == "world") {
        create_map("town", newmap.width, newmap.height, 0, 1, newmap);
        create_map("cave", newmap.width, newmap.height, 2, 1, newmap);
        
        newmap.doors.forEach(function(door) {
            carve_island(newmap, door.x, door.y, maptypes[newmap.type].walk);
            if (door.submap.type == "cave")
                carve_mountain(newmap, door.submap);
        });
        
        nearest_neighbor(newmap, maptypes[newmap.type].base, maptypes[newmap.type].walk);
        perimeter(newmap, "water", "shallow");
    }
    else if (newmap.type == "town") {
        create_map("house", newmap.width, newmap.height, 2, 1, newmap);
        
        var x = randint(0,Math.floor(newmap.width/2));
        var y = randint(0,Math.floor(newmap.height/2));
        var xx = randint(0,parent.width);
        var yy = randint(0,parent.height);
        
        create_door(x, y, xx, yy, parent, newmap);
        
        newmap.doors.forEach(function(door) {
            carve_island(newmap, door.x, door.y, maptypes[newmap.type].walk);
        });
        
        nearest_neighbor(newmap, maptypes[newmap.type].base, maptypes[newmap.type].walk);
    }
    else if (newmap.type == "cave") {
        for (var i=0;i<doorcount;i++) {
            if (levels > 0)
                create_map("cave", newmap.width, newmap.height, levels-1, 1, newmap);
            else {
                var x = randint(0,newmap.width);
                var y = randint(0,newmap.height);
                create_door(x, y, x, y, parent, newmap);
            }
        }
        
        newmap.doors.forEach(function(door) {
            var exit = carve_path(newmap, door.x, door.y, maptypes[newmap.type].walk);
            create_door(exit.x, exit.y, exit.x, exit.y, parent, newmap);
        });
        
        nearest_neighbor(newmap, maptypes[newmap.type].base, maptypes[newmap.type].walk);
        //perimeter()
    }
    else if (newmap.type == "house") {
        for (var i=0;i<doorcount;i++) {
            if (levels > 0)
                create_map("house", newmap.width, newmap.height, levels-1, 1, newmap);

            var x = randint(0,newmap.width);
            var y = randint(0,newmap.height);                
            if (newmap.doors.length > 0) {
                x = wrap(newmap.doors[0].x+2, newmap.width);
                y = newmap.doors[0].y;
            }
            
            create_door(x, y, x, y, parent, newmap);
        }
        
        newmap.doors.forEach(function(door) {
            var exit = carve_room(newmap, door.x, door.y, maptypes[newmap.type].walk);
        });
        
        nearest_neighbor(newmap, maptypes[newmap.type].base, maptypes[newmap.type].walk);
        //perimeter()
    }
    
    newmap.doors.forEach(function(door) {
        newmap.tile[door.x][door.y].door = door;
        newmap.tile[door.x][door.y].type = "door";
    });
    
    
    newmap.move = function(x, y) {
        var event = Event(function(newgame) { newgame.party.move(x, y); });
        return event;
    };
    
    newmap.mousedown = function(mx, my) {
        var seltile = newmap.tile[mx][my];
        var x = mx;
        var y = my;
        var submap = newmap;
        
        if (seltile.door) {
            x = seltile.door.xx;
            y = seltile.door.yy;
            submap = seltile.door.submap;
        }
            
        var event = Event(function(newgame) { newmap.move(x,y).invoke(newgame); newgame.mode = submap; } );    
        return event;
    };
    
    newmap.draw = function(ctx, party) {
        for (var x=0;x<newmap.width;x++) {
            for (var y=0;y<newmap.height;y++) {
                ctx.fillStyle = colors[newmap.tile[x][y].type];
                ctx.fillRect(x*10,y*10,10,10);
            }
        }
        ctx.fillStyle = colors["party"];
        ctx.fillRect(party.x*10,party.y*10,10,10);
    };    
    
    return newmap;
}
