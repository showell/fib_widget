function createSignal(val) {
    function read() {
        return val;
    }

    function write(v) {
        val = v;
        run_effects();
    }

    return [read, write];
}

const [mode, setMode] = createSignal("arithmetic");
const [currentLoc, setCurrentLoc] = createSignal();
const [offset, setOffset] = createSignal({ x: 0, y: 0 });

const N = 15;
const M = 15;

function run_effects() {
    show_mode();
    redraw_board();
}

function show_mode() {
    var title;
    if (mode() == "arithmetic") {
        title = "Sums of integers";
    } else if (mode() == "geometric") {
        title = "Geometric sequence";
    } else if (mode() == "power2") {
        title = "Powers of 2";
    } else {
        title = "Fibonacci matrices";
    }
    const mode_span = document.getElementById("mode_title");
    mode_span.innerText = title;
}

function toggle_mode() {
    if (mode() == "arithmetic") {
        setMode("geometric");
    } else if (mode() == "geometric") {
        setMode("power2");
    } else if (mode() == "power2") {
        setMode("fib");
    } else {
        setMode("arithmetic");
    }
}

function arithmetic(n) {
    return `${n}`;
}

function geometric(n) {
    return `r<sup>${n}</sup>`;
}

function power2(n) {
    if (n < 0) {
        return `1 / ${2 ** -n}`;
    }
    return `${2 ** n}`;
}

var fib_cache = {};

function calc_fib(n) {
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return 1;
    }
    if (fib_cache[n]) {
        return fib_cache[n];
    }

    let result;

    if (n < 0) {
        result = calc_fib(n + 2) - calc_fib(n + 1);
    } else {
        result = calc_fib(n - 2) + calc_fib(n - 1);
    }

    fib_cache[n] = result;
    return result;
}

function fib(n) {
    const tr = calc_fib(n);
    const bl = tr;
    const tl = calc_fib(n - 1);
    const br = calc_fib(n + 1);
    return `
<table style="text-align: right; width: 100%; font-size: 50%; font-weight: bold">
<tr><td style="width: 50%">${tl}</td><td>${tr}</td></tr>
<tr><td style="width: 50%">${bl}</td><td>${br}</td></tr>
</table>
`;
}

function make_loc(x, y) {
    return { x: x, y: y };
}

function is_current_loc(loc) {
    return loc.x == currentLoc().x && loc.y == currentLoc().y;
}

function is_x_intercept_loc(loc) {
    return loc.x == currentLoc().x && loc.y == 0;
}

function is_y_intercept_loc(loc) {
    return loc.x == 0 && loc.y == currentLoc().y;
}

function is_intercept_loc(loc) {
    return is_x_intercept_loc(loc) || is_y_intercept_loc(loc);
}

function is_axis_loc(loc) {
    return loc.x == 0 || loc.y == 0;
}

function is_origin(loc) {
    return loc.x == 0 && loc.y == 0;
}

function is_diagonal(loc) {
    return loc.x == loc.y || loc.x == -loc.y;
}

function get_location_color(loc) {
    if (is_current_loc(loc)) {
        return "cyan";
    }
    if (is_intercept_loc(loc)) {
        return "blueviolet";
    }
    if (is_origin(loc)) {
        return "indianred";
    }
    if (is_diagonal(loc)) {
        return "antiquewhite";
    }
    if (is_axis_loc(loc)) {
        return "lightcoral";
    }
    return "white";
}

function square_contents(loc) {
    const n = loc.x + loc.y;

    if (mode() == "arithmetic") {
        return arithmetic(n);
    } else if (mode() == "geometric") {
        return geometric(n);
    } else if (mode() == "power2") {
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
    td.style.height = "30px";
    td.style.width = "55px";
    td.style.border = "1px solid blue";
    td.style["text-align"] = "center";
    return td;
}

function redraw_board() {
    for (var y = 0; y <= N; ++y) {
        for (var x = 0; x <= M; ++x) {
            const id = `${x},${y}`;
            const td = document.getElementById(id);
            const loc = make_loc(x - offset().x, y - offset().y);
            draw_normal_square(td, loc);
        }
    }
}

function handle_square_click(loc) {
    setCurrentLoc(loc);
}

function set_click_handler(td) {
    td.onclick = () => {
        const [x, y] = td.id.split(",");
        const loc = make_loc(x - offset().x, y - offset().y);
        handle_square_click(loc);
    };
}

function make_board() {
    const table = document.getElementById("main_grid");
    table.children = [];
    for (var y = N; y >= 0; --y) {
        const tr = document.createElement("tr");
        for (var x = 0; x <= M; ++x) {
            const id = `${x},${y}`;
            var td = make_cell(id);
            set_click_handler(td);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    add_table_styles(table);
}

function home() {
    setOffset(make_loc(0, 0));
    setCurrentLoc(make_loc(0, 0));
}

function incr_y() {
    setCurrentLoc(make_loc(currentLoc().x, currentLoc().y + 1));
    if (currentLoc().y + offset().y > N) {
        setOffset(make_loc(offset().x, offset().y - 1));
    }
}

function decr_y() {
    setCurrentLoc(make_loc(currentLoc().x, currentLoc().y - 1));
    if (currentLoc().y + offset().y < 0) {
        setOffset(make_loc(offset().x, offset().y + 1));
    }
}

function decr_x() {
    setCurrentLoc(make_loc(currentLoc().x - 1, currentLoc().y));
    if (currentLoc().x + offset().x < 0) {
        setOffset(make_loc(offset().x + 1, offset().y));
    }
}

function incr_x() {
    setCurrentLoc(make_loc(currentLoc().x + 1, currentLoc().y));
    if (currentLoc().x + offset().x > M) {
        setOffset(make_loc(offset().x - 1, offset().y));
    }
}

function set_toggle_handler() {
    const toggle_button = document.getElementById("toggle");
    toggle_button.onclick = toggle_mode;
}

function set_keyboard_handler() {
    document.addEventListener("keydown", (e) => {
        if (e.key == "t" || e.key == " ") {
            e.preventDefault();
            toggle_mode();
            return;
        }
        if (e.key == "Home") {
            e.preventDefault();
            home();
            return;
        }
        if (e.key == "ArrowDown") {
            e.preventDefault();
            decr_y();
            return;
        }
        if (e.key == "ArrowUp") {
            e.preventDefault();
            incr_y();
            return;
        }
        if (e.key == "ArrowLeft") {
            e.preventDefault();
            decr_x();
            return;
        }
        if (e.key == "ArrowRight") {
            e.preventDefault();
            incr_x();
            return;
        }
        if (e.key == "\\") {
            decr_x();
            incr_y();
            return;
        }
        if (e.key == "|") {
            incr_x();
            decr_y();
            return;
        }
    });
}

make_board();
setCurrentLoc(make_loc(0, 0));
set_toggle_handler();
set_keyboard_handler();
