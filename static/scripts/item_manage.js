// global variables
const API_URL = 'http://127.0.0.1:5000/item_doc_refresh_list/' + g_item_name;
const DATE_TODAY = new Date();
const DATE_TOMORROW = new Date().setDate(DATE_TODAY + 1);
let GRAPH_DATA_OBJECT = {};
let ITEM_DOCS = "";
let THE_CHART = {};

// global element variables
let DIV_BUTTONS = document.getElementById('temp_buttons');
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
            THE_CHART = new Chart(
                document.getElementById('item_graph_canvas'),
                {
                    type: 'bubble',
                    data: GRAPH_DATA_OBJECT,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {position: 'top'},
                            title: {
                                display: true,
                                text: ITEM_DOCS[0]['name'] + ' bubble chart all time to today'
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day'
                                },
                                max: DATE_TOMORROW
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
            // enable display of graph interaction buttons
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

// last week
div_graph_button_last_week = document.getElementById('graph_button_last_week');
div_graph_button_last_week.onclick=function () {
    div_graph_button_last_week.style.backgroundColor = 'grey';
    // destroy chart so that its canvas can be reused
    THE_CHART.destroy();
    THE_CHART = new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'bubble',
            data: GRAPH_DATA_OBJECT,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart by week'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        max: DATE_TOMORROW,
                        min: new Date().setDate(DATE_TODAY.getDate() - 8)
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

// last month
div_graph_button_last_month = document.getElementById('graph_button_last_month');
div_graph_button_last_month.onclick=function () {
    div_graph_button_last_month.style.backgroundColor = 'grey';
    THE_CHART.destroy();
    THE_CHART = new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'bubble',
            data: GRAPH_DATA_OBJECT,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart by month'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        max: DATE_TOMORROW,
                        min: new Date().setDate(DATE_TODAY.getDate() - 31)
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

// last qtr
div_graph_button_last_qtr = document.getElementById('graph_button_last_qtr');
div_graph_button_last_qtr.onclick=function () {
    div_graph_button_last_qtr.style.backgroundColor = 'grey';
    THE_CHART.destroy();
    THE_CHART = new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'bubble',
            data: GRAPH_DATA_OBJECT,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart by qtr'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        max: DATE_TOMORROW,
                        min: new Date().setDate(DATE_TODAY.getDate() - (31 * 3))
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

// last year
div_graph_button_last_year = document.getElementById('graph_button_last_year');
div_graph_button_last_year.onclick=function () {
    div_graph_button_last_year.style.backgroundColor = 'grey';
    THE_CHART.destroy();
    THE_CHART = new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'bubble',
            data: GRAPH_DATA_OBJECT,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart by year'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        max: DATE_TOMORROW,
                        min: new Date().setDate(DATE_TODAY.getDate() - 365)
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

// all time to today
div_graph_button_all_time_today = document.getElementById('graph_button_all_time_today');
div_graph_button_all_time_today.onclick=function () {
    div_graph_button_all_time_today.style.backgroundColor = 'grey';
    THE_CHART.destroy();
    THE_CHART = new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'bubble',
            data: GRAPH_DATA_OBJECT,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart all time to today'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        max: DATE_TODAY,
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
    console.log('all time today');
}

// all time
div_graph_button_all_time = document.getElementById('graph_button_all_time');
div_graph_button_all_time.onclick=function () {
    div_graph_button_all_time.style.backgroundColor = 'grey';
    THE_CHART.destroy();
    THE_CHART = new Chart(
        document.getElementById('item_graph_canvas'),
        {
            type: 'bubble',
            data: GRAPH_DATA_OBJECT,
            options: {
                responsive: true,
                plugins: {
                    legend: {position: 'top'},
                    title: {
                        display: true,
                        text: ITEM_DOCS[0]['name'] + ' bubble chart all time'
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
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