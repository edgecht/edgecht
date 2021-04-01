

function grabRequirements(xml) {
    if (typeof(xml) == "string") {
        xml = new DOMParser().parseFromString(xml,"text/xml")
    }
    outcome = xml.getElementsByTagName("outcome")[0]
    if (!outcome) {
        return
    }
    requires = Array.from(outcome.children)
    requires = requires.map((x) => x.innerHTML)
    return requires
}

function getAPI() {
    return document.querySelector("#stageFrame").contentWindow.API
}
function getFrame() {
    return getAPI().Frame
}