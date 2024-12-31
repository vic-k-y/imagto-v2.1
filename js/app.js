import {
  API_URL,
  models,
  styles,
  firebaseConfig,
  appwriteConfig,
  passwordReset,
  showError,
  errorClose,
  timer,
  databaseId,
  collectionId,
  imageurlToblob,
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

import { Client, Databases, ID, Storage } from "appwrite";

const apps = initializeApp(firebaseConfig);
const auth = getAuth();

const client = new Client()
  .setEndpoint(appwriteConfig.setEndpoint)
  .setProject(appwriteConfig.setProject);

const db = new Databases(client);
const storage = new Storage(client);

// ----------------------------------------

const submit = document.querySelector(".btn-submit");
const reset = document.querySelector(".btn-reset");
const stepsInput = document.querySelectorAll(".slider");
const stepsVal = document.querySelector(".steps-p");
const navH2 = document.querySelector(".nav-h2");
const signoutBtn = document.querySelector(".nav-signOut");

const outImgPrt = document.querySelector(".div-output-img");
const previouImgPrt = document.querySelector(".div-previous-imgs");
const previouImgPrtPara = document.querySelector(".div-previous-imgs p");
const alert = document.querySelector(".alert");

const nav = document.querySelector(".nav");
const app = document.querySelector(".app");
const form = document.querySelector(".form");
const tryTable = document.querySelector(".ex-tbody");
const exampleSec = document.querySelector(".try");
const introDiv = document.querySelector(".intro-div");
const introPT = document.querySelector(".intro-div-top .intro-credit-p");
const introPB = document.querySelector(".intro-div-below .intro-credit-p");

const modelChoice = document.querySelector(".model-choice");
const stylePreset = document.querySelector(".style-preset");
const imgSize = document.querySelector(".image-size");
const Pprompt = document.querySelector(".Pprompt");
const Nprompt = document.querySelector(".Nprompt");
const steps = document.querySelector(".steps-input");
const cfg = document.querySelector(".cfg-input");
const seed = document.querySelector(".seed-input");
const upscale = document.querySelector(".upscale-input");
const sampler = document.querySelector(".sampler-input");
const stepsP = document.querySelector(".steps-p");
const cfgP = document.querySelector(".cfg-p");
const seedP = document.querySelector(".seed-p");

outImgPrt.innerHTML = "<p>Type something and click submit.</p>";

// ------------ Page basics ---------------
// setting up sticky navigation.
const appIntersection = function (entries) {
  const entry = entries[0];
  if (entry.isIntersecting) {
    document.body.classList.add("nav-sticky");
    // how this works check notes.
  }
  if (!entry.isIntersecting) {
    document.body.classList.remove("nav-sticky");
  }
};
const appObserv = new IntersectionObserver(appIntersection, {
  root: null,
  threshold: 0.1,
  // rootMargin: "-68px",
});

appObserv.observe(exampleSec);

// -------- listing models -------------

models.forEach((val) => {
  modelChoice.insertAdjacentHTML(
    "beforeend",
    `<option>
                ${val}
              </option>`
  );
});
styles.forEach((val) => {
  stylePreset.insertAdjacentHTML(
    "beforeend",
    `<option>
                ${val}
              </option>`
  );
});

// ==== example prompts ====================

const setSlider = function () {
  stepsP.textContent = steps.value;
  cfgP.textContent = cfg.value;
  seedP.textContent = seed.value;
};

const allInput = [
  modelChoice,
  Pprompt,
  Nprompt,
  stylePreset,
  imgSize,
  steps,
  cfg,
  seed,
  upscale,
  sampler,
];

tryTable.addEventListener("click", (e) => {
  const parent = e.target.parentElement;
  const allEl = Array.from(parent.children);
  allEl.forEach((x, i) => {
    const text = x.textContent.replace(/\s+/g, " ").trim(); // this to remove spaces in text
    allInput[i].value = text;
    allEl[8].textContent === "false"
      ? (allInput[8].checked = false)
      : (allInput[8].checked = true);
  });
  setSlider();
  // scroll to top after clicking the example prompts.
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// --- Alert window close function
alert.addEventListener("click", (e) => {
  if (e.target.tagName === "P") return; //check, if target element tag is <p> do nothing
  const closestDiv = e.target.closest("div"); // Find the closest parent <div>
  if (closestDiv) {
    closestDiv.remove();
    if (alert.childElementCount === 0) alert.classList.remove("alertV");
  }
});

// slider to slider value update -----
stepsInput.forEach((e) => {
  // this will update slider values
  e.addEventListener("input", (el) => {
    el.preventDefault();
    e.nextElementSibling.textContent = el.target.value;
  });
});

// ============ user --------------
let userId;
let userName;
let userEmail;
let isVerified;
let limit;
let totalNoUsed;

// will run first when loaded. -----------
const firstrun = async function (user) {
  userId = auth.currentUser.uid;
  userName = auth.currentUser.displayName;
  userEmail = user.email;
  isVerified = auth.currentUser.emailVerified;
  // console.log(userName, userEmail, isVerified, userId);
  try {
    const data = await getdocument(userId);
    limit = data.limit;
    totalNoUsed = data.totalNoUsed;
    introPT.textContent = introPB.textContent = limit;
    // console.log("limit", limit, "totalnoused", totalNoUsed);
    addOnImgToPrevious(userId, totalNoUsed);
    removeLoading();
  } catch (err) {
    throw err;
  }
  navH2.textContent = `Hi, ${user.displayName ? userName : "Welcome"}`;
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log("User logged in:", user);
    firstrun(user);
  } else {
    window.location.href = "index.html#signin";
  }
});

// -- Some functions ------------------
const options = {
  // options data
  method: "POST",
  headers: {
    "content-Type": "application/json",
  },
  body: JSON.stringify(),
};

const setOutImgContent = function (src) {
  outImgPrt.innerHTML = "";
  const ele = document.createElement("img");
  ele.classList.add("image");
  ele.src = src;
  outImgPrt.prepend(ele);
  return ele;
};

const url = API_URL;
// take all input para and fetch that image and prepend it to output image element.
const getimage = async function (para) {
  try {
    const promise = await fetch(url, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(para),
    });
    if (promise.status == 400) {
      throw new Error("Input parameters invalid.");
    }
    if (promise.status == 402) {
      throw new Error("API access disabled. Try later.");
    }
    if (!promise.ok) {
      throw new Error("Something went wrong try later (check your inputs)");
    }
    const res = await promise.json();
    // setOutImgContent(res.imageUrl);
    outImgPrt.prepend(setOutImgContent(res.imageUrl));
    return res.imageUrl;
  } catch (err) {
    // showError(err.message);
    outImgPrt.innerHTML = err;
    throw err;
  }
};

