import { db, auth } from "./firebase.js";
import { collection, getDocs, doc, updateDoc, increment, query, where } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("sermonList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
let sermonsData = [];

async function loadSermons(){
  const snapshot = await getDocs(collection(db,"sermons"));
  sermonsData = snapshot.docs.map(d => ({id:d.id,...d.data()}));
  displaySermons(sermonsData);
}

function displaySermons(data){
  list.innerHTML = "";
  data.forEach(async item => {
    let preview="";
    if(item.fileType==="application/pdf"){
      preview = `<iframe src="${item.fileUrl}#toolbar=0" width="100%" height="250"></iframe>`;
    } else if(item.fileType.includes("word")){
      preview = `<a href="${item.fileUrl}" target="_blank" onclick="increaseDownload('${item.id}')">Download Word</a>`;
    } else if(item.fileType==="audio/mpeg"){
      preview = `<audio controls src="${item.fileUrl}"></audio>`;
    } else if(item.fileType==="video/mp4"){
      preview = `<video controls width="100%" src="${item.fileUrl}"></video>`;
    }

    // Fetch comments
    let commentSnap = await getDocs(query(collection(db,"comments"),where("sermonId","==",item.id)));
    let commentHTML="";
    commentSnap.forEach(c => {
      const cd=c.data();
      commentHTML += `<p><strong>${cd.userName}:</strong> ${cd.message}</p>`;
    });

    list.innerHTML += `
      <div class="event-card">
        <h3>${item.title}</h3>
        <p><strong>Category:</strong> ${item.category}</p>
        <p>${item.description}</p>
        ${preview}
        <p>Downloads: ${item.downloads}</p>
        <button onclick="increaseDownload('${item.id}')">Download</button>
        <div class="comment-section">
          <h4>Comments</h4>
          <div id="comments-${item.id}">${commentHTML}</div>
          <textarea id="commentText-${item.id}" placeholder="Write comment..."></textarea>
          <button onclick="addComment('${item.id}')">Post Comment</button>
        </div>
      </div>
    `;
  });
}

// Search
searchInput.addEventListener("input", ()=>{
  const keyword=searchInput.value.toLowerCase();
  const filtered = sermonsData.filter(s=>
    s.title.toLowerCase().includes(keyword) || 
    s.description.toLowerCase().includes(keyword)
  );
  displaySermons(filtered);
});

// Filter
filterCategory.addEventListener("change", ()=>{
  const cat=filterCategory.value;
  if(cat==="All") displaySermons(sermonsData);
  else displaySermons(sermonsData.filter(s=>s.category===cat));
});

// Download counter
window.increaseDownload = async function(id){
  const refDoc = doc(db,"sermons",id);
  await updateDoc(refDoc,{downloads: increment(1)});
  loadSermons();
}

// Add Comment
window.addComment = async function(sermonId){
  const text = document.getElementById("commentText-"+sermonId).value;
  const user = auth.currentUser;
  if(!user){ alert("Login required"); return; }
  await addDoc(collection(db,"comments"),{
    sermonId:sermonId,
    userId:user.uid,
    userName:user.email,
    message:text,
    created:new Date()
  });
  loadSermons();
}

loadSermons();
