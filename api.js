const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'http://127.0.0.1:5501'

// 회원가입 API
async function handleSignup() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/user/signup/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    // 로그인이 성공하면 홈으로 이동
    if (response.status == 201) {
        location.replace("home.html")
    }else{
        // 팝업
    }
}

// 로그인 API
async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/user/api/token/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
   

    // 로컬스토리지에 토큰 저장
    const response_json = await response.json()
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    // 로컬스토리지에 토큰 정보 저장
    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem("payload", jsonPayload);

    // 로그인이 성공하면 홈으로 이동
    if (response.status == 200) {
        location.replace("home.html")
    }else{
        // 팝업
    }
}


// 로그인 시 정보 가져오기
async function getName() {
    const response = await fetch(`${backend_base_url}/user/mock/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        }
    })

    if (response.status == 200) {
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)
        console.log(payload_parse.username)
        return payload_parse.username
    } else {
        return null
    }
}


// 로그아웃
function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}/home.html`)
}



// 게시글 GET
async function getPosts(){
    const response = await fetch(`${backend_base_url}/post/`, {
        method:'GET',
    })
    response_json = await response.json()
    return response_json
}

// 이미지 POST
async function postImage(){
    const image = document.getElementById("before_image").files[0]
    const imageData = new FormData()
    imageData.append("image",image)

    const response = await fetch(`${backend_base_url}/post/upload/`, {
        method:'POST',
        body: imageData
    })

    response_json = await response.json()
    return response_json
}

// 이미지 GET
async function getImages(){
    const response = await fetch(`${backend_base_url}/post/`, {
        method:'GET',
    })
    response_json = await response.json()
    return response_json
}

// 게시글 POST
async function postPost(image, content){
    const postData = {
        "image":image,
        "content":content
    } 
    
    const response = await fetch(`${backend_base_url}/post/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access")
        },
        method:'POST',
        body:JSON.stringify(postData)
    })

    response_json = await response.json()
    return response_json
}

// 상세 페이지로 이동
function postDetail(post_id){
    const url = `${frontend_base_url}/post_view.html?id=${post_id}`
    location.href=url
}

// 상세 페이지 GET
async function getPostDetail(post_id){
    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        method:'GET'
    })

    response_json = await response.json()
    return response_json
}

// 상세 페이지 PUT
async function putPost(post_id, content){
    const postData = {
        "content":content
    }

    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method:'PUT',
        body:JSON.stringify(postData)
    })

    if(response.status){
        response_json = await response.json()
        return response_json
    }else{
        alert(response.status)
    }
}

// 상세 페이지 DELETE
async function deletePost(post_id){
    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access")
        },
        method:'DELETE',
    })

    if(response.status == 204){
        window.location.replace(`${frontend_base_url}/home.html`)
    }else{
        alert(response.status)
    }
} 

// 댓글 GET
async function getComments(){
    const response = await fetch(`${backend_base_url}/post/${post_id}/comment/`, {
        method:'GET',
    })

    response_json = await response.json()
    return response_json
}

