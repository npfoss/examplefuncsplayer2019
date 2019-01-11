package bc19;

public class MyRobot extends BCAbstractRobot {

    public Action turn() {
        if (me.unit == SPECS.CASTLE) {
            log("Building a pilgrim.");
            return buildUnit(SPECS.PILGRIM,1,0);
        }
        return move(1,0);

    }
}
// package bc19;
// import java.awt.Point;

// public class MyRobot extends BCAbstractRobot {
// 	public int turn;
// 	public Point destination;

//     public Action turn() {
//     	turn++;

//     	if (me.unit == SPECS.CASTLE) {
//     		if (turn == 1) {
//     			log("Building a pilgrim.");
//     			return buildUnit(SPECS.PILGRIM,1,0);
//     		}

// 			Robot[] visibleRobots = getVisibleRobots();
// 			for(Robot r: visibleRobots) {
// 				if (r.team != me.team) {
// 					int diffX = r.x - me.x;
// 					int diffY = r.y - me.y;
// 					return attack(diffX, diffY);
// 				}
// 			}

// 			Point myLocation = new Point(me.x, me.y);

// 			if (destination == null) {
// 				destination = Navigation.reflect(myLocation, getPassableMap(), me.id % 2 == 0);
// 			}

// 			Point movementDirection = Navigation.goTo(myLocation, destination, getPassableMap(), getVisibleRobotMap());
// 			return move(movementDirection.x, movementDirection.y);
//     	}

//     	if (me.unit == SPECS.PILGRIM) {
//     		if (turn == 1) {
//     			log("I am a pilgrim.");
                 
//                 //log(Integer.toString([0][getVisibleRobots()[0].castle_talk]));
//     		}
//     	}

//     	return null;

// 	}
// }