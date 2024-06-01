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
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// create_item_button
create_item_on = false;
document.getElementById('create_item_button').onclick=function (){
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
document.getElementById('submit_create_item').onclick=function (){
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
            api_response = document.getElementById('api_response');
            api_response.textContent = data;
            api_response.style.display = 'flex';
            refresh_item_list();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('r_dev').onclick=function (){
    refresh_item_list();
}

window.onload=function () {
    refresh_item_list();
}