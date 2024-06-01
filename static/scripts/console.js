// create_button
create_on = false;
document.getElementById('create_button').onclick=function (){
    if (!create_on){
        document.getElementById('item_or_view').style.display = 'flex';
        create_on = true;
    }
    else {
        document.getElementById('item_or_view').style.display = 'none';
        create_on = false;
    }
}
// create_item_button
create_item_on = false;
document.getElementById('create_item_button').onclick=function (){
    if (!create_item_on) {
        document.getElementById('create_item_input').style.display = 'flex';
        document.getElementById('create_view_input').style.display = 'none';
        create_view_on = false;
        create_item_on = true;
    }
    else {
        document.getElementById('create_item_input').style.display = 'none';
        document.getElementById('create_view_input').style.display = 'flex';
        create_view_on = true;
        create_item_on = false;
    }
}
// create_view_button
create_view_on = false;
document.getElementById('create_view_button').onclick=function (){
    if (!create_view_on) {
        document.getElementById('create_view_input').style.display = 'flex';
        document.getElementById('create_item_input').style.display = 'none';
        create_item_on = false;
        create_view_on = true;
    }
    else {
        document.getElementById('create_view_input').style.display = 'none';
        document.getElementById('create_item_input').style.display = 'flex';
        create_item_on = true;
        create_view_on = false;
    }
}
// submit_create_item
document.getElementById('submit_create_item').onclick=function (){
    let item_color = document.getElementById('color').value;
    let item_keywords = document.getElementById('keywords').value;
    let item_name = document.getElementById('name').value;
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
            api_response = document.getElementById('api_response')
            api_response.textContent = data;
            api_response.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}