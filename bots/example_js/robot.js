import {BCAbstractRobot, SPECS} from 'battlecode';
import nav from './nav.js';
import util from './util.js';
import pilgrim from './pilgrim.js';
import crusader from './crusader.js';
import prophet from './prophet.js';
import preacher from './preacher.js';
import castle from './castle.js';
import church from './church.js';


// eslint-disable-next-line no-unused-vars
class MyRobot extends BCAbstractRobot {
    constructor() {
        super();
        this.pendingRecievedMessages = {};
        this.enemyCastles = [];
        this.myType = undefined;
        this.step = -1;
        this.pilgrimsBuilt = 0;
    }

    turn() {
        if (this.myType === undefined){
            switch(this.me.unit) {
                case SPECS.PROPHET:
                    this.myType = prophet;
                    break;
                case SPECS.CASTLE:
                    this.myType = castle;
                    break;
                case SPECS.PILGRIM:
                    this.myType = pilgrim;
                    break;
            }
        }

        this.step++;

        return this.myType.takeTurn(this);
    }
}