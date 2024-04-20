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
            console.log(data);
            data_array = data.split('"');
            for (var i = data_array.length - 1; i >= 0; i--) {
                // remove element if index is odd
                if (i % 2 == 0) {
                    data_array.splice(i, 1);
                }
            }
            console.log(data_array);
            item_list.innerHTML = '';
            for (i = 0; i < data_array.length; i++) {
                temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                temp_div.textContent = data_array[i];
                item_list.append(temp_div);
            }
            console.log('end of the good then');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

refresh_item_list();