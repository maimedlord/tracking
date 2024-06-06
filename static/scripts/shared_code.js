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
let OPACITY_AMT = '0.65';
let THE_CHART = new Chart(GRAPH_CANVAS);

/*

 */

// RETURNS: string
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return 'rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ',' + OPACITY_AMT + ')';
}

// RETURNS: void
function redraw_graph_buttons(div_id) {
    elements = document.getElementsByClassName('graph_buttons');
    for (let i = 0; i <= elements.length; i++) {
        if (elements[i]) {
            console.log(elements[i].innerHTML);
            elements[i].style.backgroundColor = BTN_CLR_OFF;
        }
    }
    document.getElementById(div_id).style.backgroundColor = BTN_CLR_ON;
}

/*
    onclicks
 */

document.getElementById('graph_button_all_time').onclick=function() {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'all time: ';
    CURRENT_GRAPH_END_TIME = null;
    CURRENT_GRAPH_START_TIME = null;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, null, null);
}
document.getElementById('graph_button_all_time_today').onclick=function () {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'all time to today: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = null;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, null);
}
document.getElementById('graph_button_last_month').onclick=function () {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last month: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_MONTH;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_MONTH);
}
document.getElementById('graph_button_last_qtr').onclick=function () {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last qtr: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_QTR;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_QTR);
}
document.getElementById('graph_button_today').onclick=function () {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'today: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_TODAY;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_YESTERDAY);
}
document.getElementById('graph_button_last_week').onclick=function () {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last week: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_WEEK;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_WEEK);
}
document.getElementById('graph_button_last_year').onclick=function () {
    redraw_graph_buttons(this.id);
    CURRENT_TIME_STR = 'last year: ';
    CURRENT_GRAPH_END_TIME = DATE_TOMORROW;
    CURRENT_GRAPH_START_TIME = DATE_LAST_YEAR;
    draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, CURRENT_TIME_STR + CURRENT_VIEW_STR, DATE_TOMORROW, DATE_LAST_YEAR);
}