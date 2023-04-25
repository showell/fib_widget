const N = 10;

var mode = "arithmetic";
var current_loc;

const offset = { x: 0, y: 0 };

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
    if (n < 0) {
        return calc_fib(n + 2) - calc_fib(n + 1);
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
    return { x: x, y: y };
}

function is_current_loc(loc) {
    function is_current(dx, dy) {
        return loc.x == current_loc.x + dx && loc.y == current_loc.y + dy;
    }
    if (mode == "fib") {
        return (
            is_current(0, 0) ||
            is_current(0, 1) ||
            is_current(1, 0) ||
            is_current(1, 1)
        );
    }
    return is_current(0, 0);
}

function is_x_axis_loc(loc) {
    function is_current(dx, dy) {
        return loc.x == current_loc.x + dx && loc.y == dy;
    }
    if (mode == "fib") {
        return (
            is_current(0, 0) ||
            is_current(0, 1) ||
            is_current(1, 0) ||
            is_current(1, 1)
        );
    }
    return is_current(0, 0);
}

function is_y_axis_loc(loc) {
    function is_current(dx, dy) {
        return loc.x == dx && loc.y == current_loc.y + dy;
    }
    if (mode == "fib") {
        return (
            is_current(0, 0) ||
            is_current(0, 1) ||
            is_current(1, 0) ||
            is_current(1, 1)
        );
    }
    return is_current(0, 0);
}

function is_axis_loc(loc) {
    return is_x_axis_loc(loc) || is_y_axis_loc(loc);
}

function get_location_color(loc) {
    if (is_current_loc(loc)) {
        return "cyan";
    }
    if (is_axis_loc(loc)) {
        return "lightblue";
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

function make_cell(id) {
    const td = document.createElement("td");
    td.id = id;
    td.style.height = "40px";
    td.style.width = "40px";
    td.style.border = "1px solid blue";
    td.style["text-align"] = "center";
    return td;
}

function redraw_board() {
    for (var x = 0; x <= N; ++x) {
        for (var y = 0; y <= N; ++y) {
            const id = `${x},${y}`;
            const td = document.getElementById(id);
            const loc = make_loc(x - offset.x, y - offset.y);
            draw_normal_square(td, loc);
        }
    }
}

function handle_square_click(loc) {
    current_loc = loc;
    redraw_board();
}

function set_click_handler(td) {
    td.onclick = () => {
        const [x, y] = td.id.split(",");
        const loc = make_loc(x - offset.x, y - offset.y);
        handle_square_click(loc);
    };
}

function make_board() {
    const table = document.getElementById("main_grid");
    table.children = [];
    for (var y = 0; y <= N; ++y) {
        const tr = document.createElement("tr");
        for (var x = 0; x <= N; ++x) {
            const id = `${x},${y}`;
            var td = make_cell(id);
            set_click_handler(td);
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

function down() {
    current_loc = make_loc(current_loc.x, current_loc.y + 1);
    if (current_loc.y + offset.y > N) {
        offset.y -= 1;
    }
    redraw_board();
}

function up() {
    current_loc = make_loc(current_loc.x, current_loc.y - 1);
    if (current_loc.y + offset.y < 0) {
        offset.y += 1;
    }
    redraw_board();
}

function left() {
    current_loc = make_loc(current_loc.x - 1, current_loc.y);
    if (current_loc.x + offset.x < 0) {
        offset.x += 1;
    }
    redraw_board();
}

function right() {
    current_loc = make_loc(current_loc.x + 1, current_loc.y);
    if (current_loc.x + offset.x > N) {
        offset.x -= 1;
    }
    redraw_board();
}

function set_reset_handler() {
    const reset_button = document.getElementById("toggle");
    reset_button.onclick = toggle;
}

function set_keyboard_handler() {
    document.addEventListener("keydown", (e) => {
        if (e.key == "t" || e.key == " ") {
            toggle();
            return;
        }
        if (e.key == "ArrowDown") {
            e.preventDefault();
            down();
            return;
        }
        if (e.key == "ArrowUp") {
            e.preventDefault();
            up();
            return;
        }
        if (e.key == "ArrowLeft") {
            e.preventDefault();
            left();
            return;
        }
        if (e.key == "ArrowRight") {
            e.preventDefault();
            right();
            return;
        }
    });
}

current_loc = make_loc(0, 0);
make_board();
redraw_board();
set_reset_handler();
set_keyboard_handler();
