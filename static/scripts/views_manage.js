//
let button_view_calendar = document.getElementById('button_view_calendar');
let button_view_graph = document.getElementById('button_view_graph');
let div_view_calendar = document.getElementById('div_view_calendar');
let div_view_graph = document.getElementById('div_view_graph');

// refresh item list
function refresh_item_list() {
    item_list = document.getElementById('items');

    const api_url = 'http://127.0.0.1:5000/item_refresh_list';

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
            console.log(data);
            // handle error/failed response:
            if (!typeof data == 'object' || (typeof data == 'object' && data['status'] != 'success')) {
                item_list.innerHTML += data['data'];
                return;
            }
            data = data['data'];
            temp_div = document.createElement('div');
            item_list.innerHTML = '';
                // processes an array of item meta documents
                for (i = 0; i < data.length; i++) {
                    temp_div = document.createElement('div');
                    temp_div.innerHTML += '<b>' + data[i]['item_name'] + '</b><br>';
                    for (const attribute of Object.keys(data[i])) {
                        temp_div.innerHTML += (attribute + ': ' + data[i][attribute] + '<br>');
                    }
                    temp_div.className = 'item_div';
                    item_list.append(temp_div);
                }
        })
}

window.onload=function () {
    refresh_item_list();
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

// div_view_calendar.onclick=function () {
//     //div_view_graph.style.display = 'none';
//     div_view_calendar.style.display = 'flex';
//     console.log('clicked on calendar');
// }
// div_view_graph.onclick=function () {
//     div_view_calendar.style.display = 'none';
//     div_view_graph.style.display = 'flex';
//     console.log('clicked on graph');
// }