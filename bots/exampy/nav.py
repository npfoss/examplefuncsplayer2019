
coord_to_dir = {
    (0,0): "C",
    (0,1): "S",
    (1,1): "SE",
    (1,0): "E",
    (1,-1): "NE",
    (0,-1): "N",
    (-1, -1): "NW",
    (-1, 0): "W",
    (-1, 1): "SW",
}

dir_to_coord = {
    "C": (0,0),
    "S": (0,1),
    "SE": (1,1),
    "E": (1,0),
    "NE": (1,-1),
    "N": (0,-1),
    "NW": (-1, -1),
    "W": (-1, 0),
    "SW": (-1, 1),   
}

def calculate_dir(start, target, as_coord):
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
    
    return (dx, dy) if as_coord else coord_to_dir[(dx, dy)]

rotate_cw = ["S", "SE", "E", "NE", "N", "NW", "W", "SW"]
rotate_ccw = ["S", "SW", "W", "NW", "N", "NE", "E", "SE"]

def rotate(orig_dir, amount, cw, as_dir):
    rotate_arr = rotate_cw if cw else rotate_ccw
    direction = rotate_arr[(rotate_arr.index(orig_dir) + amount) % 8]
    return direction if as_dir else dir_to_coord[direction]

def reflect(full_map, loc, horizontal=True):
    v_reflec = (len(full_map[0]) - loc[0], loc[1])
    h_reflec = (loc[0], len(full_map) - loc[1])
    if horizontal:
        return h_reflec if full_map[h_reflec[1]][h_reflec[0]] else v_reflec
    else:
        return v_reflec if full_map[v_reflec[1]][v_reflec[0]] else h_reflec

def is_passable(full_map, loc, coord_dir, robot_map):
    new_point = (loc[0] + coord_dir[0], loc[1] + coord_dir[1])
    if new_point[0] < 0 or new_point[0] > len(full_map):
        return False
    if new_point[1] < 0 or new_point[0] > len(full_map):
        return False
    if not full_map[new_point[1]][new_point[0]]:
        return False
    if robot_map[new_point[1]][new_point[0]] > 0:
        return False
    return True