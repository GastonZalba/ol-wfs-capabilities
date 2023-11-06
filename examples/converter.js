(function () {
  var parser = new WFSCapabilities();

  var parsed = document.getElementById("parsed");
  var raw = document.getElementById("raw");
  var version = document.getElementById("version");

  var _200 = document.getElementById("200");
  _200.onclick = () => {
    loadExample("arba-2.0.0-getCapabilities.xml");
  };

  var _110 = document.getElementById("110");
  _110.onclick = () => {
    loadExample("arba-1.1.0-getCapabilities.xml");
  };

  var _100 = document.getElementById("100");
  _100.onclick = () => {
    loadExample("arba-1.0.0-getCapabilities.xml");
  };

  parseBtn = document.getElementById("parseBtn");
  parseBtn.onclick = parseInput;

  var cleanBtn = document.getElementById("cleanBtn");
  cleanBtn.onclick = () => {
    parsed.value = "";
    raw.value = "";
    version.innerText = "";
  };

  function parseInput() {
    if (!raw.value) return;
    var parsedCapabilities = parser.read(raw.value);
    version.innerText = "(" + parsedCapabilities.version + ")";
    parsed.value = JSON.stringify(parsedCapabilities, undefined, 4);
  }

  function loadExample(file) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", file, false);
    xhttp.send();

    const xml = xhttp.responseText;
    if (xml) {
      raw.value = xml;
      parseInput();
    }
  }
  
  // load this example on init
  loadExample("arba-2.0.0-getCapabilities.xml");
})();
