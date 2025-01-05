const env = import.meta.env;

export const API_URL = env.VITE_API_URL;
export const API_URL_FLUX = env.VITE_API_URL_FLEX;

export const firebaseConfig = {
  apiKey: env.VITE_apiKey,
  authDomain: "imagto.firebaseapp.com",
  projectId: "imagto",
  storageBucket: "imagto.firebasestorage.app",
  messagingSenderId: env.VITE_messagingSenderId,
  appId: env.VITE_appId,
  measurementId: env.VITE_measurementId,
};

export const appwriteConfig = {
  setEndpoint: "https://cloud.appwrite.io/v1", // Your API Endpoint
  setProject: env.VITE_setProject, // Your project ID
};

export const databaseId = env.VITE_databaseId;
export const collectionId = env.VITE_collectionId;
// ============================================

// -- clear input tag values.
export const clearinputs = function (el) {
  el.forEach((e) => {
    e.value = "";
  });
};

export const timer = function (sec) {
  setTimeout(() => {
    errorClose();
  }, sec * 1000);
};

export const timerInRace = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout((e) => {
      reject(new Error("Request timeout try again."));
    }, sec * 1000);
  });
};

export const addLoading = function () {
  // console.log("add loader");
  document
    .querySelector(".loading-div")
    .classList.remove("loading-div-inactive");
};
export const removeLoading = function () {
  // console.log("remove loader");
  document.querySelector(".loading-div").classList.add("loading-div-inactive");
};

export const passwordReset = async function (
  sendPasswordResetEmail,
  auth,
  email
) {
  try {
    const res = await sendPasswordResetEmail(auth, email);
    // console.log("password reset mail sent.");
  } catch (err) {
    showError(err.code, 8);
    // console.log(
    //   `${err}error from password reset: ${err.code}, error message: ${err.message}`
    // );
  }
};

export const showError = function (val, sec = 5) {
  const par = document.querySelector(".alert");
  const cont = `
  <div>
      <p class="alert-p"></p>
      <a title="close">
        <ion-icon class="close-icon" name="close-circle-outline"></ion-icon>
      </a></div>`;

  par.insertAdjacentHTML("afterbegin", cont);
  document.querySelector(".alert-p").innerHTML = val;
  par.classList.add("alertV");
  timer(sec);
};

export const errorClose = function () {
  const al = document.querySelector(".alert");
  if (al.childElementCount) al.removeChild(al.querySelector("div"));

  if (al.childElementCount === 0) al.classList.remove("alertV");
};

export const imageurlToblob = async function (url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();

    // console.log("blob from img url to blob:", blob);
    return blob;
  } catch (err) {
    // console.log("error from get file from url:", err.message);
    throw err;
  }
};

