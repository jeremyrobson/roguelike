function randint(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function wrap(num, max) {
    if (num >= max) { return num % max; }
    if (num < 0) { return max + num; }
    return num;
}

function clone(obj) {
    var newobj;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Array) {
        newobj = [];
        for (var i=0;i<obj.length;i++)
            newobj[i] = clone(obj[i]);
        return newobj;
    }
    else if (obj instanceof Object) {
        newobj = {};
        for (var key in obj)
            newobj[key] = clone(obj[key]);
        return newobj;
    }
    throw new Error("cloning error.");
}

function Event(fn) {
    return {"invoke": function(newgame) { fn(newgame); }};
}

function create_party(count) {
    var newparty = {};
    newparty.unit = [];
    for (var i=0;i<count;i++)  {
        //newparty.unit[i] = create_unit();
    }
    newparty.move = function(x, y) {
        newparty.x = x;
        newparty.y = y;
    };
    return newparty;
}

function create_game() {
    var newgame = {};
    
    newgame.worldmap = create_map("world", 64, 48, 0, 0, null);
    newgame.party = create_party(5);
    newgame.party.move(newgame.worldmap.doors[0].x,newgame.worldmap.doors[0].y);
    newgame.mode = newgame.worldmap;
    newgame.q = [];
    
    newgame.loop = function() {
        if (newgame.q.length > 0) {
            var e = newgame.q.pop();
            e.invoke(newgame);
        }
    };
    
    newgame.mousemove = function(mx, my) {
        
    };
    
    newgame.mousedown = function(mx, my) {
        newgame.q.push(newgame.mode.mousedown(mx, my));
    };
    
    newgame.draw = function(ctx) {
        ctx.clearRect(0,0,640,480);
        newgame.mode.draw(ctx, newgame.party);
    };
    
    return newgame;
}
