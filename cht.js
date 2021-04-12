// Edgecht
// why would you keep the correct answers on the client?
// just why
window.edgecht = {
  isinit: false,
  grabRequirements: function (xml) {
    if (typeof xml == "string") {
      xml = new DOMParser().parseFromString(xml, "text/xml");
    }
    outcome = xml.getElementsByTagName("outcome")[0];
    if (!outcome) {
      return;
    }
    requires = Array.from(outcome.children).map((x) => x.innerHTML);
    return requires;
  },
  fromID: function (progress, task, id) {
    task = this.getTaskDoc(progress, task);
    ida = id.split(":").pop();
    return task.getElementById(ida);
  },

  getAPI: function () {
    return this.getContentWindow().API;
  },
  getContentWindow: function () {
    return $("#stageFrame")[0].contentWindow;
  },
  getInternalIFrame: function () {
    return this.getContentWindow().$("#iFramePreview")[0].contentWindow;
  },
  getItemFromID: function (id) {
    id = id.split(":").pop();
    return this.getInternalIFrame().$("[value='" + id + "']")[0];
  },
  getFrame: function () {
    return this.getAPI().Frame;
  },
  getStack: function (progress) {
    return this.getFrame().StackProgress[progress];
  },
  getTask: function (progress, task) {
    return this.getStack(progress).TaskProgress[task].Text;
  },
  getTaskDoc: function (progress, task) {
    return new DOMParser().parseFromString(
      this.getTask(progress, task),
      "text/xml"
    );
  },
  grabTaskRequirements: function (progress, task) {
    return this.grabRequirements(this.getTask(progress, task));
  },

  init: function () {
    if (this.isinit) {
      console.warn("Uh oh already started in this session");
      return;
    }
    console.log("EDGECHT");
    console.log("Because Edgenuity's Coders are garbage");
    this.isinit = true;
    //@TODO Actually do stuff here
    //@Body lmao
  },
};

edgecht.init();
