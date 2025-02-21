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
  renderInputOther,
  renderInputFlex,
  API_URL_FLUX,
  base64ToBlob,
  timerInRace,
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
let form = document.querySelector(".form");
form.innerHTML = renderInputFlex();
const chooseModel = document.querySelector(".choose-model");

// choose model div
chooseModel.addEventListener("click", (e) => {
  if (e.target.classList.contains("current-model")) return;
  document.querySelectorAll(".choose-model-btn").forEach((el) => {
    el.classList.toggle("current-model");
  });
  if (e.target.classList.contains("other")) {
    form.innerHTML = renderInputOther();
  }
  if (e.target.classList.contains("flex")) form.innerHTML = renderInputFlex();
  form = document.querySelector(".form");
  sliderToP();
});

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
const tryTable = document.querySelector(".ex-tbody");
const exampleSec = document.querySelector(".try");
const introDiv = document.querySelector(".intro-div");
const introPT = document.querySelector(".intro-div-top .intro-credit-p");
const introPB = document.querySelector(".intro-div-below .intro-credit-p");

// const modelChoice = document.querySelector(".model-choice");
// const stylePreset = document.querySelector(".style-preset");
// const imgSize = document.querySelector(".image-size");
// const Pprompt = document.querySelector(".Pprompt");
// const Nprompt = document.querySelector(".Nprompt");
// const steps = document.querySelector(".steps-input");
// const cfg = document.querySelector(".cfg-input");
// const seed = document.querySelector(".seed-input");
// const upscale = document.querySelector(".upscale-input");
// const sampler = document.querySelector(".sampler-input");
// const stepsP = document.querySelector(".steps-p");
// const cfgP = document.querySelector(".cfg-p");
// const seedP = document.querySelector(".seed-p");

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

// ==== example prompts ====================

const setSlider = function () {
  form.querySelector(".steps-p").textContent =
    form.querySelector(".steps-input").value;
  if (!chooseModel.querySelector(".flex").classList.contains("current-model")) {
    form.querySelector(".cfg-p").textContent =
      form.querySelector(".cfg-input").value;
  }
  form.querySelector(".seed-p").textContent =
    form.querySelector(".seed-input").value;
};

const formIn = [...new FormData(form)];
const dataFromF = Object.fromEntries(formIn);

