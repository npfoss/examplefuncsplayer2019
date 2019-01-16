
# coord_to_dir = {
#     (0,0): "C",
#     (0,1): "S",
#     (1,1): "SE",
#     (1,0): "E",
#     (1,-1): "NE",
#     (0,-1): "N",
#     [-1, -1]: "NW",
#     [-1, 0]: "W",
#     [-1, 1]: "SW",
# }

# dir_to_coord = {
#     "C": (0,0),
#     "S": (0,1),
#     "SE": (1,1),
#     "E": (1,0),
#     "NE": (1,-1),
#     "N": (0,-1),
#     "NW": [-1, -1],
#     "W": [-1, 0],
#     "SW": [-1, 1],   
# }

def calculate_dir(start, target):
    """
    Calculate the direction in which to go to get from start to target.
    start: a tuple representing an (x,y) point
    target: a tuple representing an (x,y) point
    as_coord: whether you want a coordinate (-1,0) or a direction (S, NW, etc.)
    """
    dx = target[0] - start[0]
    dy = target[1] - start[1]
    if dx < 0:
        dx = -1
    elif dx > 0:
        dx = 1
    
    if dy < 0:
        dy = -1
    elif dy > 0: 
        dy = 1
    
    return [dx, dy]

rotate_arr = [    
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1]
]

def get_list_index(lst, tup):
    # only works for 2-tuples
    for i in range(len(lst)):
        if lst[i][0] == tup[0] and lst[i][1] == tup[1]:
            return i

def rotate(orig_dir, amount):
    direction = rotate_arr[(get_list_index(rotate_arr, orig_dir) + amount) % 8]
    return direction

def reflect(full_map, loc, horizontal=True):
    v_reflec = [len(full_map[0]) - loc[0], loc[1]]
    h_reflec = [loc[0], len(full_map) - loc[1]]
    if horizontal:
        return h_reflec if full_map[h_reflec[1]][h_reflec[0]] else v_reflec
    else:
        return v_reflec if full_map[v_reflec[1]][v_reflec[0]] else h_reflec

def is_passable(full_map, loc, coord_dir, robot_map=None):
    new_point = [loc[0] + coord_dir[0], loc[1] + coord_dir[1]]
    if new_point[0] < 0 or new_point[0] >= len(full_map):
        return False
    if new_point[1] < 0 or new_point[1] >= len(full_map):
        return False
    if not full_map[new_point[1]][new_point[0]]:
        return False
    if robot_map is not None and robot_map[new_point[1]][new_point[0]] > 0:
        return False
    return True

def apply_dir(loc, dir):
    return (loc[0] + dir[0], loc[1] + dir[1])

def goto(loc, target, full_map, robot_map, already_been):
    goal_dir = calculate_dir(loc, target)
    if goal_dir[0] == 0 and goal_dir[1] == 0:
        return [0, 0]
    # self.log("MOVING FROM " + str(my_coord) + " TO " + str(nav.dir_to_coord[goal_dir]))
    end_dir = goal_dir
    i = 0
    while not is_passable(full_map, loc, end_dir, robot_map) and i < 4:# or apply_dir(loc, goal_dir) in already_been: # doesn't work because `in` doesn't work :(
        # alternate checking either side of the goal dir, by increasing amounts (but not past directly backwards)
        if i > 0:
            i = -i
        else:
            i = -i + 1
        end_dir = rotate(goal_dir, i)
    return end_dir

