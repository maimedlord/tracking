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
let GRAPH_BUTTON_ALL_TIME = document.getElementById('graph_button_all_time');
let GRAPH_BUTTON_ALL_TIME_TODAY = document.getElementById('graph_button_all_time_today');
let GRAPH_BUTTON_LAST_MONTH = document.getElementById('graph_button_last_month');
let GRAPH_BUTTON_LAST_QTR = document.getElementById('graph_button_last_qtr');
let GRAPH_BUTTON_LAST_WEEK = document.getElementById('graph_button_last_week');
let GRAPH_BUTTON_LAST_YEAR = document.getElementById('graph_button_last_year');
let GRAPH_BUTTON_TODAY = document.getElementById('graph_button_today');
let GRAPH_CANVAS = document.getElementById('item_graph_canvas');
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const OPACITY_08 = '0.08';
const OPACITY_40 = '0.40';
const OPACITY_65 = '0.65';
let THE_CHART = new Chart(GRAPH_CANVAS);
const URL_BASE = 'http://127.0.0.1:5000/';

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
GRAPH_BUTTON_ALL_TIME.onclick=function() {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'all time: ';
    CURRENT_GRAPH_END_TIME = null;
    CURRENT_GRAPH_START_TIME = null;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, null, null);
}
GRAPH_BUTTON_ALL_TIME_TODAY.onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'all time to today: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = null;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, null);
}
GRAPH_BUTTON_LAST_MONTH.onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last month: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_MONTH;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_MONTH);
}
GRAPH_BUTTON_LAST_QTR.onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last qtr: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_QTR;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_QTR);
}
GRAPH_BUTTON_TODAY.onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'today: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_TODAY;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_YESTERDAY);
}
GRAPH_BUTTON_LAST_WEEK.onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last week: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_WEEK;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_WEEK);
}
GRAPH_BUTTON_LAST_YEAR.onclick=function () {
    btn_pop_back(this, null);
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last year: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_YEAR;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_YEAR);
}