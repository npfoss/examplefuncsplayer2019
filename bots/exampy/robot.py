from battlecode import BCAbstractRobot, SPECS
import battlecode as bc
import random
import nav

__pragma__('iconv')
__pragma__('tconv')
__pragma__('opov')



# don't try to use global variables!!
class MyRobot(BCAbstractRobot):

    destination = None

    def turn(self):
        if self.me['unit'] == SPECS['CRUSADER']:
            self.log("Crusader health: " + str(self.me['health']))

            visible = self.get_visible_robots()

            # get attackable robots
            attackable = []
            for r in visible:
                # x = 5
                # if not self.is_visible(r):
                if 'x' not in r: #not visible. hacky. do not use at home
                    continue
                # now all in vision range, can see x, y etc
                dist = (r['x'] - self.me['x'])**2 + (r['y'] - self.me['y'])**2
                if r['team'] != self.me['team'] and SPECS['UNITS'][SPECS["CRUSADER"]]['ATTACK_RADIUS'][0] <= dist <= SPECS['UNITS'][SPECS["CRUSADER"]]['ATTACK_RADIUS'][1]:
                    attackable.append(r)

            if attackable:
                # attack first robot
                r = attackable[0]
                self.log('attacking! ' + str(r) + ' at loc ' + (r['x'] - self.me['x'], r['y'] - self.me['y']))
                return self.attack(r['x'] - self.me['x'], r['y'] - self.me['y'])

            # The directions: North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest
            my_coord = (self.me['x'], self.me['y'])
            if not self.destination:
                self.destination = nav.reflect(self.map, my_coord, self.me['id'] % 2)
            goal_dir = nav.calculate_dir(my_coord, self.destination, False)
            if goal_dir is "C":
                return
            self.log("MOVING FROM " + str(my_coord) + " TO " + str(nav.dir_to_coord[goal_dir]))
            while not nav.is_passable(self.map, my_coord, nav.dir_to_coord[goal_dir], self.get_visible_robot_map()):
                self.log("TURNING FROM " + goal_dir)
                goal_dir = nav.rotate(goal_dir, 1, True, True)
            return self.move(*nav.dir_to_coord[goal_dir])

        elif self.me['unit'] == SPECS['CASTLE']:
            if self.me['turn'] < 10:
                self.log("Building a crusader at " + str(self.me['x']+1) + ", " + str(self.me['y']+1))
                return self.build_unit(SPECS['CRUSADER'], 1, 1)

            else:
                self.log("Castle health: " + self.me['health'])

robot = MyRobot()
