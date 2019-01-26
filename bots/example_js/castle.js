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

    var getBuildDir = function(center) {
        var options = nav.offsetList.filter((d) => {
            return nav.isPassable(nav.applyDir(self.me, d), self.getPassableMap(), self.getVisibleRobotMap())
        })
        return options[0];
    }

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

    var attackable = visible.filter((r) => {
        if (! self.isVisible(r)){
            return false;
        }
        const dist = (r.x-self.me.x)**2 + (r.y-self.me.y)**2;
        if (r.team !== self.me.team
            && SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] <= dist
            && dist <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1] ){
            return true;
        }
        return false;
    });

    if (self.me.turn % 100) {
        // self.log('KNOWN ENEMY CASTLES: ');
        for(let i = 0; i < self.enemyCastles.length; i++) {
            const {x,y} = self.enemyCastles[i];
            self.log(x + ',' + y);
        }
    }

    if (attackable.length>0){
        // attack first robot
        var r = attackable[0];
        self.log('' +r);
        self.log('attacking! ' + r + ' at loc ' + (r.x - self.me.x, r.y - self.me.y));
        return self.attack(r.x - self.me.x, r.y - self.me.y);
    }

    if (self.pilgrimsBuilt < 2 && self.karbonite >= 10) {
        var d = getBuildDir(self.me);
        if (!(d === undefined)){
            self.log('Building a pilgrim at ' + (self.me.x+1) + ',' + (self.me.y+1));
            self.pilgrimsBuilt++;
            return self.buildUnit(SPECS.PILGRIM, d.x, d.y);
        }
    } 

    if (self.me.turn > 10 && self.karbonite > 30 && self.fuel > 150 && Math.random() < .33333) {
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
        var d = getBuildDir(self.me);
        if (!(d === undefined)){
            return self.buildUnit(SPECS.PROPHET, d.x, d.y);
        }
    }
};


export default castle;