// signout user function ------------
const signoutUser = function () {
  try {
    const res = signOut(auth);
  } catch (error) {
    // An error happened.
  }
};

// ---------- database ---------

const getdocument = async function (uid) {
  try {
    const result = await db.getDocument(
      databaseId, // databaseId
      collectionId, // collectionId
      uid, // documentId
      [] // queries (optional)
    );
    // console.log("get document function:", result);
    return result;
  } catch (err) {
    // console.log("error from get doc:", err.message);
    throw err;
  }
};

const updatedoc = async function (uid, object) {
  try {
    const result = await db.updateDocument(
      "67681cd2001efa31fbc0", // databaseId
      "67681cdd003a7be4ad5e", // collectionId
      uid, // documentId
      object, // data (optional)
      [] // permissions (optional)
    );

    // console.log("from update doc:", result);
    return result;
  } catch (err) {
    // console.log("error from update doc:", err.message);
    throw err;
  }
};

// ------ storage ------------
// upload a file to storage - input image blob(binary data)
const createFileInStorage = async function (imgBlob) {
  let blobs = await imgBlob;
  const imgex = blobs.type.split("/").slice(-1)[0];
  // console.log(imgex, "blob");
  // console.log(blobs.type, "type");
  const file = new File(
    [blobs],
    `${userName.replace(" ", "")}-${totalNoUsed}.${imgex}`
  );

  try {
    const result = await storage.createFile(
      "6767d17000118082fe1f", // bucketId
      `${userId}-${totalNoUsed}`, // fileId
      file, // file
      [] // permissions (optional)
    );
    // console.log("from create file:", result);
    return result;
  } catch (err) {
    // console.log("error from createFile:", err.message);
    showError(err);
    throw err;
  }
};

