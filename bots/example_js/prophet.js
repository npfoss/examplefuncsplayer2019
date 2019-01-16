import {BCAbstractRobot, SPECS} from 'battlecode';
import nav from './nav.js';
import util from './util.js';

const prophet = {};

prophet.takeTurn = (self) => {
    self.log('prophet taking turn')
    self.log('START TURN ' + self.step);
    self.log('health: ' + self.me.health);

    var visible = self.getVisibleRobots();
    
    // get attackable robots
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

    const attacking = visible.filter(r => {
        if (r.team === self.me.team) {
            return false;
        }

        if (nav.sqDist(r, self.me) <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0]) {
            return true;
        } else {
            return false;
        }
    });

    if (attacking.length > 0) {
        const attacker = attacking[0];
        const dir = nav.getDir(self.me, attacker);
        const otherDir = {
            x: -dir.x,
            y: -dir.y,
        };
        return self.move(otherDir.x, otherDir.y);
    }



    if(!self.pendingMessage) {
        for(let i = 0; i < visible.length; i++ ) {
            const robot = visible[i];
            if (robot.team !== self.me.team && robot.unit === SPECS.CASTLE && self.enemyCastles.indexOf(robot.x * 64 + robot.y) < 0) {
                self.log('ENEMY CASTLE FOUND!');
                self.pendingMessage = robot.y;
                self.castleTalk(robot.x);
                self.enemyCastles.push(robot.x * 64 + robot.y);
            }
        }
    } else {
        self.castleTalk(self.pendingMessage);
        self.pendingMessage = null;
    }

    self.log(attackable);

    if (attackable.length>0){
        // attack first robot
        var r = attackable[0];
        self.log('' +r);
        self.log('attacking! ' + r + ' at loc ' + (r.x - self.me.x, r.y - self.me.y));
        return self.attack(r.x - self.me.x, r.y - self.me.y);
    }
    // self.log("Crusader health: " + self.me.health);'
    if (!self.destination) {
        self.destination = nav.reflect(self.me, self.getPassableMap(), self.me.id % 2 === 0);
    }

    const choice = nav.goto(self, self.destination);
    return self.move(choice.x, choice.y);
}


export default prophet;
