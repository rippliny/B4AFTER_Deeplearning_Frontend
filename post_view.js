// 게시글 url 가져오기 
const urlParams = new URLSearchParams(window.location.search)
const post_id = urlParams.get('id')

// 로그인 확인
async function checkLogin() {
    const name = await getName();
    const loginoutButton = document.getElementById("loginout")

    if(name){
        loginoutButton.innerText = "로그아웃"
        loginoutButton.setAttribute("onclick", "logout()")
    }else{
        loginoutButton.innerText = "로그인"
        loginoutButton.setAttribute("onclick", "location.href='/login.html'")
        
        const update_post = document.getElementById("update_post")
        const delete_post = document.getElementById("delete_post")

        update_post.style.visibility = "hidden"
        delete_post.style.visibility = "hidden"   
    }
}

// 상세 페이지 게시글 보기
async function loadPostDetail(post_id){
    const updatePostCancelButton = document.getElementById("update_post_cancel_button")
    const post = await getPostDetail(post_id)
    
    if(updatePostCancelButton){
        updatePostCancelButton.remove()
    }

    const postImage = document.getElementById("image")
    const postUser = document.getElementById("post_user")
    const postContent = document.getElementById("post_content")
    const postTime = document.getElementById("time")

    postImage.setAttribute("src", `${backend_base_url}${post.image.after_image}`)
    postUser.innerText = post.user
    postContent.innerText = post.content
    postTime.innerText = post.update_at
    
    // 상세 페이지 댓글 보기
    const comments = await getComments()
    const comment_list = document.getElementById("comment_list")
    comment_list.innerHTML = ''
    
    for(let i = 0; i < comments.length; i++){        
        const newComment = document.createElement("div")
        newComment.setAttribute("id", `comment_content_${comments[i].id}`)

        // 댓글 작성자
        const newCommentUser = document.createElement("small")
        newCommentUser.innerText = comments[i].user
        newCommentUser.setAttribute("id", `comment_user_${comments[i].id}`)

        // 댓글 내용
        const newCommentContent = document.createElement("p")
        newCommentContent.innerText = comments[i].content
        newCommentContent.setAttribute("id", `new_comment_content_${comments[i].id}`)
        
        // 댓글 작성 날짜
        const newCommentTime = document.createElement("small")
        newCommentTime.innerText = comments[i].update_at
        newCommentTime.setAttribute("id", `comment_time_${comments[i].id}`)

        // 댓글 버튼들
        const commentButtons = document.createElement("div")
        commentButtons.setAttribute("id", `comment_buttons_${comments[i].id}`)
        commentButtons.style.display = "flex"

        // 댓글 업데이트 버튼들
        const updateCommentButtons = document.createElement("div")
        updateCommentButtons.setAttribute("id", `update_comment_buttons_${comments[i].id}`)
        updateCommentButtons.style.display = "flex"

        // 댓글 수정 버튼    
        const updateCommentButton = document.createElement("button")
        updateCommentButton.innerText = '\u00a0수정\u00a0'
        updateCommentButton.setAttribute("type", "button")
        updateCommentButton.setAttribute("id", `${comments[i].id}`)
        updateCommentButton.setAttribute("onclick", "updateCommentMode(this.id)")

        //댓글 삭제 버튼
        const deleteCommentButton = document.createElement("button")
        deleteCommentButton.innerText = '\u00a0삭제\u00a0'
        deleteCommentButton.setAttribute("type", "button")
        deleteCommentButton.setAttribute("id", `${comments[i].id}`)
        deleteCommentButton.setAttribute("onclick", "deleteCommenteMode(this.id)")
       
        updateCommentButtons.appendChild(updateCommentButton)
        commentButtons.appendChild(updateCommentButtons)
        commentButtons.appendChild(deleteCommentButton)
        newComment.appendChild(newCommentUser)
        newComment.appendChild(newCommentContent)
        newComment.appendChild(commentButtons)
        comment_list.appendChild(newComment)
    }
}

//게시글 수정 화면
async function updatePostMode(){
    // 게시글 작성자 확인
    const postUser = document.getElementById("post_user")
    var payload = localStorage.getItem("payload")
    var parsed_payload = await JSON.parse(payload)

    if(parsed_payload == null || parsed_payload.username != postUser.innerText){
        alert('수정 권한이 없습니다')
    }else{
        const postContent = document.getElementById("post_content")
        postContent.style.visibility = "hidden"

        const inputPostContent = document.createElement("textarea")
        inputPostContent.setAttribute("id", "input_post_content")
        inputPostContent.innerText = postContent.innerHTML
        inputPostContent.rows = 1
        inputPostContent.cols = 50

        const newPostContent = document.getElementById("new_post_content")
        newPostContent.insertBefore(inputPostContent, postContent)

        const updatePostButton = document.getElementById("update_post")
        updatePostButton.setAttribute("onclick", "updatePost()")
        updatePostButton.innerHTML = `<span class="material-symbols-outlined">edit</span>수정 완료`
        
        const updatePostCancelButton = document.createElement("p")
        updatePostCancelButton.setAttribute("id", `update_post_cancel_button`)
        updatePostCancelButton.setAttribute("onclick", "updatePostCancelButton()")
        updatePostCancelButton.innerHTML = `<span class="material-symbols-outlined">edit</span>수정 취소`
        
        const updatePostButtons = document.getElementById("update_post_buttons")
        updatePostButtons.appendChild(updatePostCancelButton)
    }
}

