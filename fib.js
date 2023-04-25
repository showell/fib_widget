const N = 25;

var mode = "fib";
var current_loc;

function toggle_mode() {
    if (mode == "arithmetic") {
        mode = "geometric";
    } else if (mode == "geometric") {
        mode = "power2";
    } else if (mode == "power2") {
        mode = "fib";
    } else {
        mode = "arithmetic";
    }
}

function arithmetic(n) {
    return `${n}`;
}

function geometric(n) {
    return `r<sup>${n}</sup>`;
}

function power2(n) {
    return `${2 ** n}`;
}

var fib_cache = {};

function calc_fib(n) {
    if (n == 1) {
        return 0;
    }
    if (n == 0) {
        return 1;
    }
    if (fib_cache[n]) {
        return fib_cache[n];
    }

    const result = calc_fib(n - 2) + calc_fib(n - 1);
    fib_cache[n] = result;
    return result;
}

function fib(n) {
    return `${calc_fib(n)}`;
}

function make_loc(x, y) {
    return { x: x, y: y, id: `${x},${y}` };
}

function is_current_loc(loc) {
    function is_current(dx, dy) {
        return loc.x == current_loc.x + dx && loc.y == current_loc.y + dy;
    }
    if (mode == "fib") {
        return is_current(0, 0) || is_current(0, 1) || is_current(1, 0) || is_current(1, 1);
    } 
    return is_current(0, 0);
}

function is_x_axis_loc(loc) {
    function is_current(dx, dy) {
        return loc.x == current_loc.x + dx && loc.y == dy;
    }
    if (mode == "fib") {
        return is_current(0, 0) || is_current(0, 1) || is_current(1, 0) || is_current(1, 1);
    } 
    return is_current(0, 0);
}

function is_y_axis_loc(loc) {
    function is_current(dx, dy) {
        return loc.x == dx && loc.y == current_loc.y + dy;
    }
    if (mode == "fib") {
        return is_current(0, 0) || is_current(0, 1) || is_current(1, 0) || is_current(1, 1);
    } 
    return is_current(0, 0);
}

function get_location_color(loc) {
    if (is_current_loc(loc)) {
        return "cyan";
    }
    if (is_x_axis_loc(loc) || is_y_axis_loc(loc)) {
        return "lightgreen";
    }
    return "white";
}

function square_contents(loc) {
    const n = loc.x + loc.y;

    if (mode == "arithmetic") {
        return arithmetic(n);
    } else if (mode == "geometric") {
        return geometric(n);
    } else if (mode == "power2") {
        return power2(n);
    } else {
        return fib(n);
    }
}

function add_table_styles(table) {
    table.style.border = "1px solid blue";
    table.style["border-collapse"] = "collapse";
}

function draw_normal_square(td, loc) {
    const color = get_location_color(loc);
    td.style["background-color"] = color;
    td.style["font-size"] = "100%";
    td.innerHTML = square_contents(loc);
}

function make_cell(loc) {
    const td = document.createElement("td");
    td.id = loc.id;
    td.style.height = "40px";
    td.style.width = "40px";
    td.style.border = "1px solid blue";
    td.style["text-align"] = "center";
    draw_normal_square(td, loc, {});
    return td;
}

function redraw_board() {
    for (var x = 0; x < N; ++x) {
        for (var y = 0; y < N; ++y) {
            const loc = make_loc(x, y);
            const td = document.getElementById(loc.id);
            draw_normal_square(td, loc);
        }
    }
}

function handle_square_click(loc) {
    current_loc = loc;
    redraw_board();
}

function set_click_handler(td, loc) {
    td.onclick = () => {
        handle_square_click(loc);
    };
}

function make_board() {
    const table = document.getElementById("main_grid");
    table.children = [];
    for (var y = 0; y < N; ++y) {
        const tr = document.createElement("tr");
        for (var x = 0; x < N; ++x) {
            const loc = make_loc(x, y);
            var td = make_cell(loc);
            set_click_handler(td, loc);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    add_table_styles(table);
}

function toggle() {
    toggle_mode();
    redraw_board();
}

function set_reset_handler() {
    const reset_button = document.getElementById("toggle");
    reset_button.onclick = toggle;
}

current_loc = make_loc(5, 4);
make_board();
set_reset_handler();
