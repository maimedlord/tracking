//
let all_items = "";
let button_view_calendar = document.getElementById('button_view_calendar');
let button_view_graph = document.getElementById('button_view_graph');
const CANVAS_ID = 'item_graph_canvas';
let div_items = document.getElementById('items');
let div_view_calendar = document.getElementById('div_view_calendar');
let div_view_graph = document.getElementById('div_view_graph');
const DATE_TODAY = new Date();
const DATE_TOMORROW = new Date().setDate(DATE_TODAY.getDate() + 1);
let nav_view_type = document.getElementById('nav_view_type');

// refresh item list
function get_items() {
    let item_list = document.getElementById('items');

    const api_url = 'http://127.0.0.1:5000/get_items_all';

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
            for (let i = 0; i < all_items.length; i++) {
                console.log(all_items[i][0]);
                let temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                temp_div.innerHTML += '<b>' + all_items[i][0]['name'] + '</b><br><br>';
                temp_div.innerHTML += 'keywords: ' +all_items[i][0]['keywords'];
                temp_div.appendChild(document.createElement('br'));
                temp_div.innerHTML += '# of occurences: ' + (all_items[i].length - 1);
                temp_div.appendChild(document.createElement('br'));
                temp_div.innerHTML += 'created: ' + all_items[i][0]['date_created'];
                div_items.append(temp_div);
            }
            // draw bubble graph using all items as datasets
            // first, create datasets object
            // draw_bubble_graph();
            // display view type navigation:
            nav_view_type.style.display = 'flex';
        })
}

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

window.onload=function () {
    get_items();
}

/*
    onclicks
 */

button_view_calendar.onclick=function () {
    div_view_graph.style.display = 'none';
    div_view_calendar.style.display = 'flex';
}
button_view_graph.onclick=function () {
    div_view_calendar.style.display = 'none';
    div_view_graph.style.display = 'flex';
}