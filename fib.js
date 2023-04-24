const N = 9;

var focus_on_diagonal = false;

function fib(n) {
    if (n <= 1) {
        return n;
    }
    return fib(n-2) + fib(n-1);
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

function bold(s) {
    return "<b>" + s + "</b>";
}

function coords_string(loc) {
    const x = x_coord(loc);
    const y = y_coord(loc);

    if (focus_on_diagonal) {
        if (Math.abs(x - y) > 1) {
            return "";
        }
    }
    const n = x + y;
    if (focus_on_diagonal && (x >= y)) {
        return bold(fib(n));
    }
    else {
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
    td.style["font-size"] = "80%";
    td.innerHTML = coords_string(loc);
}

function make_cell(loc) {
    const td = document.createElement("td");
    td.id = loc;
    td.style.height = "50px";
    td.style.width = "50px";
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

function handle_square_click(td, loc) {
    alert("TODO");
    redraw_board();
}

function set_click_handler(td, loc) {
    td.onclick = () => {
        handle_square_click(td, loc);
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

function reset_the_game() {
    focus_on_diagonal = !focus_on_diagonal;
    redraw_board();
}

function set_reset_handler() {
    const reset_button = document.getElementById("reset");
    reset_button.onclick = reset_the_game;
}

make_board();
set_reset_handler();
