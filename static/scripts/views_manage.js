//
let all_items = "";
let button_view_calendar = document.getElementById('button_view_calendar');
let button_view_graph = document.getElementById('button_view_graph');
let div_items = document.getElementById('items');
let div_view_calendar = document.getElementById('div_view_calendar');
//let div_view_graph = document.getElementById('div_view_graph');
let GRAPH_DATA_OBJECT = {
                datasets: [
                    // {
                    //     label: 'some label here...',
                    //     data: [],
                    //     backgroundColor: []
                    // }
                ],
            };
let nav_graph_buttons = document.getElementById('nav_graph_buttons');
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
                //console.log(all_items[i][0]);
                let temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                temp_div.style.borderColor = all_items[i][0]['color'];
                temp_div.innerHTML += '<div class="center_span">' + '<b>' + all_items[i][0]['name'] + '</b>' + '</div>' + '<br>';
                temp_div.innerHTML += '<b>keywords:</b> ' +all_items[i][0]['keywords'];
                temp_div.appendChild(document.createElement('br'));
                temp_div.innerHTML += '<b>occurences:</b> ' + (all_items[i].length - 1);
                temp_div.appendChild(document.createElement('br'));
                temp_div.innerHTML += '<b>created:</b> ' + all_items[i][0]['date_created'];
                div_items.append(temp_div);
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
                    let temp_date = new Date(all_items[i][ii]['time noticed']);
                    xyz_array.push({
                        x: temp_date,
                        y: temp_date.getHours() + (temp_date.getMinutes() / 60),
                        r: parseInt(all_items[i][ii]['intensity']) / 2
                    });
                    color_array.push(hexToRgb(all_items[i][ii]['color']));
                    console.log('hex to rbg: ', hexToRgb(all_items[i][ii]['color']));
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
            // draw_bubble_graph();
            draw_bubble_graph(CANVAS_ID, GRAPH_DATA_OBJECT, 'SOME TITLE TEXT HERE...', DATE_TOMORROW, null);
            // display view type navigation:
            nav_view_type.style.display = 'flex';
            nav_graph_buttons.style.display = 'flex';
        })
        .then(function () {
            //
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
                        text: 'text here. HMMMMMM'
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

/*
    onload
 */

window.onload=function () {
    get_items();
    console.log(hexToRgb('#00ff55'));
}

/*
    onclicks
 */

button_view_calendar.onclick=function () {
    nav_graph_buttons.style.display = 'none';
    GRAPH_CANVAS.style.display = 'none';
    div_view_calendar.style.display = 'flex';
}
button_view_graph.onclick=function () {
    div_view_calendar.style.display = 'none';
    GRAPH_CANVAS.style.display = 'initial';
    nav_graph_buttons.style.display = 'flex';
}