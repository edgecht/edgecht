

function grabRequirements(xml) {
    if (typeof(xml) == "string") {
        xml = new DOMParser().parseFromString(xml,"text/xml")
    }
    outcome = xml.getElementsByTagName("outcome")[0]
    if (!outcome) {
        return
    }
    requires = Array.from(outcome.children).map((x) => x.innerHTML)
    return requires
}
function fromID(progress,task,id) {
    task = getTaskDoc(progress,task)
    ida = id.split(":").pop()
    return task.getElementById(ida)
}

function getAPI() {
    return getContentWindow().API
}
function getContentWindow() {
    return $("#stageFrame")[0].contentWindow
}
function getInternalIFrame() {
    return getContentWindow().$("#iFramePreview")[0].contentWindow
}
function getItemFromID(id) {
    id = id.split(":").pop()
    return getInternalIFrame().$("[value='"+id+"']")[0]
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

function edgecht_init() {
    console.log("EDGECHT")
    console.log("Because Edgenuity's Coders are garbage")
    //@TODO Actually do stuff here
    //@Body lmao
}

if (typeof(window.edgecht) == 'undefined') {
    window.edgecht = {} // settings will go here in future, load from localstorage maybe?
    edgecht_init()
}
