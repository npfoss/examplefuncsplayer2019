import {BCAbstractRobot, SPECS} from 'battlecode';
import nav from './nav.js';
import util from './util.js';

const castle = {};

castle.takeTurn = (self) => {
    self.log('castle taking turn')
    const visible = self.getVisibleRobots();
    const messagingRobots = visible.filter(robot => {
        return robot.castle_talk;
    });

    for (let i = 0; i < messagingRobots.length; i++) {
        const robot = messagingRobots[i];
        if (!self.pendingRecievedMessages[robot.id]) {
            self.pendingRecievedMessages[robot.id] = robot.castle_talk;
        } else {
            self.enemyCastles.push({
                x: self.pendingRecievedMessages[robot.id],
                y: robot.castle_talk,
            });
            self.pendingRecievedMessages[robot.id] = null;
        }
    }

    if (self.step % 100) {
        // self.log('KNOWN ENEMY CASTLES: ');
        for(let i = 0; i < self.enemyCastles.length; i++) {
            const {x,y} = self.enemyCastles[i];
            self.log(x + ',' + y);
        }
    }

    if (self.pilgrimsBuilt < 2 && self.karbonite >= 100) {
        self.log('Building a pilgrim at ' + (self.me.x+1) + ',' + (self.me.y+1));
        self.pilgrimsBuilt++;
        return self.buildUnit(SPECS.PILGRIM, 1, 0);
    } 

    if (self.karbonite > 200) {
        // const unitEnum = Math.floor(Math.random() * 3);
        // let unit = null;
        // switch(unitEnum) {
        // case 0:
        //     unit = SPECS.CRUSADER;
        //     self.log('Building a crusader at ' + (self.me.x+1) + ',' + (self.me.y+1));
        //     break;
        // case 1:
        //     unit = SPECS.PROPHET;
        //     self.log('Building a prophet at ' + (self.me.x+1) + ',' + (self.me.y+1));
        //     break;
        // case 2:
        //     unit = SPECS.PREACHER;
        //     self.log('Building a preacher at ' + (self.me.x+1) + ',' + (self.me.y+1));
        //     break;
        // }
        return self.buildUnit(SPECS.PROPHET, 1, 0);
    }
};


export default castle;
