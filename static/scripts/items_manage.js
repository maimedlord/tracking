let api_response = document.getElementById('api_response');
let button_create_item = document.getElementById('button_create_item');
let button_create_item_submit = document.getElementById('button_create_item_submit');
let button_refresh_list = document.getElementById('button_refresh_list');
let button_track_item = document.getElementById('button_track_item');
let button_track_item_submit = document.getElementById('button_track_item_submit');
let choose_item = document.getElementById('choose_item');
let create_item_input = document.getElementById('create_item_input');
let intensity = document.getElementById('intensity');
let track_item_input = document.getElementById('track_item_input');
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

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
                item_list.innerHTML = '';
                choose_item.innerHTML = '<option value="" disabled selected>select item</option>';
                // processes an array of item meta documents
                for (let i = 0; i < data.length; i++) {
                    let temp_div = document.createElement('div');
                    temp_div.innerHTML += '<b>' + data[i]['item_name'] + '</b><br>';
                    for (const attribute of Object.keys(data[i])) {
                        temp_div.innerHTML += (attribute + ': ' + data[i][attribute] + '<br>');
                    }
                    link_manage = document.createElement('a');
                    link_manage.setAttribute('href', 'http://127.0.0.1:5000/item_manage/' + data[i]['item_name']);
                    link_manage.innerHTML += 'manage, view this item';
                    link_track = document.createElement('a');
                    link_track.setAttribute('href', 'http://127.0.0.1:5000/item_track/' + data[i]['item_name']);
                    link_track.innerHTML += 'track this item';
                    temp_div.appendChild(link_manage);
                    temp_div.appendChild(document.createElement('br'));
                    temp_div.appendChild(link_track);
                    temp_div.appendChild(document.createElement('br'));
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
// submit_create_item
// document.getElementById('button_create_item_submit').onclick=function (){
//     let item_name = document.getElementById('name').value;
//     let item_keywords = document.getElementById('keywords').value;
//     let item_color = document.getElementById('color').value;
//     console.log(item_color);
//     const api_url = 'http://127.0.0.1:5000/item_create/' + JSON.stringify({
//         // cannot include '#' as it messes with python decoder
//         'color': item_color.substr(1, item_color.length),
//         'keywords': item_keywords,
//         'name': item_name
//     });
//     // NEED validate input
//     // const request_options = {
//     //     method: 'POST',
//     //     body: {
//     //         'name': item_name,
//     //         'keywords': item_keywords
//     //     }
//     // };
//
//     fetch(api_url, {method: 'POST'})
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(data => {
//             //responseMessage.textContent = data;
//             div_api_response = document.getElementById('api_response');
//             api_response.textContent = data;
//             api_response.style.display = 'flex';
//             refresh_item_list();
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

/*
    onclicks
 */
button_create_item.onclick=async () => {
    button_create_item.style.boxShadow = 'inset 3px 3px 0px black';
    track_item_input.style.display = 'none';
    create_item_input.style.display = 'flex';
    await sleep(1000);
    button_create_item.style.boxShadow = '3px 3px 0px black';
}
button_create_item_submit.onclick=async () => {
    button_create_item_submit.style.boxShadow = 'inset 3px 3px 0px black';
    let item_name = document.getElementById('name').value;
    let item_keywords = document.getElementById('keywords').value;
    let item_color = document.getElementById('color').value;
    console.log(item_color);
    const api_url = 'http://127.0.0.1:5000/item_create/' + JSON.stringify({
        // cannot include '#' as it messes with python decoder
        'color': item_color.substr(1, item_color.length),
        'keywords': item_keywords,
        'name': item_name
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
            //responseMessage.textContent = data;
            div_api_response = document.getElementById('api_response');
            api_response.textContent = data;
            api_response.style.display = 'flex';
            refresh_item_list();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    await sleep(1000);
    button_create_item_submit.style.boxShadow = '3px 3px 0px black';
}
button_refresh_list.onclick=async () => {
    button_refresh_list.style.boxShadow = 'inset 3px 3px 0px black';
    refresh_item_list();
    await sleep(1000);
    button_refresh_list.style.boxShadow = '3px 3px 0px black';
}
button_track_item.onclick=async () => {
    button_track_item.style.boxShadow = 'inset 3px 3px 0px black';
    create_item_input.style.display = 'none';
    track_item_input.style.display = 'flex';
    await sleep(1000);
    button_track_item.style.boxShadow = '3px 3px 0px black';
}
button_track_item_submit.onclick=async () => {
    //
    if (parseInt(intensity.value) < 1 || parseInt(intensity.value) > 100 || intensity.value == "") {
        api_response.textContent = 'the \'intensity\' field cannot be blank and must be between 1 and 100';
        api_response.style.display = 'flex';
        return;
    }
    const api_url = 'http://127.0.0.1:5000/item_track_api/' + JSON.stringify({
        // cannot include '#' as it messes with python decoder
        'color': document.getElementById('color').value.replace('#', ''),
        'feeling after': document.getElementById('feeling after').value,
        'feeling before': document.getElementById('feeling before').value,
        'intensity': intensity.value,
        'notes': document.getElementById('notes').value,
        'response method': document.getElementById('response method').value,
        'time duration': document.getElementById('time duration').value,
        'time noticed': document.getElementById('time noticed').value
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
            console.log('fetsched data: ', data);
            //responseMessage.textContent = data;
            api_response.textContent = data;
            api_response.style.display = 'flex';
            refresh_item_list();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/*
    onload
 */

window.onload=function () {
    refresh_item_list();
}