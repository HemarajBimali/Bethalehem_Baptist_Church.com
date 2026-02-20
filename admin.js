import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Upload Sermon
window.uploadSermon = async function(){
  const title = document.getElementById("stitle").value;
  const desc = document.getElementById("sdesc").value;
  const category = document.getElementById("scategory").value;
  const featured = document.getElementById("sfeatured").checked;
  const file = document.getElementById("sfile").files[0];

  if(!file){ alert("Select a file"); return; }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "audio/mpeg",
    "video/mp4"
  ];
  if(!allowedTypes.includes(file.type)){ alert("Invalid file type"); return; }

  const storageRef = ref(storage,"sermons/"+Date.now()+"_"+file.name);
  await uploadBytes(storageRef,file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db,"sermons"),{
    title:title,
    description:desc,
    category:category,
    fileUrl:url,
    fileType:file.type,
    downloads:0,
    featured:featured,
    created:new Date()
  });

  alert("Sermon Uploaded");
  location.reload();
}

// Add Event
window.addEvent = async function(){
  const title = document.getElementById("etitle").value;
  const desc = document.getElementById("edesc").value;
  const date = document.getElementById("edate").value;

  await addDoc(collection(db,"events"),{
    title:title,
    description:desc,
    date:new Date(date),
    created:new Date()
  });

  alert("Event Added");
  location.reload();
}

// Upload Gallery Image
window.uploadImage = async function(){
  const file = document.getElementById("gfile").files[0];
  if(!file){ alert("Select a file"); return; }
  const storageRef = ref(storage,"gallery/"+Date.now()+"_"+file.name);
  await uploadBytes(storageRef,file);
  const url = await getDownloadURL(storageRef);
  await addDoc(collection(db,"gallery"),{url:url,created:new Date()});
  alert("Image Uploaded");
  location.reload();
}
