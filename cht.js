

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
function fromID(progress,task,id) {
    task = getTaskDoc(progress,task)
    ida = id.split(":").pop()
    return task.getElementById(ida)
}
function getAPI() {
    return document.querySelector("#stageFrame").contentWindow.API
}
function getFrame() {
    return getAPI().Frame
}
function getStack(progress) {
    return getFrame().StackProgress[progress]

}
function getTask(progress,task) {
    return getStack(progress).TaskProgress[task].Text
}
function getTaskDoc(progress,task) {
    return new DOMParser().parseFromString(getTask(progress,task),'text/xml')
}
function grabTaskRequirements(progress,task) {
    return grabRequirements(getTask(progress,task))

}
