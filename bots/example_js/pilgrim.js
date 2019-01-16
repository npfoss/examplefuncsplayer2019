import {BCAbstractRobot, SPECS} from 'battlecode';
import nav from './nav.js';
import util from './util.js';

const pilgrim = {};

pilgrim.takeTurn = (self) => {
    self.log('pilgrim taking turn')
    var visiblebots = self.getVisibleRobots()
    // On the first turn, find out our base
    if (!self.castle) {
        self.castle = visiblebots
            .filter(robot => robot.team === self.me.team && robot.unit === SPECS.CASTLE)[0];
    }

    // if we don't have a destination, figure out what it is.
    if (!self.destination) {
        // need to figure out if 1st or 2nd pilgrim: if 1st get karb, else fuel
        if (visiblebots
            .filter(robot => robot.team === self.me.team && robot.unit === SPECS.PILGRIM).length > 1){
            // can see another pilgrim on my team
            self.resourceDestination = nav.getClosestKarbonite(self.me, self.getFuelMap());
        } else {
            self.resourceDestination = nav.getClosestKarbonite(self.me, self.getKarboniteMap());
        }
        self.destination = self.resourceDestination;
    }

    // If we're near our destination, do the thing
    if (self.me.karbonite === SPECS.UNITS[self.me.unit].KARBONITE_CAPACITY
            || self.me.fuel === SPECS.UNITS[self.me.unit].FUEL_CAPACITY) {
        self.destination = self.castle;
        if (nav.sqDist(self.me, self.destination) <= 2) {
            self.destination = self.resourceDestination
            return self.give(
                self.castle.x - self.me.x,
                self.castle.y - self.me.y,
                self.me.karbonite,
                self.me.fuel);
        }
    } else {
        if (nav.sqDist(self.me, self.destination) === 0) {
            return self.mine();
        }
    }
    // If we have nothing else to do, move to our destination.
    const choice = nav.goto(self, self.destination);

    return self.move(choice.x, choice.y);
}



export default pilgrim;
