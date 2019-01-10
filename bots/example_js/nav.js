const compass = [
    ['NW', 'N', 'NE'],
    ['W', 'C', 'E'],
    ['SW', 'S', 'SE'],
];

const rotateArr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const compassToCoordinate = {
    'N': {x: 0, y: -1},
    'NE': {x: 1, y: -1},
    'NW': {x: -1, y: -1},
    'E': {x: 1, y: 0},
    'W': {x: -1, y: 0},
    'S': {x: 0, y: 1},
    'SE': {x: 1, y: 1},
    'SW': {x: -1, y: 1},
}

const toCompassDir = (dir) => {
    return compass[dir.y + 1][dir.x + 1];
}

const toCoordinateDir = (dir) => {
    // A good practice to return new objects.
    return {...compassToCoordinate[dir]}
}

const rotate = (dir, amount) => {
    compassDir = toCompassDir(dir);
    rotateCompassDir = rotateArr[(rotateArr.indexOf(compassDir) + amount + 8) % 8];
    return toCoordinateDir(rotateCompassDir);
}

const reflect = (loc, fullMap, isHorizontalReflection) => {
    const mapLen = fullMap.length;
    hReflect = {
        x: loc.x,
        y: mapLen - loc.y,
    }
    vReflect = {
        x: mapLen - loc.y,
        y: loc.y,
    }

    if (isHorizontalReflection) {
        return fullMap[hReflect.y][hReflect.x] ? hReflect : vReflect;
    } else {
        return fullMap[vReflect.y][vReflect.x] ? vReflect : hReflect;
    }
}

const getDir = (start, target) => {
    newDir = {
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
}

const isPassable = (loc, fullMap, robotMap) => {
    const {x, y} = loc;
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
}

const applyDir = (loc, dir) => {
    return {
        x: loc.x + dir.x,
        y: loc.y + dir.y,
    };
}

const goto = (loc, destination, fullMap, robotMap) => {
    let goalDir = getDir(loc, destination);
    while (!isPassable(applyDir(loc, goalDir), fullMap, robotMap)) {
        goalDir = rotate(goalDir, 1);
    }
    return goalDir;
}

const sqDist = (start, end) => {
    return Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2);
}

export default {reflect, getDir, rotate, toCoordinateDir, toCompassDir, goto, sqDist};

