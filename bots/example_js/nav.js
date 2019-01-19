const nav = {};

nav.compass = [
    ['NW', 'N', 'NE'],
    ['W', 'C', 'E'],
    ['SW', 'S', 'SE'],
];

nav.rotateArr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
nav.rotateArrInd = {
    'N': 0,
    'NE': 1,
    'E': 2,
    'SE': 3,
    'S': 4,
    'SW': 5,
    'W': 6,
    'NW': 7,
};

nav.compassToCoordinate = {
    'N': { x: 0, y: -1 },
    'NE': { x: 1, y: -1 },
    'NW': { x: -1, y: -1 },
    'E': { x: 1, y: 0 },
    'W': { x: -1, y: 0 },
    'S': { x: 0, y: 1 },
    'SE': { x: 1, y: 1 },
    'SW': { x: -1, y: 1 },
};

nav.toCompassDir = (dir) => {
    return nav.compass[dir.y + 1][dir.x + 1];
};

nav.toCoordinateDir = (dir) => {
    return nav.compassToCoordinate[dir];
};

nav.rotate = (dir, amount) => {
    const compassDir = nav.toCompassDir(dir);
    const rotateCompassDir = nav.rotateArr[(nav.rotateArrInd[compassDir] + amount) % nav.rotateArr.length];  //BUG HERE: can't call length of rotateArrInd; used rotateArr instead 
    return nav.toCoordinateDir(rotateCompassDir);
};

nav.reflect = (loc, mapLen, isHorizontalReflection) => {
    const hReflect = {
        x: loc.x,
        y: mapLen - loc.y - 1, // SEE BELOW
    };
    const vReflect = {
        x: mapLen - loc.x - 1, // 2 BUG(_S_) HERE!!! loc.y SHOULD BE loc.x; also must subtract 1!!!!!
        y: loc.y,
    };    
    return isHorizontalReflection ? hReflect : vReflect; 
};

nav.isHoReflect = (self) => {
    // self.log('starting reflect check');
    const mapLen = self.map.length
    var Plausible = true;
    for (let y = 0; y < mapLen && Plausible; y++) {
        for (let x = 0; x < mapLen && Plausible; x++) {
            Plausible = self.map[y][x] === self.map[mapLen - y - 1][x]
        }
    }
    return Plausible
}

nav.getDir = (start, target) => {
    const newDir = {
        x: target.x - start.x,
        y: target.y - start.y,
    };

    if (newDir.x < 0) {
        newDir.x = -1;
    } else if (newDir.x > 0) {
        newDir.x = 1;
    }

    if (newDir.y < 0) {
        newDir.y = -1;
    } else if (newDir.y > 0) {
        newDir.y = 1;
    }

    return newDir;
};

nav.isPassable = (loc, fullMap, robotMap) => {
    const { x, y } = loc;
    const mapLen = fullMap.length;
    if (x >= mapLen || x < 0) {
        return false;
    } else if (y >= mapLen || y < 0) {
        return false;
    } else if (robotMap[y][x] > 0 || !fullMap[y][x]) {
        return false;
    } else {
        return true;
    }
};

nav.applyDir = (loc, dir) => {
    return {
        x: loc.x + dir.x,
        y: loc.y + dir.y,
    };
};

nav.goto = (self, destination) => {
    let goalDir = nav.getDir(self.me, destination);
    if (goalDir.x === 0 && goalDir.y === 0) {
        return goalDir;
    }
    let tryDir = 0;
    while (!nav.isPassable(
        nav.applyDir(self.me, goalDir),
        self.getPassableMap(),
        self.getVisibleRobotMap()
    ) && tryDir < nav.rotateArr.length) {
        goalDir = nav.rotate(goalDir, 1);
        tryDir++;
    }
    return goalDir;
};

nav.sqDist = (start, end) => {
    return Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2);
};

nav.getClosestRsrc = (loc, rsrcMap) => {
    const mapLen = rsrcMap.length;
    let closestLoc = null;
    let closestDist = 100000; // Large number;
    for (let y = 0; y < mapLen; y++) {
        for (let x = 0; x < mapLen; x++) {
            if (rsrcMap[y][x] && nav.sqDist({ x, y }, loc) < closestDist) {
                closestDist = nav.sqDist({ x, y }, loc);
                closestLoc = { x, y };
            }
        }
    }
    return closestLoc;
};

export default nav;
