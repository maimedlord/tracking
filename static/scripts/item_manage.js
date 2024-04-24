//
function refresh_item_docs() {
    list_div = document.getElementById('item_doc_list');

    const api_url = 'http://127.0.0.1:5000/item_doc_refresh_list/' + g_item_name;

    fetch(api_url, {method: 'POST'})
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
                list_div.innerHTML += data['data'];
            }
            //
            else {
                // pull data array out of response object
                data = data['data'];
                list_div.innerHTML = '';
                // pull out meta object:
                item_meta = data[0];
                // process items:
                for (i = 1; i < data.length; i++) {
                    temp_div = document.createElement('div');
                    temp_div.className = 'item_div';
                    for (attribute of Object.keys(data[i])) {
                        temp_div.innerHTML += attribute + ': ' + data[i][attribute] + '<br>';
                    }
                    list_div.append(temp_div);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload=function () {
    refresh_item_docs();
    g_item_docs = g_item_docs.replaceAll('&#39;', '"');
    g_item_docs = JSON.parse(g_item_docs);
    console.log(g_item_docs);
    data = {
        datasets: [
            {
              label: 'Dataset 1',
              data: [
                  {x: 1, y:20},
                  {x: 23, y:67}
              ],
              borderColor: 'red',
              backgroundColor: 'white'
            }
        ]
    };

    if (g_item_docs.length < 2) {
        return;
    }

    console.log(data['datasets'][0]['data']);
    data['datasets'][0]['data'] = [];
    console.log(data['datasets'][0]['data']);

    for (i = 1; i < g_item_docs.length; i++) {
        data['datasets'][0]['data'].push({
            x: parseInt(g_item_docs[i]['time noticed']),
            y: g_item_docs[i]['intensity']
        });
    }
    console.log(data['datasets'][0]['data']);

    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, rmin: 1, rmax: 1, min: 0, max: 100};


    new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'scatter',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: 'Chart.js Scatter Chart'
                    }
                }
            }
        }
    );
}

//////////////////////////////////////////////////////////////////////////////////////////
