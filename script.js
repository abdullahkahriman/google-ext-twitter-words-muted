function sleep(second = 1) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

function addElement(selector, html) {
  selector.insertAdjacentHTML("afterBegin", html);
}

async function init() {
  await sleep();
  const section = document
    .querySelector("section:nth-child(2)")
    .firstChild.querySelector("div:nth-child(3)");

  section.id=("tw-section");

  addElement(
    section,
    `
        <div>
          <button type="button" title="Export" id="tw-export">⬇️</button>
          <button type="button" title="Import" id="tw-import">⬆️</button>
        </div`
  );

  document.getElementById("tw-export").addEventListener("click", exports);
  document.getElementById("tw-import").addEventListener("click", imports);
}
init();

function createFile(obj) {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  const elDownload = document.createElement("a");
  elDownload.setAttribute("href", dataStr);
  elDownload.setAttribute("download", "words_muted.json");
  document.body.appendChild(elDownload);
  elDownload.click();
  elDownload.remove();
}

function exports() {
  let arrExport = [];

  document
    .querySelector("section:nth-child(2)")
    .lastChild.querySelectorAll("div[tabindex] span:first-child")
    .forEach((v, k) => {
      if (k % 2 == 0) {
        arrExport.push(v.innerText);
        console.log(arrExport);
      }
    });

  if (arrExport.length > 0) {
    createFile(arrExport);
  }
}

function imports() {
  const file = document.createElement("input");
  file.id = "tw-file";
  file.type = "file";
  file.name = "file";
  file.hidden = true;
  file.addEventListener("change", changeFile, false);
  document.body.appendChild(file);
  file.click();
}

const add_muted_link = "/settings/add_muted_keyword";

function changeFile(e) {
  const file = this.files;

  let f = file[0];
  let reader = new FileReader();
  let result;

  // Closure to capture the file information.
  reader.onload = (function () {
    return async function (e) {
      result = JSON.parse(e.target.result);

      for (const el of result) {
        document.querySelector("a[href='/settings/add_muted_keyword']").click();

        await sleep();

        document.querySelector(`input[name="keyword"]`).value = el;
        document
          .querySelector(`input[name="keyword"]`)
          .dispatchEvent(new Event("change", { bubbles: true }));
        document
          .querySelector(`input[name="keyword"]`)
          .dispatchEvent(new Event("blur", { bubbles: true }));
        document.querySelector(`[data-testid="settingsDetailSave"]`).click();

        await sleep();
      }
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
}
