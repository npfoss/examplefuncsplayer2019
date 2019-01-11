package bc19;

public static class Navigation {
    String[][] COMPASS = [
        ["NW", "N", "NE"],
        ["W", "C", "E"],
        ["SE", "S", "SE"],
    ];

    String[] ROTATION_ARRAY = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    Point compassToPoint(String dir) {
        switch(dir) {
            case "N":
                return (0, -1);
            case "NE":
                return (1, -1);
            case "NW":
                return (-1, -1);
            case "E":
                return (1, 0);
            case "W":
                return (-1, 0);
            case "SE":
                return (1, 1);
            case "SW":
                return (-1, 1);
            default:
                return 0;
        }
    }

    String pointToCompass(Point dir) {
        return COMPASS[(int)(dir.y + 1)][(int)(dir.x + 1)];
    }

    public Point rotate(Point dir, int amount) {
        String compassDir = pointToCompass(dir);
        String rotateCompassDir = ROTATION_ARRAY[(ROTATION_ARRAY.indexof(compassDir) + amount + 8) % 8];
        return compassToPoint(rotateCompassDir);
    }

    public Point reflect(Point loc, boolean[][] fullMap, boolean isHorizontalReflection) {
        Point hReflect = new Point(loc.x, fullMap.length - loc.y);
        Point vReflect = new Point(fullMap.length - loc.x, loc.y);

        if (isHorizontalReflection) {
            return fullMap[hReflect.y][hReflect.x] ? hReflect : vReflect;
        } else {
            return fullMap[vReflect.y][vReflect.x] ? vReflect : hReflect;
        }
    }

    public Point calculateDirection(Point start, Point target) {
        int dX = target.x - start.x;
        int dY = target.y - start.y;

        if (dX < 0) {
            dX = -1;
        } else if (dX > 0) {
            dX = 1;
        }

        if (dY < 0) {
            dY = -1;
        } else if (dY > 0) {
            dY = 1;
        }

        return Point(dX, dY);
    }

    public boolean isPassable(Point loc, boolean[][] fullMap, int[][] robotMap) {
        int mapLength = fullMap.length;
        int x = loc.x;
        int y = loc.y;
        if (x < 0 || x >= mapLength) return false;
        if (y < 0 || y >= mapLength) return false;
        if (fullMap[y][x] || robotMap[y][x] > 0) return false;
        return true;
    }

    public Point goto(Point start, Point target, boolean[][] fullMap, int[][] robotMap) {
        Point direction = calculateDirection(start, target);
        if (direction.x == 0 && direction.y == 0) {
            return direction;
        }
        while(!isPassable(start.translate(direction.x, direction.y), fullMap, robotMap)) {
            direction = rotate(direction, 1);
        }

        return direction;
    }
}