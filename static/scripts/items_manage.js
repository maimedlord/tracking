// refresh item list
function refresh_item_list() {
    item_list = document.getElementById('item_list');
    console.log(item_list);
    item_list.append('whaatttttt');

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
            data_array = JSON.parse(data);
            console.log(data_array);
            item_list.innerHTML = '';
            for (i = 0; i < data_array.length; i++) {
                brk = document.createElement('br');
                link_manage = document.createElement('a');
                link_manage.setAttribute('href', 'http://127.0.0.1:5000/item_manage/' + data_array[i]['item_name']);
                link_manage.innerHTML = 'manage this item';
                link_track = document.createElement('a');
                link_track.setAttribute('href', 'http://127.0.0.1:5000/item_track/' + data_array[i]['item_name']);
                link_track.innerHTML = 'track this item';
                temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                temp_div.textContent = data_array[i]['item_name'] + ' -------- item count: ' + data_array[i]['item_count'];
                temp_div.appendChild(link_track);
                temp_div.appendChild(brk);
                temp_div.appendChild(link_manage);
                item_list.append(temp_div);
            }
            console.log('end of the good then');
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
    item_name = document.getElementById('name').value;
    item_keywords = document.getElementById('keywords').value;
    const api_url = 'http://127.0.0.1:5000/item_create/' + JSON.stringify({
        'name': item_name,
        'keywords': item_keywords
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