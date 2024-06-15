let api_response = document.getElementById('api_response');
let button_create_item = document.getElementById('button_create_item');
let button_create_item_submit = document.getElementById('button_create_item_submit');
let button_refresh_list = document.getElementById('button_refresh_list');
let button_track_item = document.getElementById('button_track_item');
let button_track_item_submit = document.getElementById('button_track_item_submit');
let choose_item = document.getElementById('choose_item');
let create_item_input = document.getElementById('create_item_input');
let intensity = document.getElementById('intensity');
let item_list = document.getElementById('item_list');
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
let sort_items_input = document.getElementById('sort_items_input');
let track_item_input = document.getElementById('track_item_input');

//
async function btn_pop_back(element, parent_element) {
    element.style.boxShadow = 'inset 3px 3px 0px black';
    await sleep(1000);
    element.style.boxShadow = '3px 3px 0px black';
    await sleep(250);
    if (parent_element) {
        parent_element.style.display = 'none';
    }
}

function close_div(div_element_name) {
    document.getElementById(div_element_name).style.display = 'none';
}

// refresh item list
function refresh_item_list() {
    item_list = document.getElementById('item_list');

    const api_url = 'http://127.0.0.1:5000/item_refresh_list';

    fetch(api_url, {method: 'GET'})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            // convert response from string to JSON
            data = JSON.parse(data);
            // handle error/failed response:
            if (!typeof data == 'object' || (typeof data == 'object' && data['status'] != 'success')) {
                item_list.innerHTML += data['data'];
                return
            }
            //
            else {
                data = data['data'];
                //console.log(data);
                item_list.innerHTML = '';
                choose_item.innerHTML = '<option value="" disabled selected>select item</option>';
                // processes an array of item meta documents
                for (let i = 0; i < data.length; i++) {
                    let item_div_nav = document.createElement('div');
                    item_div_nav.className = 'item_div_nav';
                    let temp_div = document.createElement('div');
                    let nav_div_mv = document.createElement('div');
                    nav_div_mv.className = 'box_shadow_lr';
                    nav_div_mv.id = 'nav_div_mv'
                    nav_div_mv.setAttribute('onclick', 'location.href=\'/item_manage/' + data[i]['item_name'] + '\'');
                    nav_div_mv.textContent = 'manage or view this item';
                    let nav_div_tracking = document.createElement('div');
                    nav_div_tracking.className = 'box_shadow_lr';
                    nav_div_tracking.id = 'nav_div_tracking'
                    nav_div_tracking.setAttribute('onclick', 'set_track_item(\'' + data[i]['item_name'] + '\')');
                    nav_div_tracking.textContent = 'track this item';
                    temp_div.innerHTML += '<b>' + data[i]['item_name'] + '</b>';
                    temp_div.setAttribute('data-item_name', data[i]['item_name']);
                    let temp_date_created = new Date(data[i]['date_created']);
                    let temp_date_tracked = new Date(data[i]['date_last_noticed']);
                    for (let key of Object.keys(data[i])) {
                        if (key == 'color') {
                            temp_div.style.borderColor = data[i]['color'];
                            temp_div.innerHTML += '<div class="width_full" style="background-color:' + data[i]['color'] + ';">' + 'color: ' + data[i]['color'] + '</div>';
                        }
                        else if (key == 'keywords') {
                            temp_div.innerHTML += 'keywords: ' + data[i][key] + '<br>';
                        }
                        else if (key == 'item_count') {
                            temp_div.innerHTML += '# of times tracked: ' + data[i][key] + '<br>';
                            temp_div.setAttribute('data-item_count', data[i][key]);
                        }
                        else if (key == 'date_last_noticed') {
                            temp_div.innerHTML += 'last tracked: ' + temp_date_tracked + '<br>';
                            temp_div.setAttribute('data-date_tracked', String(temp_date_tracked.getTime()));
                        }
                        else if (key == 'date_created') {
                            temp_div.innerHTML += 'created: ' + temp_date_created + '<br>';
                            temp_div.setAttribute('data-date_created', String(temp_date_created.getTime()));
                        }
                    }
                    item_div_nav.append(nav_div_mv);
                    item_div_nav.append(nav_div_tracking);
                    temp_div.append(item_div_nav);
                    temp_div.className = 'item_div';
                    item_list.append(temp_div);
                    //
                    temp_div = document.createElement('option');
                    temp_div.value = data[i]['item_name'];
                    temp_div.textContent = data[i]['item_name'];
                    temp_div.title = data[i]['item_name'];
                    choose_item.append(temp_div);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//
function set_track_item(item_name) {
    choose_item.value = item_name;
    track_item_input.style.display = 'flex';
}

// create_item_button
create_item_on = false;
document.getElementById('button_create_item').onclick=function (){
    if (!create_item_on) {
        document.getElementById('create_item_input').style.display = 'flex';
        create_item_on = true;
    }
    else {
        document.getElementById('create_item_input').style.display = 'none';
        create_item_on = false;
    }
}

/*
    onclicks
 */
button_create_item.onclick=async () => {
    //api_response.style.display = 'none';
    //button_create_item.style.boxShadow = 'inset 3px 3px 0px black';
    track_item_input.style.display = 'none';
    create_item_input.style.display = 'flex';
    // await sleep(1000);
    // button_create_item.style.boxShadow = '3px 3px 0px black';
    btn_pop_back(button_create_item);
}
button_create_item_submit.onclick=async () => {
    //button_create_item_submit.style.boxShadow = 'inset 3px 3px 0px black';
    let item_name = document.getElementById('name').value;
    item_name = item_name.trim();
    let item_keywords = document.getElementById('keywords').value;
    item_keywords = item_keywords.trim();
    let item_color = document.getElementById('item_color').value;
    // validate input:
    if (item_name.length < 1 || item_keywords.length < 1) {
        api_response.textContent = 'The item name and keywords cannot be blank';
        api_response.style.display = 'flex';
        // await sleep(1000);
        // button_create_item_submit.style.boxShadow = '3px 3px 0px black';
        btn_pop_back(button_create_item_submit, create_item_input);
        return;
    }

    const api_url = 'http://127.0.0.1:5000/item_create/' + JSON.stringify({
        // cannot include '#' as it messes with python decoder
        'color': item_color.substr(1, item_color.length),
        'keywords': item_keywords,
        'name': item_name
    });
    console.log(api_url);
    // NEED validate input
    // const request_options = {
    //     method: 'POST',
    //     body: {
    //         'name': item_name,
    //         'keywords': item_keywords
    //     }
    // };

    fetch(api_url, {method: 'POST'})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            data = JSON.parse(data);
            if (typeof data === 'object' && data['status'] == 'success') {
                api_response.textContent = item_name + ' was successfully created!';
                api_response.style.display = 'flex';
                refresh_item_list();
            }
            else {
                api_response.textContent = 'there was an error creating your item...';
                api_response.style.display = 'flex';
                refresh_item_list();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // await sleep(1000);
    // button_create_item_submit.style.boxShadow = '3px 3px 0px black';
    btn_pop_back(button_create_item_submit, create_item_input);
}
button_refresh_list.onclick=async () => {
    api_response.style.display = 'none';
    button_refresh_list.style.boxShadow = 'inset 3px 3px 0px black';
    refresh_item_list();
    // await sleep(1000);
    // button_refresh_list.style.boxShadow = '3px 3px 0px black';
    btn_pop_back(button_refresh_list, null);
}
button_track_item.onclick=async () => {
    //api_response.style.display = 'none';
    button_track_item.style.boxShadow = 'inset 3px 3px 0px black';
    create_item_input.style.display = 'none';
    track_item_input.style.display = 'flex';
    // await sleep(1000);
    // button_track_item.style.boxShadow = '3px 3px 0px black';
    btn_pop_back(button_track_item, null);
}
button_track_item_submit.onclick=async () => {
    button_track_item_submit.style.boxShadow = 'inset 3px 3px 0px black';
    //
    if (parseInt(intensity.value) < 1 || parseInt(intensity.value) > 100 || intensity.value == "") {
        api_response.textContent = 'the \'intensity\' field cannot be blank and must be between 1 and 100';
        api_response.style.display = 'flex';
        // await sleep(1000);
        // button_track_item_submit.style.boxShadow = '3px 3px 0px black';
        btn_pop_back(button_track_item_submit, track_item_input);
        return;
    }
    let item_name = document.getElementById('choose_item').value;
    if (item_name == '') {
        api_response.textContent = 'an item must be chosen';
        api_response.style.display = 'flex';
        // await sleep(1000);
        // button_track_item_submit.style.boxShadow = '3px 3px 0px black';
        btn_pop_back(button_track_item_submit, track_item_input);
        return;
    }
    let color = document.getElementById('color').value;
    const api_url = 'http://127.0.0.1:5000/item_track_api/' + JSON.stringify({
        // cannot include '#' as it messes with python decoder
        'item name': item_name,
        'color': color.substr(1, color.length),
        'feeling after': document.getElementById('feeling after').value,
        'feeling before': document.getElementById('feeling before').value,
        'intensity': intensity.value,
        'notes': document.getElementById('notes').value,
        'response method': document.getElementById('response method').value,
        'time duration': document.getElementById('time duration').value,
        'time noticed': document.getElementById('time noticed').value
    });
    // NEED validate input
    // const request_options = {
    //     method: 'POST',
    //     body: {
    //         'name': item_name,
    //         'keywords': item_keywords
    //     }
    // };

    fetch(api_url, {method: 'POST'})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
             data = JSON.parse(data);
             if (typeof data === 'object' && data['status'] == 'success') {
                api_response.textContent = item_name + ' was successfully tracked!';
                api_response.style.display = 'flex';
                refresh_item_list();
            }
            else {
                api_response.textContent = 'there was an error tracking your item...';
                api_response.style.display = 'flex';
                refresh_item_list();
            }
            // reset track item inputs to default values
            track_item_inputs = document.getElementsByClassName('track_item_form_input');
            for (let i = 0; i < track_item_inputs.length; i++) {
                track_item_inputs[i].value = '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // await sleep(1000);
    // button_track_item_submit.style.boxShadow = '3px 3px 0px black';
    btn_pop_back(button_track_item_submit, track_item_input);
}
sort_items_input.onclick=function () {
    // exit if empty input
    if (sort_items_input.value == '') {
        return;
    }
    let sorted_arr = Array.from(item_list.childNodes);
    item_list.innerHTML = '';
    if (sort_items_input.value == 'timestracked,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.item_count - b.dataset.item_count);
    }
    else if (sort_items_input.value == 'timestracked,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.item_count - a.dataset.item_count);
    }
    else if (sort_items_input.value == 'date,created,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_created - b.dataset.date_created);
    }
    else if (sort_items_input.value == 'date,created,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_created - a.dataset.date_created);
    }
    else if (sort_items_input.value == 'date,tracked,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.date_tracked - b.dataset.date_tracked);
    }
    else if (sort_items_input.value == 'date,tracked,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.date_tracked - a.dataset.date_tracked);
    }
    else if (sort_items_input.value == 'name,ascending') {
        sorted_arr = sorted_arr.sort((a, b) => a.dataset.item_name.toLowerCase() - b.dataset.item_name.toLowerCase());
    }
    else if (sort_items_input.value == 'name,descending') {
        sorted_arr = sorted_arr.sort((a, b) => b.dataset.item_name.toLowerCase() - a.dataset.item_name.toLowerCase());
    }
    // redraw newly sorted items
    for (let element of sorted_arr) {
        item_list.append(element);
    }
}

/*
    onload
 */

window.onload=function () {
    refresh_item_list();
}