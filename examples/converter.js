(function () {

  var parser = new WFSCapabilities();

  var parsed = document.getElementById('parsed');
  var raw = document.getElementById('raw');
  
  var parseBtn = document.getElementById('parseBtn');
  parseBtn.onclick = parseInput;

  var cleanBtn = document.getElementById('cleanBtn');
  cleanBtn.onclick = () => {
    parsed.value = '';
    raw.value = '';
  }

  function parseInput() {
    if (!raw.value) return;
    var parsedCapabilities = parser.read(raw.value);
    parsed.value = JSON.stringify(parsedCapabilities, undefined, 4);
  }

  function loadExample() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "arba-2.0.0-getCapabilities.xml", false);
    xhttp.send();

    const xml = xhttp.responseText
    if (xml) {
      raw.value = xml;
      parseInput();
    }
  }

  loadExample()

})();