//
let all_items = "";
let button_delete_no = document.getElementById('button_delete_no');
let button_delete_yes = document.getElementById('button_delete_yes');
let button_view_calendar = document.getElementById('button_view_calendar');
let button_view_save = document.getElementById('button_view_save');
let button_view_graph = document.getElementById('button_view_graph');
let DEL_KEY_TEXT = 'deleteContentBackward';
let delete_view_item_name = document.getElementById('delete_view_item_name');
let div_delete_view_popup = document.getElementById('delete_view_popup');
let item_list = document.getElementById('item_list');
let div_view_buttons = document.getElementById('view_buttons');
let div_view_calendar = document.getElementById('div_view_calendar');
//let div_view_graph = document.getElementById('div_view_graph');
let VIEW_NAMES = [];
let VIEWS_SAVED = document.getElementById('views_saved');
let GDO_TEMPLATE = {
                datasets: [
                    // {
                    //     label: 'some label here...',
                    //     data: [],
                    //     backgroundColor: []
                    // }
                ],
            };
let GRAPH_DATA_OBJECT = structuredClone(GDO_TEMPLATE);
let nav_graph_buttons = document.getElementById('nav_graph_buttons');
let nav_view_type = document.getElementById('nav_view_type');
// const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
let SKIP_CHARS = ['', ' ', ','];
const OFFSET_VALUE = new Date().getTimezoneOffset() * 60 * 1000;
let view_create_input = document.getElementById('view_create_input');
let view_item_bucket = document.getElementById('view_item_bucket');

async function btn_pop_back(element, parent_element) {
    element.style.boxShadow = 'inset 3px 3px 0px black';
    await sleep(1000);
    element.style.boxShadow = '3px 3px 0px black';
    await sleep(250);
    if (parent_element) {
        parent_element.style.display = 'none';
    }
}

//
function close_div(div_element_name) {
    document.getElementById(div_element_name).style.display = 'none';
}

//
function delete_view(view_name) {
    div_delete_view_popup.style.display = 'none';
    const api_url = URL_BASE + 'view_delete/' + view_name;
    fetch(api_url, {method: 'GET'})
        .then(response => {
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            // convert response from string to JSON
            //data = JSON.parse(data);
            //console.log(data);
            // handle error/failed response:
            if (!typeof data == 'object' || (typeof data == 'object' && data['status'] != 'success')) {
                item_list.innerHTML += data['data'];
                return;
            }
            else {
                get_views();
            }
        })
}

//
function delete_view_popup(view_name) {
    delete_view_item_name.textContent = view_name;
    button_delete_no.setAttribute('onclick', 'close_div(\'' + div_delete_view_popup.id + '\')')
    button_delete_yes.setAttribute('onclick', 'delete_view(\'' + view_name + '\')');
    div_delete_view_popup.style.display = 'flex';
}

//
function get_datasets_from_items(item_obj_arr) {
    // destroy existing object and prep to be filled
    GRAPH_DATA_OBJECT = structuredClone(GDO_TEMPLATE);
    // draw bubble graph using all items as datasets
    for (let i = 0; i < item_obj_arr.length; i++) {
        if (item_obj_arr[i].length < 2) {
            continue;
        }
        // skipping meta object at [0]
        let xyz_array = [];
        let color_array = [];
        for (let ii = 1; ii < item_obj_arr[i].length; ii++) {
            let temp_date = new Date(new Date(item_obj_arr[i][ii]['time noticed']) - OFFSET_VALUE);
            xyz_array.push({
                x: temp_date,
                y: temp_date.getHours() + (temp_date.getMinutes() / 60),
                r: parseInt(item_obj_arr[i][ii]['intensity']) / 2
            });
            color_array.push(hexToRgb(item_obj_arr[i][ii]['color'], OPACITY_65));
            //console.log('hex to rbg: ', hexToRgb(item_obj_arr[i][ii]['color']));
        }
        GRAPH_DATA_OBJECT['datasets'].push(
            {
                label: item_obj_arr[i][0]['name'],
                data: xyz_array,
                backgroundColor: color_array,
                borderColor: item_obj_arr[i][0]['color'],
                borderWidth: BORDER_WIDTH
            }
        );
    }
    // display view type navigation:
    nav_view_type.style.display = 'flex';
    nav_graph_buttons.style.display = 'flex';
    view_item_bucket.style.display = 'flex';
    return GRAPH_DATA_OBJECT;
}

