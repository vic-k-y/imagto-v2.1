import {
  appwriteConfig,
  firebaseConfig,
  passwordReset,
  showError,
  errorClose,
  clearinputs,
  databaseId,
  collectionId,
  timer,
  addLoading,
  removeLoading,
} from "./config.js";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { Client, Databases, ID } from "appwrite";

const signupT = document.querySelector(".signup-btn-t");
const signinT = document.querySelector(".signin-btn-t");
const signupName = document.querySelector(".signup-name-input");
const signupEmail = document.querySelector(".signup-email-input");
const signupPass = document.querySelector(".signup-password-input");
const signupB = document.querySelector(".signup-btn-b");
const signinEmail = document.querySelector(".signin-email-input");
const signinPass = document.querySelector(".signin-password-input");
const signinB = document.querySelector(".signin-btn-b");
const signupForm = document.querySelector(".signup-form");
const signinForm = document.querySelector(".signin-form");
const forgotPassbtn = document.querySelector(".forgot-pass");
// const closeB = document.querySelector(".close-icon");
const alert = document.querySelector(".alert");

// -- monitor the xlose button in error shown in up----
alert.addEventListener("click", (e) => {
  if (e.target.tagName === "P") return; //check, if target element tag is <p> do nothing.
  const closestDiv = e.target.closest("div"); // Find the closest parent <div>, which contains tag p, ion icon.
  if (closestDiv) {
    closestDiv.remove();
    if (alert.childElementCount === 0) alert.classList.remove("alertV");
  }
});

const allInput = document.querySelectorAll("input");
const signupInput = document.querySelectorAll(".signup-form input");
const signinInput = document.querySelectorAll(".signin-form input");

const apps = initializeApp(firebaseConfig);
const auth = getAuth();

const client = new Client()
  .setEndpoint(appwriteConfig.setEndpoint)
  .setProject(appwriteConfig.setProject);

const db = new Databases(client);
// ----- auth state --------
// authState(onAuthStateChanged, auth);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // if (user.displayName) console.log("hi");
    if (user.displayName) window.location.href = "app.html";
    // console.log(auth.currentUser.displayName);
    // console.log("sign in - config file");
  } else {
  }
});

// console.log(window.location.pathname);

const signUp = async function (username, email, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCred.user;
    // console.log("user", user);
    // console.log("usercred", userCred);
    await createDoc(user.uid, username, email);
    await update(auth.currentUser, username);
    clearinputs(signinInput);
    // timer(5);
    window.location.href = "app.html";
  } catch (err) {
    showError(err.code);
    removeLoading();
    // console.log(
    //   `${err}error from sign up-errorcode: ${err.code}, error message: ${err.message}`
    // );
  }
};

const update = async function (authofCrtUsr, newname, photo = "") {
  // console.log("from :", await auth.currentUser);
  try {
    const updated = await updateProfile(authofCrtUsr, {
      displayName: newname,
      photoURL: photo,
    });
    // console.log("ran update profile.");
  } catch (err) {
    // An error occurred
    // console.log("error from name update:", err.message);
    throw err;
  }
};

const sigIn = async function (email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCred);
    // console.log("login function:", userCred.user);
    clearinputs(signupInput);
  } catch (err) {
    showError(err.code, 10);
    removeLoading();
    // console.log(
    //   `${err}error from sign in-errorcode: ${err.code}, error message: ${err.message}`
    // );
  }
};

forgotPassbtn.addEventListener("click", (e) => {
  // passwordReset(auth,email)
  if (!signinEmail.value) {
    showError("Enter your Email address.", 5);
    return;
  }
  passwordReset(sendPasswordResetEmail, auth, signinEmail.value);
  // console.log(signinEmail.value);
  showError("Password reset mail sent.", 5);
});

// -- to switch between signup and signin -------
const toSignupTab = function () {
  signupT.classList.remove("inactive-btn");
  signinT.classList.add("inactive-btn");
  signupForm.classList.remove("inactive");
  signupForm.classList.add("active");
  signinForm.classList.add("inactive");
};
const toSigninTab = function () {
  signinT.classList.remove("inactive-btn");
  signupT.classList.add("inactive-btn");
  signinForm.classList.remove("inactive");
  signinForm.classList.add("active");
  signupForm.classList.add("inactive");
};

signinT.addEventListener("click", (e) => {
  e.preventDefault();
  // toSigninTab()
  window.location.href = "#signin";
});
signupT.addEventListener("click", (e) => {
  e.preventDefault();
  // toSignupTab();
  window.location.href = "#signup";
});

["hashchange", "load"].forEach((ev) => {
  window.addEventListener(ev, (e) => {
    e.preventDefault();
    const hasdId = window.location.hash.slice(1);
    if (hasdId === "signup") toSignupTab();
    if (hasdId === "signin") toSigninTab();
  });
});
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  addLoading();
  const tempName = signupName.value;
  // const Uname = tempName;
  const Uname = tempName.replace(/^./, tempName[0].toUpperCase());
  const email = signupEmail.value;
  const pass = signupPass.value;
  await signUp(Uname, email, pass);
  // removeLoading();
});

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  addLoading();
  const email = signinEmail.value;
  const pass = signinPass.value;
  await sigIn(email, pass);
  // removeLoading();
});

// -------------------------------------------------
// ---------- database --------------------

const createDoc = async function (uid, Uname, Uemail) {
  try {
    const result = await db.createDocument(
      databaseId, // databaseId
      collectionId, // collectionId
      uid, // documentId
      { name: Uname, email: Uemail } // permissions (optional)
    );
    console.log("result from create doc:", result);
    // getdocument(uid);
  } catch (err) {
    console.log(err.message);
  }
};

const getdocument = async function (uid) {
  try {
    const result = await db.getDocument(
      databaseId, // databaseId
      collectionId, // collectionId
      uid, // documentId
      [] // queries (optional)
    );
    console.log("get document function:", result);
    // console.log(result.$createdAt);
  } catch (err) {
    console.log("error from get doc:", err.message);
  }
};

// getdocument();
