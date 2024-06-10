// global variables
const API_URL = 'http://127.0.0.1:5000/item_doc_refresh_list/' + g_item_name;
let GRAPH_DATA_OBJECT = {};
let ITEM_DOCS = "";

// global element variables
let nav_graph_buttons = document.getElementById('nav_graph_buttons');
let item_doc_list = document.getElementById('item_doc_list');

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
                let temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                temp_div.style.borderColor = ITEM_DOCS[i]['color'];
                temp_div.style.backgroundColor = hexToRgb(ITEM_DOCS[i]['color'], opacity_amt_8);
                for (attribute of Object.keys(ITEM_DOCS[i])) {
                    temp_div.innerHTML += attribute + ': ' + ITEM_DOCS[i][attribute] + '<br>';
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
                console.log('item_manage', ITEM_DOCS[i]['time noticed']);
                GRAPH_DATA_OBJECT['datasets'][0]['data'].push({
                    x: temp_date,
                    y: temp_date.getHours() + (temp_date.getMinutes() / 60),
                    r: parseInt(ITEM_DOCS[i]['intensity']) / 2
                });
                //
                GRAPH_DATA_OBJECT['datasets'][0]['backgroundColor'].push(hexToRgb(ITEM_DOCS[i]['color'], opacity_amt_65));
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

window.onload=function () {
    get_item_docs();
}

/*
...
 */

/*
    onclicks
 */