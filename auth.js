import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Register
window.register = async function(){
    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    const res = await createUserWithEmailAndPassword(auth,email,password);
    await setDoc(doc(db,"users",res.user.uid),{
        name:name,
        role:"member"
    });
    alert("Registration Successful");
    window.location="login.html";
}

// Login
window.login = async function(){
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    const res = await signInWithEmailAndPassword(auth,email,password);
    const snap = await getDoc(doc(db,"users",res.user.uid));
    const role = snap.data().role;

    if(role==="admin") window.location="admin.html";
    else window.location="dashboard.html";
}