// 게시글 수정
async function updatePost(){
    var inputPostContent = document.getElementById("input_post_content")
    await putPost(post_id, inputPostContent.value)

    inputPostContent.remove()
    
    const postContent = document.getElementById("post_content")
    postContent.style.visibility = "visible"

    const updatePostButton = document.getElementById("update_post")
    updatePostButton.setAttribute("onclick", "updatePostMode()")
    updatePostButton.innerHTML = `<span class="material-symbols-outlined">edit</span>수정`
    
    const updatePostCancelButton = document.getElementById("update_post_cancel_button")
    updatePostCancelButton.innerHTML = ''
    
    loadPostDetail(post_id)
}

// 게시글 수정 취소
function updatePostCancelButton(){
    var inputPostContent = document.getElementById("input_post_content")
    inputPostContent.remove()
    
    const postContent = document.getElementById("post_content")
    postContent.style.visibility = "visible"

    const updatePostButton = document.getElementById("update_post")
    updatePostButton.setAttribute("onclick", "updatePostMode()")
    updatePostButton.innerHTML = `<span class="material-symbols-outlined">edit</span>수정`

    const updatePostCancelButton = document.getElementById("update_post_cancel_button")
    updatePostCancelButton.innerHTML = ''

    loadPostDetail(post_id)
}

// 게시글 삭제
async function deletePostMode() {
    await deletePost(post_id)
}

//댓글 수정 화면
async function updateCommentMode(comment_id){
    // 댓글 작성자 확인
    const commentUser = document.getElementById(`comment_user_${comment_id}`)
    var payload = localStorage.getItem("payload")
    var parsed_payload = await JSON.parse(payload)

    if(parsed_payload == null || parsed_payload.username != commentUser.innerText){
        alert('수정 권한이 없습니다')
 
    }else{
        const newCommentContent = document.getElementById(`new_comment_content_${comment_id}`)
        newCommentContent.style.visibility = "hidden"

        const inputCommentContent = document.createElement("textarea")
        inputCommentContent.setAttribute("id", `input_comment_content_${comment_id}`)
        inputCommentContent.innerText = newCommentContent.innerHTML
        inputCommentContent.rows = 1
        inputCommentContent.cols = 20

        const updateCommentContent = document.getElementById(`comment_content_${comment_id}`)
        updateCommentContent.insertBefore(inputCommentContent, newCommentContent)

        const updateCommentButton = document.getElementById(`${comment_id}`)
        updateCommentButton.setAttribute("onclick", "updateComment(this.id)")
        updateCommentButton.innerText = '\u00a0수정 완료\u00a0'

        const updateCommentCancelButton = document.createElement("button")
        updateCommentCancelButton.setAttribute("id", `${comment_id}`)
        updateCommentCancelButton.setAttribute("onclick", "updateCommentCancelButton(this.id)")
        updateCommentCancelButton.innerText = '\u00a0수정 취소\u00a0'

        const updateCommentButtons = document.getElementById(`update_comment_buttons_${comment_id}`)
        updateCommentButtons.appendChild(updateCommentCancelButton)
    }
}

// 댓글 수정
async function updateComment(comment_id){
    var inputCommentContent = document.getElementById(`input_comment_content_${comment_id}`)
    await putComment(post_id, comment_id, inputCommentContent.value)

    inputCommentContent.remove()
    
    const newCommentContent = document.getElementById(`new_comment_content_${comment_id}`)
    newCommentContent.style.visibility = "visible"

    const updateCommentButton = document.getElementById(`${comment_id}`)
    updateCommentButton.setAttribute("onclick", "updateCommentMode(this.id)")
    updateCommentButton.innerText = '수정'

    loadPostDetail(post_id)
}

// 댓글 수정 취소
function updateCommentCancelButton(comment_id){
    var inputCommentContent = document.getElementById(`input_comment_content_${comment_id}`)
    inputCommentContent.remove()
    
    const commentContent = document.getElementById(`comment_content_${comment_id}`)
    commentContent.style.visibility = "visible"

    const updateCommentButton = document.getElementById(`${comment_id}`)
    updateCommentButton.setAttribute("onclick", "updateCommentMode(this.id)")
    updateCommentButton.innerText = '수정'

    loadPostDetail(post_id)
}

// 댓글 삭제
async function deleteCommenteMode(comment_id){
    await deleteComment(post_id, comment_id)
}

// 댓글 작성
async function addcomment() {
    const createComment = document.getElementById("user_comment")
    
    if (createComment.value == ''){
        alert('댓글을 입력해주세요')
    }else{
        const comment = await postComment(post_id, createComment.value)
    }
    
    loadPostDetail(post_id)
    createComment.value = ''
}

checkLogin()
loadPostDetail(post_id)