tryTable.addEventListener("click", (e) => {
  // this will check the current model selected if its flux model run below if statement.
  if (chooseModel.querySelector(".flex").classList.contains("current-model")) {
    showError("Sorry this prompt is for Other models. Type your own prompt.");
    return;
  }
  const parent = e.target.parentElement;
  const allEl = Array.from(parent.children);
  allEl.forEach((el) => {
    const selectClass = el.classList.value;
    const selectValue = el.textContent.replace(/\s+/g, " ").trim(); // this to remove spaces in text
    form.querySelector(`#${selectClass}`).value = selectValue;
    allEl[8].textContent === "false"
      ? (form.querySelector(`#upscale-select`).checked = false)
      : (form.querySelector(`#upscale-select`).checked = true);
    setSlider();
    sliderToP();
  });
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
const sliderToP = function () {
  form.querySelectorAll(".slider").forEach((e) => {
    // this will update slider values
    e.addEventListener("input", (el) => {
      el.preventDefault();
      e.nextElementSibling.textContent = el.target.value;
    });
  });
};
sliderToP();

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
    window.location.href = "index.html";
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
  ele.src = `data:image/jpeg;base64,${src}`;
  // outImgPrt.insertAdjacentElement("afterbegin", ele);
  outImgPrt.prepend(ele);
  return ele;
};

// const url = API_URL;
// take all input para and fetch that image and prepend it to output image element.
const getimage = async function (para, isFlex = true) {
  try {
    const promise = await fetch(isFlex ? API_URL_FLUX : API_URL, {
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
    if (promise.status == 422) {
      throw new Error("Bro I caught you. No NSFW images.");
    }
    if (promise.status == 429) {
      throw new Error("Request traffic is high. Try later.");
    }
    if (!promise.ok) {
      throw new Error("Something went wrong try later (check your inputs)");
    }
    // const res = await promise;
    const res = await promise.json();

    const out = isFlex ? res["data"][0]["b64_json"] : res.imageUrl;
    setOutImgContent(out);
    return out;
  } catch (err) {
    // outImgPrt.innerHTML = err;
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
const addImgToPreviousImg = async function (val, position = "afterbegin") {
  try {
    if (previouImgPrtPara) previouImgPrtPara.remove();
    const img = document.createElement("img");
    img.classList.add("previous-image");
    img.classList.add("image");
    img.src = await val;
    previouImgPrt.insertAdjacentElement(position, img);
  } catch (err) {
    throw err;
  }
};
const addOnImgToPrevious = async function (userId, totalNoUsed) {
  if (totalNoUsed === 0) {
    return;
  }
  let j = 1;
  for (let i = totalNoUsed; j <= 6 && i > 0; i--) {
    // try {
    const val = await getFilePreview(`${userId}-${i}`);
    await addImgToPreviousImg(val, "beforeend");
    j += 1;
    // } catch (err) {
    //   throw err;
    // }
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

// console.log(document.querySelector(".choose-model-btn").classList);

const splitInputImgSizeStr = function (val) {
  let dd = val;

  dd = dd.split(" ").slice(-1)[0];
  const [a, b] = [
    ...dd
      .replace(/[\(\)x]/g, " ")
      .trim()
      .split(" "),
  ];
  return [a, b];
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  form = document.querySelector(".form");
  if (!form.querySelector(".Pprompt").value) {
    // if (!Pprompt.value) {
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

  const formInputs = [...new FormData(form)];
  const dataFromForm = Object.fromEntries(formInputs);

  outImgPrt.innerHTML = "<p>Rendering...</p>";
  showError("Rendering...");

  const [a, b] = splitInputImgSizeStr(dataFromForm.image_size);

  const dataFlux = {
    model: dataFromForm.model,
    prompt: dataFromForm.prompt,
    negative_prompt: dataFromForm.negative_prompt,
    n: 1,
    steps: Number(dataFromForm.steps),
    seed: Number(dataFromForm.seed),
    width: Number(a),
    height: Number(b),
    response_format: "b64_json",
    // response_format: "url",
    image_url: "string",
  };
  const data = {
    model: dataFromForm.model,
    prompt: dataFromForm.prompt,
    negative_prompt: dataFromForm.negative_prompt,
    style_preset: dataFromForm.style_preset,
    steps: Number(dataFromForm.steps),
    cfg_scale: Number(dataFromForm.cfg_scale),
    seed: Number(dataFromForm.seed),
    upscale: dataFromForm.upscale ? true : false,
    sampler: dataFromForm.sampler,
    width: Number(a),
    height: Number(b),
  };
  setSlider();
  sliderToP();
  const isCurModalFlux = chooseModel
    .querySelector(".flex")
    .classList.contains("current-model");

  try {
    // from fetch image to prepend it to html element - getimage will do.
    const img = await Promise.race([
      getimage(isCurModalFlux ? dataFlux : data, isCurModalFlux),
      timerInRace(50),
    ]);
    await (isCurModalFlux
      ? addImgToPreviousImg(`data:image/jpeg;base64,${img}`)
      : addImgToPreviousImg(img));
    //updating totalnoused and limit both in local and db
    limit = limit - 1;
    totalNoUsed = totalNoUsed + 1;
    updatedoc(userId, { totalNoUsed: totalNoUsed, limit: limit }); // updating the database about usage.
    introPT.textContent = introPB.textContent = limit;
    // console.log(limit, totalNoUsed);

    // uploading the generated image to storage.
    const blobItem = await (isCurModalFlux
      ? base64ToBlob(img)
      : imageurlToblob(img));
    const storageReturn = await createFileInStorage(blobItem);
  } catch (err) {
    outImgPrt.innerHTML = err;
    showError(err, 10);
  }
});

// reset btn ------------
form.addEventListener("reset", (e) => {
  outImgPrt.innerHTML = "<p>Type something and click submit.</p>";
});
// reset.addEventListener("click", (e) => {
//   outImgPrt.innerHTML = "<p>Type something and click submit.</p>";
// });

// --------- signout btn ------
signoutBtn.addEventListener("click", () => {
  signoutUser();
});
// =============
