// global variables
const API_URL = 'http://127.0.0.1:5000/item_doc_refresh_list/' + g_item_name;
const CANVAS_ID = 'item_graph_canvas';
const DATE_TODAY = new Date();
const DATE_LAST_MONTH = new Date().setDate(DATE_TODAY.getDate() - 31);
const DATE_LAST_QTR = new Date().setDate(DATE_TODAY.getDate() - (31 * 3));
const DATE_LAST_WEEK = new Date().setDate(DATE_TODAY.getDate() - 8);
const DATE_LAST_YEAR = new Date().setDate(DATE_TODAY.getDate() - 365);
const DATE_TOMORROW = new Date().setDate(DATE_TODAY.getDate() + 1);
const DEFAULT_BUTTON_COLOR = 'aquamarine';
let GRAPH_CANVAS = document.getElementById('item_graph_canvas');
let GRAPH_DATA_OBJECT = {};
let ITEM_DOCS = "";
let THE_CHART = new Chart(GRAPH_CANVAS);

// global element variables
let DIV_BUTTONS = document.getElementById('nav_graph_buttons');
let DIV_LIST_ITEM_DOCS = document.getElementById('item_doc_list');

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
                DIV_LIST_ITEM_DOCS.innerHTML += data['data'];
                return;
            }
            //
            else {
                // pull data array out of response object and deep copy to ITEM_DOCS
                ITEM_DOCS = structuredClone(data['data']);
                //
                if (ITEM_DOCS.length < 2) {
                    return;
                }
            }
        })
        // load page elements after successful API call
        .then(function () {
            // populate list of docs making sure to skip meta object at front of array
            for (let i = 1; i < ITEM_DOCS.length; i++) {
                let temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                for (attribute of Object.keys(ITEM_DOCS[i])) {
                    temp_div.innerHTML += attribute + ': ' + ITEM_DOCS[i][attribute] + '<br>';
                }
                DIV_LIST_ITEM_DOCS.append(temp_div);
            }
            /// draw chart
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
                GRAPH_DATA_OBJECT['datasets'][0]['backgroundColor'].push(ITEM_DOCS[i]['color']);
            }
            // draw graph
            draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for all time to today', DATE_TOMORROW, null);
            // display graph buttons
            DIV_BUTTONS.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload=function () {
    get_item_docs();
}

/*
...
 */

// draw bubble graph
function draw_bubble_graph(canvas_id, data_objects, title_text, x_max, x_min) {
    THE_CHART.destroy();
    THE_CHART = new Chart(
        GRAPH_CANVAS,
        {
            type: 'bubble',
            data: data_objects,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart ' + title_text
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        max: x_max,
                        min: x_min
                    },
                    y: {
                        type: 'linear',
                        ticks: {
                            stepSize: 1
                        },
                        min: '0',
                        max: '24'
                    }
                }
            }
        }
    );
}

//
function redraw_graph_buttons() {
    console.log(DIV_BUTTONS.children.item(0));
    for (let i = 0; i <= DIV_BUTTONS.children.length; i++) {
        //DIV_BUTTONS.children.item(i).className = 'graph_buttons';
    }
}

/*
    onclicks
 */

document.getElementById('graph_button_all_time').onclick=function() {
    this.style.backgroundColor = 'grey';
    redraw_graph_buttons();
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for all time', null, null);
}
document.getElementById('graph_button_all_time_today').onclick=function () {
    this.style.backgroundColor = 'grey';
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for all time to today', DATE_TOMORROW, null);
}
document.getElementById('graph_button_last_month').onclick=function () {
    this.style.backgroundColor = 'grey';
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for last month', DATE_TOMORROW, DATE_LAST_MONTH);
}
document.getElementById('graph_button_last_qtr').onclick=function () {
    this.style.backgroundColor = 'grey';
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for last quarter', DATE_TOMORROW, DATE_LAST_QTR);
}
document.getElementById('graph_button_last_week').onclick=function () {
    this.style.backgroundColor = 'grey';
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for last week', DATE_TOMORROW, DATE_LAST_WEEK);
}
document.getElementById('graph_button_last_year').onclick=function () {
    this.style.backgroundColor = 'grey';
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'for last year', DATE_TOMORROW, DATE_LAST_YEAR);
}