// get image link from storage - to show in page.
const getFilePreview = async function (imgId) {
  try {
    const result = storage.getFileView(
      "6767d17000118082fe1f", // bucketId
      imgId // fileId
    );
    // console.log("getFilePreview ran:", result);
    return result;
  } catch (err) {
    // console.log("error from download img from storage:", err.message);
    throw err;
  }
};

// adding image to previous image block.
const addImgToPreviousImg = async function (val) {
  try {
    if (previouImgPrtPara) previouImgPrtPara.remove();
    const img = document.createElement("img");
    img.classList.add("previous-image");
    img.classList.add("image");
    img.src = await val;
    previouImgPrt.insertAdjacentElement("afterbegin", img);
  } catch (err) {
    throw err;
  }
};
const addOnImgToPrevious = async function (userId, totalNoUsed) {
  if (totalNoUsed === 0) {
    return;
  }
  let j = 1;
  for (let i = 1; i <= totalNoUsed && j <= 6; i++) {
    try {
      const val = await getFilePreview(`${userId}-${i}`);
      await addImgToPreviousImg(val);
      j += 1;
    } catch (err) {
      throw err;
    }
  }
};

// to download image - have to make click on the returned url.
const downloadImgfromStorage = async function () {
  try {
    const result = storage.getFileDownload(
      "6767d17000118082fe1f", // bucketId
      "royji" // fileId
    );
    // console.log("from download img from storage:", result);
    return result;
  } catch (err) {
    // console.log("error from download img from storage:", err.message);
    throw err;
  }
};

// =================================

const splitInputImgSizeStr = function () {
  let dd = imgSize.value;

  dd = dd.split(" ").slice(-1)[0];
  const [a, b] = [
    ...dd
      .replace(/[\(\)x]/g, " ")
      .trim()
      .split(" "),
  ];
  return [a, b];
};

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!Pprompt.value) {
    // if prompt window is empty show error and return
    showError("Please fill the prompt.", 6);
    return;
  }
  if (limit === 0) {
    // if no credit available(limit = 0) show error and return
    showError(
      "Your exhausted all your generation credit. it will be refilled tomorrow.",
      10
    );
    return;
  }
  outImgPrt.innerHTML = "<p>Rendering...</p>";
  showError("Rendering...");

  const [a, b] = splitInputImgSizeStr();

  const data = {
    model: modelChoice.value,
    prompt: Pprompt.value,
    negative_prompt: Nprompt.value,
    style_preset: stylePreset.value,
    steps: Number(steps.value),
    cfg_scale: Number(cfg.value),
    seed: Number(seed.value),
    upscale: upscale.checked,
    sampler: sampler.value,
    width: Number(a),
    height: Number(b),
  };
  try {
    // from fetch image to prepend it to html element - getimage will do.
    const img = await getimage(data);
    await addImgToPreviousImg(img);
    //updating totalnoused and limit both in local and db
    limit = limit - 1;
    totalNoUsed = totalNoUsed + 1;
    updatedoc(userId, { totalNoUsed: totalNoUsed, limit: limit }); // updating the database about usage.
    introPT.textContent = introPB.textContent = limit;
    // console.log(limit, totalNoUsed);

    // uploading the generated image to storage.
    const blobItem = await imageurlToblob(img);
    const storageReturn = await createFileInStorage(blobItem);
  } catch (err) {
    outImgPrt.innerHTML = err;
    showError(err);
  }
});

// reset btn ------------
reset.addEventListener("click", (e) => {
  outImgPrt.innerHTML = "<p>Type something and click submit.</p>";
});

// --------- signout btn ------
signoutBtn.addEventListener("click", () => {
  signoutUser();
});
