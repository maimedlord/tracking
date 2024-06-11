const BORDER_WIDTH = 5;
const BTN_CLR_OFF = '';
const BTN_CLR_ON = 'lightblue';
const CANVAS_ID = 'item_graph_canvas';
let CURRENT_GRAPH_END_TIME = '';
let CURRENT_GRAPH_START_TIME = '';
let CURRENT_TIME_STR = '';
let CURRENT_VIEW_STR = '';
const DATE_TODAY = new Date();
const DATE_LAST_MONTH = new Date().setDate(DATE_TODAY.getDate() - 31);
const DATE_LAST_QTR = new Date().setDate(DATE_TODAY.getDate() - (31 * 3));
const DATE_LAST_WEEK = new Date().setDate(DATE_TODAY.getDate() - 8);
const DATE_LAST_YEAR = new Date().setDate(DATE_TODAY.getDate() - 365);
const DATE_TOMORROW = new Date().setDate(DATE_TODAY.getDate() + 1);
const DATE_YESTERDAY = new Date().setDate(DATE_TODAY.getDate() - 1);
let GRAPH_CANVAS = document.getElementById('item_graph_canvas');
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const opacity_amt_8 = '0.08';
const opacity_amt_40 = '0.40';
const opacity_amt_65 = '0.65';
let THE_CHART = new Chart(GRAPH_CANVAS);

/*

 */

async function btn_pop_back(element, parent_element) {
    element.style.boxShadow = 'inset 3px 3px 0px black';
    await sleep(1000);
    element.style.boxShadow = '3px 3px 0px black';
    console.log('inthebutnpopback: ', element.id);
    await sleep(250);
    if (parent_element) {
        parent_element.style.display = 'none';
    }
}

// RETURNS:
// function close_div(div_element_name) {
//     console.log('inclosediv: ', div_element_name)
//     document.getElementById(div_element_name).style.display = 'none';
// }

// RETURNS: void
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
                        text: title_text
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                //day: 'MMM DD YYY'
                            },
                            unit: 'day'
                        },
                        max: x_max,
                        min: x_min
                    },
                    y: {
                        min: 0,
                        max: 24,
                        type: 'linear',
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        }
    );
}

// RETURNS: string
function hexToRgb(hex, opacity_amt) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return 'rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ',' + opacity_amt + ')';
}

// RETURNS: void
function redraw_graph_buttons(div_id) {
    elements = document.getElementsByClassName('graph_buttons');
    for (let i = 0; i <= elements.length; i++) {
        if (elements[i]) {
            elements[i].style.backgroundColor = BTN_CLR_OFF;
        }
    }
    document.getElementById(div_id).style.backgroundColor = BTN_CLR_ON;
}

/*
    onclicks
 */

document.getElementById('graph_button_all_time').onclick=function() {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'all time: ';
    CURRENT_GRAPH_END_TIME = null;
    CURRENT_GRAPH_START_TIME = null;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, null, null);
}
document.getElementById('graph_button_all_time_today').onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'all time to today: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = null;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, null);
}
document.getElementById('graph_button_last_month').onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last month: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_MONTH;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_MONTH);
}
document.getElementById('graph_button_last_qtr').onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last qtr: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_QTR;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_QTR);
}
document.getElementById('graph_button_today').onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'today: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_TODAY;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_YESTERDAY);
}
document.getElementById('graph_button_last_week').onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last week: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_WEEK;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_WEEK);
}
document.getElementById('graph_button_last_year').onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last year: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_YEAR;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_YEAR);
}
// sort_items_input.onclick=function () {
//     // exit if empty input
//     if (sort_items_input.value == '') {
//         return;
//     }
//     let sorted_arr = Array.from(item_list.childNodes);
//     item_list.innerHTML = '';
//     if (sort_items_input.value == 'timestracked,ascending') {
//         sorted_arr = sorted_arr.sort((a, b) => a.dataset.item_count - b.dataset.item_count);
//     }
//     else if (sort_items_input.value == 'timestracked,descending') {
//         sorted_arr = sorted_arr.sort((a, b) => b.dataset.item_count - a.dataset.item_count);
//     }
//     else if (sort_items_input.value == 'date,created,ascending') {
//         sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_created - b.dataset.date_created);
//     }
//     else if (sort_items_input.value == 'date,created,descending') {
//         sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_created - a.dataset.date_created);
//     }
//     else if (sort_items_input.value == 'date,tracked,ascending') {
//         sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_tracked - b.dataset.date_tracked);
//     }
//     else if (sort_items_input.value == 'date,tracked,descending') {
//         sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_tracked - a.dataset.date_tracked);
//     }
//     else if (sort_items_input.value == 'name,ascending') {
//         sorted_arr = sorted_arr.sort((a, b) => a.dataset.item_name.toLowerCase() - b.dataset.item_name.toLowerCase());
//     }
//     else if (sort_items_input.value == 'name,descending') {
//         sorted_arr = sorted_arr.sort((a, b) => b.dataset.item_name.toLowerCase() - a.dataset.item_name.toLowerCase());
//     }
//     // redraw newly sorted items
//     for (element of sorted_arr) {
//         item_list.append(element);
//     }
// }