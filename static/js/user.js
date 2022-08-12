const secret_key = document.getElementById('secret_key');
const user_ID = document.getElementById('user_ID');
const username = document.getElementById('username');
const username_in = document.getElementById('username_in');

const message = document.getElementById('chat_entered');
const global_message = document.getElementById('global_chat');

function uid() {
    return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
};

function generatekey(){
    console.log("generating new ID")
    secret_key.value = uid()
}

function create_account(){
    console.log("creating new account")
    
    let xhr = new XMLHttpRequest();
    formData = new FormData();

    formData.append('new_username',username_in.value);
    formData.append('new_user_ID',user_ID.innerHTML);

    xhr.open('POST',requestURL+'/create_account',true);
    xhr.onload = function () {
        var data = JSON.parse(this.response)
        if (xhr.status >= 200 && xhr.status < 400) {
            if (data.valid == 1){
                console.log('account created')
                username.innerHTML = username_in.value
            }
        } else {
        console.log('account creation error')
        }
    }
    xhr.send(formData);

}

function close(){    
    let xhr = new XMLHttpRequest();
    formData = new FormData();

    formData.append('user_ID',user_ID.innerHTML);

    xhr.open('POST',requestURL+'/close_account',true);
    xhr.onload = function () {
        var data = JSON.parse(this.response)
        if (xhr.status >= 200 && xhr.status < 400) {
            if (data.valid == 1){
                console.log('user_logged_off')
            }
        } else {
        console.log('error')
        }
    }
    xhr.send(formData);

}

function reload(){
    console.log('reset')
    let xhr = new XMLHttpRequest();
    formData = new FormData();
    formData.append('gameID',secret_key.value);

    user_ID.innerHTML = uid()
    
    xhr.open('POST',requestURL+'/reset',true)
    xhr.onload = function () {
        var data = JSON.parse(this.response)
        if (xhr.status >= 200 && xhr.status < 400) {
            if (data.valid == 1){
                game.update(data.array)
            }
            picked_up = [null,null]
            game.draw(gp_ctx)
            game.draw(gpu_ctx,false)
        } else {
        console.log('error')
        }
    }
    xhr.send(formData)
}

function join_game(){
    myId = secret_key.value
    formData = new FormData();
    formData.append('gameID',myId);
    formData.append('userId',user_ID.innerHTML);

    let xhr = new XMLHttpRequest();
    xhr.open('POST',requestURL+'/start_game',true);
    xhr.onload = function () {
        var data = JSON.parse(this.response)
        if (xhr.status >= 200 && xhr.status < 400) {
            if (data.valid == 1){
                game.update(data.array)
            }
            picked_up = [null,null]
            game.draw(gp_ctx)
            game.draw(gpu_ctx,false)
        } else {
        console.log('error')
        }
    }
    xhr.send(formData);
}

function send_message(){
    message_input = message.value
    console.log(message_input)
    myId = secret_key.value
    formData = new FormData();
    formData.append('gameID',myId);
    formData.append('userId',user_ID.innerHTML);
    formData.append('message',message_input);
    let xhr = new XMLHttpRequest();
    xhr.open('POST',requestURL+'/new_message',true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            console.log('message_sent')
        } 
        else {
            console.log('error')
        }
    }
    xhr.send(formData);
}