export const base64ToBlob = function (base64, mimeType = "image/jpeg") {
  // Clean and standardize the Base64 string
  const cleanedBase64 = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  const standardBase64 = cleanedBase64.replace(/-/g, "+").replace(/_/g, "/");

  // Decode Base64 string
  try {
    const byteCharacters = atob(standardBase64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the byte array
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error("Failed to decode Base64:", error);
    return null;
  }
};

export const models = [
  "3Guofeng3_v34.safetensors [50f420de]",
  "absolutereality_V16.safetensors [37db0fc3]",
  "absolutereality_v181.safetensors [3d9d4d2b]",
  "amIReal_V41.safetensors [0a8a2e61]",
  "analog-diffusion-1.0.ckpt [9ca13f02]",
  "aniverse_v30.safetensors [579e6f85]",
  "anythingv3_0-pruned.ckpt [2700c435]",
  "anything-v4.5-pruned.ckpt [65745d25]",
  "anythingV5_PrtRE.safetensors [893e49b9]",
  "AOM3A3_orangemixs.safetensors [9600da17]",
  "blazing_drive_v10g.safetensors [ca1c1eab]",
  "breakdomain_I2428.safetensors [43cc7d2f]",
  "breakdomain_M2150.safetensors [15f7afca]",
  "cetusMix_Version35.safetensors [de2f2560]",
  "childrensStories_v13D.safetensors [9dfaabcb]",
  "childrensStories_v1SemiReal.safetensors [a1c56dbb]",
  "childrensStories_v1ToonAnime.safetensors [2ec7b88b]",
  "Counterfeit_v30.safetensors [9e2a8f19]",
  "cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]",
  "cyberrealistic_v33.safetensors [82b0d085]",
  "dalcefo_v4.safetensors [425952fe]",
  "deliberate_v2.safetensors [10ec4b29]",
  "deliberate_v3.safetensors [afd9d2d4]",
  "dreamlike-anime-1.0.safetensors [4520e090]",
  "dreamlike-diffusion-1.0.safetensors [5c9fd6e0]",
  "dreamlike-photoreal-2.0.safetensors [fdcf65e7]",
  "dreamshaper_6BakedVae.safetensors [114c8abb]",
  "dreamshaper_7.safetensors [5cf5ae06]",
  "dreamshaper_8.safetensors [9d40847d]",
  "edgeOfRealism_eorV20.safetensors [3ed5de15]",
  "EimisAnimeDiffusion_V1.ckpt [4f828a15]",
  "elldreths-vivid-mix.safetensors [342d9d26]",
  "epicphotogasm_xPlusPlus.safetensors [1a8f6d35]",
  "epicrealism_naturalSinRC1VAE.safetensors [90a4c676]",
  "epicrealism_pureEvolutionV3.safetensors [42c8440c]",
  "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]",
  "indigoFurryMix_v75Hybrid.safetensors [91208cbb]",
  "juggernaut_aftermath.safetensors [5e20c455]",
  "lofi_v4.safetensors [ccc204d6]",
  "lyriel_v16.safetensors [68fceea2]",
  "majicmixRealistic_v4.safetensors [29d0de58]",
  "mechamix_v10.safetensors [ee685731]",
  "meinamix_meinaV9.safetensors [2ec66ab0]",
  "meinamix_meinaV11.safetensors [b56ce717]",
  "neverendingDream_v122.safetensors [f964ceeb]",
  "openjourney_V4.ckpt [ca2f377f]",
  "pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]",
  "portraitplus_V1.0.safetensors [1400e684]",
  "protogenx34.safetensors [5896f8d5]",
  "Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]",
  "Realistic_Vision_V2.0.safetensors [79587710]",
  "Realistic_Vision_V4.0.safetensors [29a7afaa]",
  "Realistic_Vision_V5.0.safetensors [614d1063]",
  "Realistic_Vision_V5.1.safetensors [a0f13c83]",
  "redshift_diffusion-V10.safetensors [1400e684]",
  "revAnimated_v122.safetensors [3f4fefd9]",
  "rundiffusionFX25D_v10.safetensors [cd12b0ee]",
  "rundiffusionFX_v10.safetensors [cd4e694d]",
  "sdv1_4.ckpt [7460a6fa]",
  "v1-5-pruned-emaonly.safetensors [d7049739]",
  "v1-5-inpainting.safetensors [21c7ab71]",
  "shoninsBeautiful_v10.safetensors [25d8c546]",
  "theallys-mix-ii-churned.safetensors [5d9225a4]",
  "timeless-1.0.ckpt [7c4971d4]",
  "toonyou_beta6.safetensors [980f6b15]",
];

export const styles = [
  "3d-model",
  "analog-film",
  "anime",
  "cinematic",
  "comic-book",
  "digital-art",
  "enhance",
  "fantasy-art",
  "isometric",
  "line-art",
  "low-poly",
  "neon-punk",
  "origami",
  "pixel-art",
  "texture",
  "craft-clay",
];

export const renderInputOther = function (chosenForm) {
  // document.querySelector(".form").innerHTML = "";
  const markupOther = `
          <div class="model-div border-updown-margin">
            <label class="model-label" for="model-select"
              >Choose a model: </label
            ><select
              class="model-choice for-choice-prompt-p"
              id="model-select"
              title="Select a AI model"
              name="model"
            >
              <option selected>
                Realistic_Vision_V5.0.safetensors [614d1063]
              </option>
              ${models
                .map((i) => {
                  return `<option>${i}</option>`;
                })
                .join("")}
            </select>
          </div>

          <div class="div-style-imgSize border-updown-margin">
            <div class="div-style-preset">
              <label class="style-preset-lable" for="style_preset-select"
                >Select style:</label
              ><select
                class="style-preset for-choice-prompt-p"
                id="style_preset-select"
                title="select"
                name="style_preset"
              >
                <option selected>photographic</option>
                ${styles
                  .map((i) => {
                    return `<option>${i}</option>`;
                  })
                  .join("")}
              </select>
            </div>
            <div class="div-image-size">
              <label class="image-size-label" for="image_size-select"
                >Choose a image size: </label
              ><select
                class="image-size for-choice-prompt-p"
                id="image_size-select"
                title="image-size"
                name="image_size"
              >
                <option>Full Square (1024x1024)</option>
                <option>Horizontal Rectangle (1024x768)</option>
                <option selected>Square (512x512)</option>
                <option>Small Rectangle (512x1024)</option>
                <option>Wide Banner (1024x512)</option>
                <option>Vertical Rectangle (768x1024)</option>
              </select>
            </div>
          </div>
          <div class="div-prompts border-updown-margin">
            <label for="prompt-select">Prompt: </label>
            <textarea
              title="Type the discription of an image of your choice."
              class="Pprompt prompt for-choice-prompt-p"
              type="text"
              id="prompt-select"
              name="prompt"
              placeholder="Enter your prompt"
              cols="50%"
              rows="4"
              spellcheck="false"
              required
            ></textarea>
          </div>
          <div class="div-prompts border-updown-margin">
            <label for="negative_prompt-select">Negative Prompt: </label>

            <textarea
              class="Nprompt prompt for-choice-prompt-p"
              type="text"
              id="negative_prompt-select"
              rows="2"
              placeholder="Enter your Negative prompt"
              spellcheck="false"
              name="negative_prompt"
            ></textarea>
          </div>
          <div class="div-steps border-updown-margin">
            <label for="steps-select">Steps:</label>
            <input
              class="steps-input slider"
              type="range"
              id="steps-select"
              name="steps"
              min="1"
              max="20"
              value="15"
            />
            <p class="steps-p for-choice-prompt-p">15</p>
          </div>

          <div
            class="div-cfg-seed common-flex-alignCenter border-updown-margin"
          >
            <div class="div-cfg common-flex-alignCenter">
              <label class="cfg-label" for="cfg_scale-select">CFG-Scale:</label>
              <input
                class="cfg-input slider"
                type="range"
                id="cfg_scale-select"
                name="cfg_scale"
                min="0"
                max="20"
                value="7"
              />
              <p class="cfg-p for-choice-prompt-p">7</p>
            </div>
            <div class="div-seed common-flex-alignCenter">
              <label class="seed-label" for="seed-select">Seed:</label>
              <input
                class="seed-input slider"
                type="range"
                id="seed-select"
                name="seed"
                min="-1"
                max="20"
                value="-1"
              />
              <p class="seed-p for-choice-prompt-p">-1</p>
            </div>
          </div>
          <div
            class="div-upscale-sampler common-flex-alignCenter border-updown-margin"
          >
            <div class="div-upscale common-flex-alignCenter">
              <input
                class="upscale-input for-choice-prompt-p"
                type="checkbox"
                id="upscale-select"
                name="upscale"
              />
              <label class="upscale-label" for="upscale-select">upscale 2X</label>
            </div>
            <div class="div-sampler common-flex-alignCenter">
              <label class="sampler-label" for="sampler-select">Select sampler:</label>
              <select
                class="sampler-input for-choice-prompt-p"
                id="sampler-select"
                title="sampler"
                name="sampler"
              >
                <option>DDIM</option>
                <option>Euler</option>
                <option>Euler a</option>
                <option>Heun</option>
                <option>DPM++ SDE Karras</option>
                <option selected>DPM++ 2M Karras</option>
              </select>
            </div>
          </div>
          <div class="form-btn common-flex-alignCenter border-updown-margin">
            <input class="btn-reset" type="reset" value="Reset" />
            <input class="btn-submit" type="submit" value="Submit" />
          </div>`;
  return markupOther;
};

export const renderInputFlex = function (chosenForm) {
  // document.querySelector(".form").innerHTML = "";
  const markupFlux = `
          <div class="model-div border-updown-margin">
            <label class="model-label" for="model-select"
              >Choose a model: </label
            ><select
              class="model-choice for-choice-prompt-p"
              id="model-select"
              title="Select a AI model"
              name="model"
            >
              <option selected>
                black-forest-labs/FLUX.1-schnell-Free
              </option>
            </select>
          </div>

          <div class="div-style-imgSize border-updown-margin">
            <div class="div-image-size">
              <label class="image-size-label" for="image-size"
                >Choose a image size: </label
              ><select
                class="image-size for-choice-prompt-p"
                id="image-size"
                title="image-size"
                name="image_size"
              >
                <option>Full Square (1024x1024)</option>
                <option>Horizontal Rectangle (1024x768)</option>
                <option selected>Square (512x512)</option>
                <option>Small Rectangle (512x1024)</option>
                <option>Wide Banner (1024x512)</option>
                <option>Vertical Rectangle (768x1024)</option>
              </select>
            </div>
          </div>
          <div class="div-prompts border-updown-margin">
            <label for="prompt">Prompt: </label>
            <textarea
              title="Type the discription of an image of your choice."
              class="Pprompt prompt for-choice-prompt-p"
              type="text"
              id="prompt"
              name="prompt"
              placeholder="Enter your prompt"
              cols="50%"
              rows="4"
              spellcheck="false"
              required
            ></textarea>
          </div>
          <div class="div-prompts border-updown-margin">
            <label for="Negative prompt">Negative Prompt: </label>

            <textarea
              class="Nprompt prompt for-choice-prompt-p"
              type="text"
              id="Negative prompt"
              rows="2"
              placeholder="Enter your Negative prompt"
              spellcheck="false"
              name="negative_prompt"
            ></textarea>
          </div>
          <div class="div-steps border-updown-margin">
            <label for="steps">Steps:</label>
            <input
              class="steps-input slider"
              type="range"
              id="steps"
              name="steps"
              min="1"
              max="4"
              value="4"
            />
            <p class="steps-p for-choice-prompt-p">4</p>
          </div>

          <div
            class="div-cfg-seed common-flex-alignCenter border-updown-margin"
          >
            <div class="div-seed common-flex-alignCenter">
              <label class="seed-label" for="seed">Seed:</label>
              <input
                class="seed-input slider"
                type="range"
                id="seed"
                name="seed"
                min="-1"
                max="20"
                value="-1"
              />
              <p class="seed-p for-choice-prompt-p">-1</p>
            </div>
          </div>
          
          <div class="form-btn common-flex-alignCenter border-updown-margin">
            <input class="btn-reset" type="reset" value="Reset" />
            <input class="btn-submit" type="submit" value="Submit" />
          </div>`;
  return markupFlux;
};
