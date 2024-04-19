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
//
document.getElementById('submit_create_item').onclick=function (){

}