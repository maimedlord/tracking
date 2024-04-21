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
            list_div.innerHTML = '';
            // NEED TO HANDLE ALL RETURNS
            //responseMessage.textContent = data;
            data = JSON.parse(data);
            console.log(data);
            // pull out meta object:
            item_meta = data[0];
            console.log(data.length);
            for (i = 1; i < data.length; i++) {
                temp_div = document.createElement('div');
                temp_div.className = 'item_div';
                for (attribute of Object.keys(data[i])) {
                    temp_div.innerHTML += attribute + ': ' + data[i][attribute] + '<br>';
                }
                list_div.append(temp_div);
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload=function () {
    console.log(g_item_name);
    refresh_item_docs();
}