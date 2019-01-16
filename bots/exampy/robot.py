from battlecode import BCAbstractRobot, SPECS
import battlecode as bc
import random
import nav

__pragma__('iconv')
__pragma__('tconv')
__pragma__('opov')


# don't try to use global variables!!

class MyRobot(BCAbstractRobot):

    already_been = {}
    base = None
    destination = None
    enemyCastles = []
    pendingCastleLoc = None # have to send over two turns, this is for when we've only sent half a castle loc
    partialCastleLocsRecieved = dict()
    adjacentdirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1],]
    spawnloc = None

    def turn(self):
        visible_robot_map = self.get_visible_robot_map()
        visible = self.get_visible_robots()

        # bugs
        # self.log('test thing ' + str((1,1) in [(1,2),(1,1)]))
        # self.log(nav.coord_to_dir.keys())
        # self.log([(0,1),(1,1)].index((1,1)))

        if self.spawnloc is None:
            # first turn!
            self.spawnloc = [self.me['x'], self.me['y']]

        self.log('unit ' + str(self.me['unit']) + ' known enemy castle locations: ' + str(self.enemyCastles))

        # get attackable robots
        attackable = []
        for r in visible:
            if not self.is_visible(r):
                # this robot isn't actually in our vision range, it just turned up because we heard its radio broadcast. disregard.
                continue
            # now all in vision range, can see x, y etc
            dist = (r['x'] - self.me['x'])**2 + (r['y'] - self.me['y'])**2
            if r['team'] != self.me['team'] and SPECS['UNITS'][SPECS["CRUSADER"]]['ATTACK_RADIUS'][0] <= dist <= SPECS['UNITS'][SPECS["CRUSADER"]]['ATTACK_RADIUS'][1]:
                attackable.append(r)
                if r['unit'] == 0 and not self.loc_in_list([r['x'], r['y']], self.enemyCastles):
                    self.enemyCastles.append([r['x'], r['y']])
                    # found enemy castle! tell the whole team
                    if self.pendingCastleLoc is not None:
                        # first, finish sending pending castle locs
                        self.log('signaling castle yloc: ' + str(self.pendingCastleLoc))
                        self.castle_talk(self.pendingCastleLoc)
                        self.pendingCastleLoc = None
                    else:
                        self.log('signaling castle xloc: ' + str([r['x'], r['y']]))
                        self.castle_talk(r['x'])
                        self.pendingCastleLoc = r['y']
            if r['team'] == self.me['team'] and r['unit'] == SPECS['CASTLE']:
                # give resources if have any
                if (self.me.karbonite > 0 or self.me.fuel > 0) and dist < 3.5:
                    if self.me['unit'] == SPECS['PILGRIM']:
                        self.destination = self.find_nearest(self.karbonite_map, [self.me['x'], self.me['y']])
                    return self.give(r['x'] - self.me['x'], r['y'] - self.me['y'], self.me.karbonite, self.me.fuel)

        if self.me['unit'] == SPECS['CRUSADER']:
            self.log("Crusader health: " + str(self.me['health']))

            if attackable:
                # attack first robot
                r = attackable[0]
                self.log('attacking! ' + str(r) + ' at loc ' + (r['x'] - self.me['x'], r['y'] - self.me['y']))
                return self.attack(r['x'] - self.me['x'], r['y'] - self.me['y'])

            my_coord = [self.me['x'], self.me['y']]
            self.already_been[my_coord] = True
            if not self.destination:
                self.destination = nav.reflect(self.map, my_coord, self.me['id'] % 2)
            return self.move(*nav.goto(my_coord, self.destination, self.map, visible_robot_map, self.already_been))

        elif self.me['unit'] == SPECS['PILGRIM']:
            if self.destination is None:
                # find nearest karbonite
                self.destination = self.find_nearest(self.karbonite_map, [self.me['x'], self.me['y']])
                # self.log('I have a destination! ' + str(self.destination))
            if self.karbonite_map[self.me['y']][self.me['x']]:
                # on karbonite!
                if self.me.karbonite == SPECS['UNITS'][SPECS["PILGRIM"]]['KARBONITE_CAPACITY']:
                    self.destination = self.spawnloc
                else:
                    # self.log('MINING!')
                    return self.mine()

            my_coord = [self.me['x'], self.me['y']]
            return self.move(*nav.goto(my_coord, self.destination, self.map, visible_robot_map, self.already_been))

        elif self.me['unit'] == SPECS['CASTLE']:
            for r in visible:
                if r.castle_talk is not None and r.castle_talk > 0:
                    # read out castle loc
                    coord = r.castle_talk
                    if self.loc_in_list[r['id'], self.partialCastleLocsRecieved] and self.partialCastleLocsRecieved[r['id']] is not None:
                        # must be y coord, now have full loc!
                        xloc = self.partialCastleLocsRecieved[r['id']]
                        yloc = coord
                        self.log('signal recieved: ' + str([xloc, yloc]))
                        if not self.loc_in_list(([xloc, yloc], self.enemyCastles)):
                            self.enemyCastles.append([xloc, yloc])
                        self.partialCastleLocsRecieved[r['id']] = None
                    else:
                        # new castle xloc, save until know yloc
                        self.partialCastleLocsRecieved[r['id']] = coord

            if self.karbonite >= 20:
                if self.me['turn'] % 2 == 0:
                    # build a pilgrim
                    self.log("Building a pilgrim at " + str(self.me['x']+1) + ", " + str(self.me['y']+1))
                    return self.build_unit(SPECS['PILGRIM'], 1, 1)
                else:
                    # crusader
                    self.log("Building a crusader at " + str(self.me['x']+1) + ", " + str(self.me['y']+1))
                    return self.build_unit(SPECS['CRUSADER'], 1, 1)

            else:
                self.log("Castle health: " + self.me['health'])

    def loc_in_list(self, elt, lst):
        if len(lst) < 1:
            return False
        for e in lst:
            if e[0] == elt[0] and e[1] == elt[1]:
                return True
        return False

    # def find_nearest(self, m, loc):
    #     visited = []
    #     q = []
    #     current = loc
    #     while not m[current[1]][current[0]]:
    #         visited = [current] + visited
    #         for dx, dy in self.adjacentdirs:
    #             newc = (current[0] + dx, current[1] + dy)
    #             if nav.is_passable(self.map, current, (dx,dy)) and not self.loc_in_list[newc, visited]:
    #                 q.append(newc)
    #         current = q.pop(0)
    #     return current



    def find_nearest(self, m, loc):
        closest_loc = [-1, -1]
        best_dist_sq = 64 * 64 + 64 * 64 + 1
        for x in range(len(m)):
            if (x - loc[0])**2 > best_dist_sq:
                continue
            for y in range(len(m[0])):
                if (y - loc[1])**2 > best_dist_sq:
                    continue
                d = (x-loc[0]) ** 2 + (y-loc[1]) **2
                if m[y][x] and d < best_dist_sq:
                    best_dist_sq = d
                    closest_loc = (x,y)
        return closest_loc


robot = MyRobot()