//
function get_item_names_from_input(temp_array) {
    let view_names = []
    for (let i = 0; i < temp_array.length; i++) {
        let input_string = temp_array[i].toLowerCase().trim();
        //check if match in name
        for (let ii = 0; ii < all_items.length; ii++) {
            let check_name = all_items[ii][0]['name'].toLowerCase().trim();
            // check if name matches
            if (input_string == check_name) {
                view_names += check_name;
                continue;
            }
            // check if keyword matches
            let check_keywords = all_items[ii][0]['keywords'].split(',');
            for (let iii = 0; iii < check_keywords.length; iii++) {
                let check_string = check_keywords[iii].toLowerCase().trim();
                if (SKIP_CHARS.indexOf(check_string) < 0 && input_string == check_string) {
                    // don't add if it already exists
                    if (view_names.indexOf(check_name) < 0) {
                        view_names += check_name;
                    }
                }
            }
        }
    }
    return view_names;
}

//
function get_item_view(item_name) {
    draw_bubble_graph(CANVAS_ID, get_datasets_from_items(get_items_subset(item_name)), CURRENT_TIME_STR + item_name, CURRENT_GRAPH_END_TIME, CURRENT_GRAPH_START_TIME);
}

// refresh item list
function get_items() {
    // let item_list = document.getElementById('items');
    const api_url = URL_BASE + 'get_items_all';

    fetch(api_url, {method: 'GET'})
        .then(response => {
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            // convert response from string to JSON
            data = JSON.parse(data);
            //console.log(data);
            // handle error/failed response:
            if (!typeof data == 'object' || (typeof data == 'object' && data['status'] != 'success')) {
                item_list.innerHTML += data['data'];
                return;
            }
            else {
                all_items = structuredClone(data['data']);
            }
        })
        // draw page using API return:
        .then(function () {
            // create item list
            // let temp_div = document.createElement('div');
            // temp_div.className = 'item_div';
            // temp_div.id = 'item_div_all_items';
            // temp_div.setAttribute('onclick', 'set_view_all_items()');
            // temp_div.innerHTML += '<div class="center_span">' + '<b>' + 'all items' + '</b>' + '</div>' + '<br>';
            // item_list.append(temp_div);
            // add items to list
            for (let i = 0; i < all_items.length; i++) {
                temp_date_created = new Date(new Date(all_items[i][0]['date_created']) - OFFSET_VALUE);
                let temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                temp_div.setAttribute('onclick', 'get_item_view(\'' + all_items[i][0]['name'] + '\')');
                temp_div.style.borderColor = all_items[i][0]['color'];
                temp_div.innerHTML += '<div class="center_span">' + '<b>' + all_items[i][0]['name'] + '</b>' + '</div>' + '<br>';
                temp_div.setAttribute('data-item_name', all_items[i][0]['name']);
                temp_div.innerHTML += '<b>keywords:</b> ' +all_items[i][0]['keywords'];
                temp_div.appendChild(document.createElement('br'));
                temp_div.innerHTML += '<b>occurences:</b> ' + (all_items[i].length - 1);
                temp_div.setAttribute('data-item_count', String(all_items[i].length - 1));
                temp_div.appendChild(document.createElement('br'));
                temp_div.innerHTML += '<b>created:</b> ' + temp_date_created + '<br>';
                temp_div.setAttribute('data-date_created', temp_date_created.getTime());
                //
                if (all_items[i].length > 1) {
                    temp_date_tracked = new Date(new Date(all_items[i][all_items[i].length - 1]['time noticed']) - OFFSET_VALUE);
                    temp_div.innerHTML += '<b>last tracked:</b> ' + temp_date_tracked;
                    temp_div.setAttribute('data-date_tracked', temp_date_tracked.getTime());
                }
                else {
                    temp_div.setAttribute('data-date_tracked', '0');
                }
                item_list.append(temp_div);
            }
            // draw bubble graph using all items as datasets
            for (let i = 0; i < all_items.length; i++) {
                if (all_items[i].length < 2) {
                    continue;
                }
                // skipping meta object at [0]
                let xyz_array = [];
                let color_array = [];
                for (let ii = 1; ii < all_items[i].length; ii++) {
                    let temp_date = new Date(new Date(all_items[i][ii]['time noticed']) - OFFSET_VALUE);
                    xyz_array.push({
                        x: temp_date,
                        y: temp_date.getHours() + (temp_date.getMinutes() / 60),
                        r: parseInt(all_items[i][ii]['intensity']) / 2
                    });
                    color_array.push(hexToRgb(all_items[i][ii]['color'], OPACITY_65));
                }
                GRAPH_DATA_OBJECT['datasets'].push(
                    {
                        label: all_items[i][0]['name'],
                        data: xyz_array,
                        backgroundColor: color_array,
                        borderColor: all_items[i][0]['color'],
                        borderWidth: BORDER_WIDTH
                    }
                );
            }
            // enable graph view div
            //div_view_graph.style.display = 'flex';
            //
            CURRENT_TIME_STR = 'all time to today: ';
            CURRENT_VIEW_STR = 'all items'
            // draw_bubble_graph();
            draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, null);
            // display view type navigation:
            div_view_buttons.style.display = 'flex';
            view_item_bucket.style.display = 'flex';
            button_view_graph.style.backgroundColor = 'lightblue';
            document.getElementById('graph_button_all_time_today').style.backgroundColor = 'lightblue';
        })
        .then(function () {
            //
        })
}

