import {BCAbstractRobot, SPECS} from 'battlecode';
import nav from './nav.js';

let step = -1;

// eslint-disable-next-line no-unused-vars
class MyRobot extends BCAbstractRobot {
    turn() {
        step++;

        if (this.me.unit === SPECS.CRUSADER) {
            this.log('START TURN ' + step);
            this.log('Crusader health: ' + this.me.health);

            var visible = this.getVisibleRobots();
            
            // this sucks I'm sorry...
            // This is actually fine. Or use .bind()
            var self = this; // 'this' fails to properly identify MyRobot when used inside of anonymous function below :(

            // get attackable robots
            var attackable = visible.filter((r) => {
                if (! self.isVisible(r)){
                    return false;
                }
                const dist = (r.x-self.me.x)**2 + (r.y-self.me.y)**2;
                if (r.team !== self.me.team
                    && SPECS.UNITS[SPECS.CRUSADER].ATTACK_RADIUS[0] <= dist
                    && dist <= SPECS.UNITS[SPECS.CRUSADER].ATTACK_RADIUS[1] ){
                    return true;
                }
                return false;
            });
            this.log(attackable);

            if (attackable.length>0){
                // attack first robot
                var r = attackable[0];
                this.log('' +r);
                this.log('attacking! ' + r + ' at loc ' + (r.x - this.me.x, r.y - this.me.y));
                return this.attack(r.x - this.me.x, r.y - this.me.y);
            }
            const { x, y } = this.me;
            // this.log("Crusader health: " + this.me.health);'
            if (!this.destination) {
                this.destination = nav.reflect({x,y}, this.getPassableMap(), this.me.id % 2 === 0);
            }

            const choice = nav.goto({x,y}, this.destination, this.map, this.getPassableMap(), this.getVisibleRobotMap());
            return this.move(choice.x, choice.y);
        }

        else if (this.me.unit === SPECS.CASTLE) {
            if (step % 10 === 0) {
                this.log('Building a crusader at ' + (this.me.x+1) + ',' + (this.me.y+1));
                return this.buildUnit(SPECS.CRUSADER, 1, 1);
            } else {
                return; // this.log("Castle health: " + this.me.health);
            }
        }

    }
}