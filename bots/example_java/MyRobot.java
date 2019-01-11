package bc19;

public class MyRobot extends BCAbstractRobot {
	public int turn;
	public Point destination;

    public Action turn() {
    	turn++;

    	if (me.unit == SPECS.CASTLE) {
    		if (turn < 3) {
    			log("Building a Crusader.");
    			return buildUnit(SPECS.CRUSADER,1,0);
    		}
    	}

    	if (me.unit == SPECS.CRUSADER) {
    		if (turn == 1) {
				log("I am a Crusader.");
			}

			Robot[] visibleRobots = getVisibleRobots();
			for(Robot r: visibleRobots) {
				if (r.team != me.team) {
					int diffX = r.x - me.x;
					int diffY = r.y - me.y;
					int dist = diffX * diffX + diffY * diffY;
					if (dist >= SPECS.UNITS[SPECS.CRUSADER].ATTACK_RADIUS[0] && dist <= SPECS.UNITS[SPECS.CRUSADER].ATTACK_RADIUS[1]) {
						return attack(diffX, diffY);
					}
				}
			}

			Point myLocation = new Point(me.x, me.y);

			if (destination == null) {
				destination = Navigation.reflect(myLocation, getPassableMap(), me.id % 2 == 0);
			}

			Point movementDirection = Navigation.goTo(myLocation, destination, getPassableMap(), getVisibleRobotMap());
			return move(movementDirection.x, movementDirection.y); 
    	}

    	return null;

	}
}

class Point {
	public int x;
	public int y;
	Point(int x, int y) {
		this.x = x;
		this.y = y;
	}

	int getSquaredDistTo(Point other) {
		int dx = x - other.x;
		int dy = y - other.y;
		return dx * dx + dy * dy;
	}

	Point applyDir(Point dir) {
		return new Point(x + dir.x, y + dir.y);
	}
}