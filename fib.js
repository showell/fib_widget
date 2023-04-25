const N = 25;

var mode = "arithmetic";

function toggle_mode() {
    if (mode == "arithmetic") {
        mode = "geometric";
    } else if (mode == "geometric") {
        mode = "fib";
    } else {
        mode = "arithmetic";
    }
}

var fib_cache = {};

function fib(n) {
    if (n == 1) {
        return 0;
    }
    if (n == 0) {
        return 1;
    }
    if (fib_cache[n]) {
        return fib_cache[n];
    }

    const result = fib(n - 2) + fib(n - 1);
    fib_cache[n] = result;
    return result;
}

function arithmetic(n) {
    return n;
}

function geometric(n) {
    return `r<sup>${n}</sup>`;
}

// squares have integer locations that map to x/y zero-based coordinates
function integer_loc(x, y) {
    return N * y + x;
}

function x_coord(loc) {
    return loc % N;
}

function y_coord(loc) {
    return Math.floor(loc / N);
}

function coords_string(loc) {
    const x = x_coord(loc);
    const y = y_coord(loc);

    const n = x + y;

    if (mode == "arithmetic") {
        return arithmetic(n);
    } else if (mode == "geometric") {
        return geometric(n);
    } else {
        return fib(n);
    }
}

function for_all_squares(f) {
    for (var i = 0; i < N * N; ++i) {
        f(i);
    }
}

function add_table_styles(table) {
    table.style.border = "1px solid blue";
    table.style["border-collapse"] = "collapse";
}

function draw_normal_square(td, loc) {
    const color = "white";
    td.style["background-color"] = color;
    td.style["font-size"] = "100%";
    td.innerHTML = coords_string(loc);
}

function make_cell(loc) {
    const td = document.createElement("td");
    td.id = loc;
    td.style.height = "40px";
    td.style.width = "40px";
    td.style.border = "1px solid blue";
    td.style["text-align"] = "center";
    draw_normal_square(td, loc, {});
    return td;
}

function update_square(loc) {
    const td = document.getElementById(loc);
    draw_normal_square(td, loc);
}

function redraw_board() {
    for_all_squares((loc) => {
        update_square(loc);
    });
}

function handle_square_click(loc) {
    alert(loc);
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
            const loc = integer_loc(x, y);
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

make_board();
set_reset_handler();