// ...
function get_items_subset(item_names_arr) {
    let return_items = [];
    for (let i = 0; i < all_items.length; i++) {
        if (item_names_arr.indexOf(all_items[i][0]['name']) > -1) {
            return_items.push(all_items[i]);
        }
    }
    //console.log('return items array before return: ', return_items);
    return return_items;
}

//
function get_saved_view(view_string) {
     draw_bubble_graph(CANVAS_ID, get_datasets_from_items(get_items_subset(get_item_names_from_input(view_string.split(',')))), CURRENT_TIME_STR + 'saved view: ' + view_string, CURRENT_GRAPH_END_TIME, CURRENT_GRAPH_START_TIME);
}

//
function get_views() {
    const api_url = URL_BASE + 'get_views_saved';

    fetch(api_url, {method: 'GET'})
        .then(response => {
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            // convert response from string to JSON
            data = JSON.parse(data);
            data = data['data'].split(':');
            if (data.length < 1 || data == '') {
                VIEWS_SAVED.innerHTML = '<h3 class="align_self_center">no saved views:</h3>';
            }
            else {
                VIEWS_SAVED.innerHTML = '<h3 class="align_self_center">saved views:</h3>';
                //VIEWS_SAVED.textContent = 'saved views: ';
                for (let i = 0; i < data.length; i++) {
                    let temp_div = document.createElement('div');
                    temp_div.className = 'view';
                    let temp_div_del = document.createElement('div');
                    temp_div_del.className = 'button_view_delete';
                    temp_div_del.setAttribute('onclick', 'delete_view_popup(\'' + data[i] + '\')');
                    temp_div_del.textContent = 'DELETE THIS VIEW';
                    //console.log(data[i]);
                    temp_div.setAttribute('onclick', 'get_saved_view(\'' + data[i] + '\')');
                    temp_div.textContent = data[i];
                    temp_div.append(temp_div_del);
                    VIEWS_SAVED.append(temp_div);
                }
            }
        })
}

