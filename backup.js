import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.exportBackup = async function(){
  const snapshot = await getDocs(collection(db,"sermons"));
  const data = snapshot.docs.map(d => d.data());

  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sermons-backup.json";
  a.click();
}
