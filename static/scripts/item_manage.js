// global variables
const API_URL = 'http://127.0.0.1:5000/item_doc_refresh_list/' + g_item_name;
let GRAPH_DATA_OBJECT = {};
let ITEM_DOCS = "";

// global element variables
let back_to_all_items = document.getElementById('back_to_all_items');
let button_delete_item = document.getElementById('button_delete_item');
let delete_item_popup = document.getElementById('delete_item_popup');
let nav_graph_buttons = document.getElementById('nav_graph_buttons');
let item_doc_list = document.getElementById('item_list');

async function btn_pop_back(element, parent_element) {
    element.style.boxShadow = 'inset 3px 3px 0px black';
    await sleep(1000);
    element.style.boxShadow = '3px 3px 0px black';
    await sleep(250);
    if (parent_element) {
        parent_element.style.display = 'none';
    }
}

function close_div(div_element_name) {
    document.getElementById(div_element_name).style.display = 'none';
}

function delete_item(item_name) {
    // delete_item_popup.style.display = 'flex';
    btn_pop_back(button_delete_yes, null);
    const api_url = 'http://127.0.0.1:5000/delete_item/' + item_name;
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
                // delete_item_popup.style.display = 'none';
                data = JSON.stringify(data);
                console.log('delete item api return', data);
                window.location.href = URL_BASE + 'items_manage';
            }
        })
}

/*
runs on page load via window.onload
grab item docs via API and then display/populate elements accordingly
*/
function get_item_docs() {
    fetch(API_URL, {method: 'POST'})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            data = JSON.parse(data);
            // handle error/failed response:
            if (!typeof data == 'object' || (typeof data == 'object' && data['status'] != 'success')) {
                item_doc_list.innerHTML += data['data'];
                return;
            }
            //
            else {
                // pull data array out of response object and deep copy to ITEM_DOCS
                ITEM_DOCS = structuredClone(data['data']);
                //
                if (ITEM_DOCS.length < 2) { // PROBABLY GOING TO HAVE A PROBLEM HERE WHEN ADDING VIEWS_* !!!!!!!!!!!!!!!!!!!!!!
                    return;
                }
            }
        })
        // load page elements after successful API call
        .then(function () {
            // populate list of docs making sure to skip meta object at front of array
            for (let i = 1; i < ITEM_DOCS.length; i++) {
                let temp_date = new Date(ITEM_DOCS[i]['time noticed']);
                let temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                for (key of Object.keys(ITEM_DOCS[i])) {
                    console.log(ITEM_DOCS[i]);
                    if (ITEM_DOCS[i][key]) {
                        if (key == 'color') {
                            temp_div.style.backgroundColor = hexToRgb(ITEM_DOCS[i]['color'], OPACITY_08);
                            temp_div.style.borderColor = ITEM_DOCS[i]['color'];
                            temp_div.innerHTML += '<div class="width_full" style="background-color:' + ITEM_DOCS[i]['color'] + ';">' + 'color: ' + ITEM_DOCS[i]['color'] + '</div>';
                        }
                        else if (key == 'intensity') {
                            temp_div.innerHTML += 'intensity: ' + ITEM_DOCS[i]['intensity'] + '<br>';
                            temp_div.setAttribute('data-intensity', ITEM_DOCS[i]['intensity']);
                        }
                        else if (key == 'time noticed') {
                            temp_div.innerHTML += temp_date + '<br>';
                            temp_div.setAttribute('data-date_tracked', String(temp_date.getTime()));
                        }
                        else if (key == 'time duration') {
                            temp_div.innerHTML += 'time duration: ' + ITEM_DOCS[i]['time duration'] + '<br>';
                            temp_div.setAttribute('data-time_duration', ITEM_DOCS[i]['time duration']);
                        }
                        else if (key == 'response method') {
                            temp_div.innerHTML += 'response method: ' + ITEM_DOCS[i]['response method'] + '<br>';
                        }
                        else if (key == 'feeling before') {
                            temp_div.innerHTML += 'feeling before: ' + ITEM_DOCS[i]['feeling before'] + '<br>';
                        }
                        else if (key == 'feeling after') {
                            temp_div.innerHTML += 'feeling after: ' + ITEM_DOCS[i]['feeling after'] + '<br>';
                        }
                        else if (key == 'notes') {
                            temp_div.innerHTML += 'notes:<br>' + '<div class="border_box notes_box">' + ITEM_DOCS[i]['notes'] + '</div>';
                            temp_div.setAttribute('data-note_length', ITEM_DOCS[i]['notes'].length);
                        }
                    }
                }
                item_doc_list.append(temp_div);
            }
            /* draw chart */
            // prepare data object for chart
            GRAPH_DATA_OBJECT = {
                datasets: [
                    {
                        label: ITEM_DOCS[0]['name'],
                        data: [],
                        backgroundColor: []
                    }
                ],
            };
            // notice skipping meta doc in front of array
            for (let i = 1; i < ITEM_DOCS.length; i++) {
                let temp_date = new Date(ITEM_DOCS[i]['time noticed']);
                GRAPH_DATA_OBJECT['datasets'][0]['data'].push({
                    x: temp_date,
                    y: temp_date.getHours() + (temp_date.getMinutes() / 60),
                    r: parseInt(ITEM_DOCS[i]['intensity']) / 2
                });
                //
                GRAPH_DATA_OBJECT['datasets'][0]['backgroundColor'].push(hexToRgb(ITEM_DOCS[i]['color'], OPACITY_65));
            }
            // draw graph
            draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for all time to today', DATE_TOMORROW, null);
            // display graph buttons
            nav_graph_buttons.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/*
    onload
 */
window.onload=function () {
    get_item_docs();
}

/*
    onclicks
 */
back_to_all_items.onclick=function () {
    btn_pop_back(this, null);
    back_to_all_items.style.boxShadow = 'inset 3px 3px 0px black';
}
button_delete_item.onclick=function () {
    btn_pop_back(this, null);
    delete_item_popup.style.display = 'flex';
}
sort_items_input.onclick=function () {
    // exit if empty input
    if (sort_items_input.value == '') {
        return;
    }
    let sorted_arr = Array.from(item_list.childNodes);
    item_list.innerHTML = '';
    if (sort_items_input.value == 'date,tracked,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_tracked - b.dataset.date_tracked);
    }
    else if (sort_items_input.value == 'date,tracked,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_tracked - a.dataset.date_tracked);
    }
    else if (sort_items_input.value == 'intensity,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.intensity - b.dataset.intensity);
    }
    else if (sort_items_input.value == 'intensity,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.intensity - a.dataset.intensity);
    }
    else if (sort_items_input.value == 'note,length,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.note_length - b.dataset.note_length);
    }
    else if (sort_items_input.value == 'note,length,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.note_length - a.dataset.note_length);
    }
    // redraw newly sorted items
    for (element of sorted_arr) {
        item_list.append(element);
    }
}