//
function set_view_all_items() {
    draw_bubble_graph(CANVAS_ID, get_datasets_from_items(all_items), CURRENT_TIME_STR + 'all items', CURRENT_GRAPH_END_TIME, CURRENT_GRAPH_START_TIME);
}

// TEST FUNCTION
function test_function(view_string) {
    console.log(view_string);
    draw_bubble_graph(CANVAS_ID, get_datasets_from_items(get_items_subset(get_item_names_from_input(view_string.split(',')))), 'asdddddd', DATE_TOMORROW, null);
}

/*
    onload
 */

window.onload=function () {
    get_items();
    get_views();
    //console.log(hexToRgb('#00ff55'));
}

/*
    onclick
 */

button_view_calendar.onclick=function () {
    nav_graph_buttons.style.display = 'none';
    GRAPH_CANVAS.style.display = 'none';
    div_view_calendar.style.display = 'flex';
    button_view_calendar.style.backgroundColor = 'lightblue';
    button_view_graph.style.backgroundColor = '';
}
button_view_graph.onclick=function () {
    div_view_calendar.style.display = 'none';
    GRAPH_CANVAS.style.display = 'initial';
    nav_graph_buttons.style.display = 'flex';
    button_view_calendar.style.backgroundColor = '';
    button_view_graph.style.backgroundColor = 'lightblue';
}
button_view_save.onclick=function () {
    const api_url = URL_BASE + 'view_create/' + view_create_input.value;

    fetch(api_url, {method: 'GET'})
        .then(response => {
            if (!response) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            // convert response from string to JSON
            //data = JSON.parse(data);
            console.log('view_save button: ', data);
            get_views();
            // empty text input so that current saved value doesn't conflict with next value saved
            //view_create_input.value = '';
        })
}
sort_items_input.onclick=function () {
    // exit if empty input
    if (sort_items_input.value == '') {
        return;
    }
    let sorted_arr = Array.from(item_list.childNodes);
    item_list.innerHTML = '';
    console.log(sorted_arr);
    if (sort_items_input.value == 'timestracked,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.item_count - b.dataset.item_count);
    }
    else if (sort_items_input.value == 'timestracked,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.item_count - a.dataset.item_count);
    }
    else if (sort_items_input.value == 'date,created,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_created - b.dataset.date_created);
    }
    else if (sort_items_input.value == 'date,created,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_created - a.dataset.date_created);
    }
    else if (sort_items_input.value == 'date,tracked,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_tracked - b.dataset.date_tracked);
    }
    else if (sort_items_input.value == 'date,tracked,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_tracked - a.dataset.date_tracked);
    }
    else if (sort_items_input.value == 'name,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.item_name.toLowerCase() - b.dataset.item_name.toLowerCase());
    }
    else if (sort_items_input.value == 'name,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.item_name.toLowerCase() - a.dataset.item_name.toLowerCase());
    }
    // redraw newly sorted items
    for (let element of sorted_arr) {
        item_list.append(element);
    }
}

/*
    keydown
 */
view_create_input.oninput=function (e) {
    // redraw all items if item bucket input is emptied
    if (e['inputType'] == DEL_KEY_TEXT && this.value == "") {
        draw_bubble_graph(CANVAS_ID, get_datasets_from_items(all_items), CURRENT_TIME_STR + ' all items', DATE_TOMORROW, null);
        return;
    }
    // not empty - get on with it
    let view_names_before = structuredClone(VIEW_NAMES);
    // VIEW_NAMES = [];
    //console.log(e);
    let temp_array = view_create_input.value.split(',');
    VIEW_NAMES = get_item_names_from_input(temp_array);
    // only redraw graph if input changes
    if (view_names_before != VIEW_NAMES) {
        // redraw graph with chosen items
        draw_bubble_graph(CANVAS_ID, get_datasets_from_items(get_items_subset(VIEW_NAMES)), CURRENT_TIME_STR, DATE_TOMORROW, null);
    }

}