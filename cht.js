// Edgecht
// why would you keep the correct answers on the client?
// just why
window.edgecht = {
  isinit: false,
  removecdata: function (data) {
    return data.replace("<![CDATA[","").replace("]]>","")
  },
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
  formatXMLChoice: function (element) {
    return {
      id: element.getAttribute("id"),
      type: element.hasAttribute("type") ? element.getAttribute("type") : "checkbox",
      contents: element.firstChild ? edgecht.removecdata(element.firstChild.innerHTML) : null //why
    }
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
  parseTaskRequirements: function (taskRequirements) {
  taskreq = [];
    bigtask = taskRequirements.join("|").split("|");
    amountof = bigtask.length / 3 // amount of requirements
  for (task = 0; task < amountof; task++) {
    thistask = { 
      eleid: bigtask.shift(),
      type: bigtask.shift(),
      value: bigtask.shift()
    };
    taskreq.push(thistask);
  };
    return taskreq
  },
  parseTask: function (progress, task) {
    rawtask = this.getTaskDoc(progress, task);
    requireTask = this.parseTaskRequirements(this.grabRequirements(rawtask));
    contents = Array.from(rawtask.getElementsByTagName("content"))
    /*contents.pop() // remove ending div
    contents.shift() // remove start of div*/
    task = {
      requirements: requireTask,
      type: rawtask.getElementsByTagName("type")[0].innerHTML,
      question: this.removecdata(contents[1].innerHTML), // this is garbage, fails sometimes, fix this by looking for one that doesnt start with <div> maybe?
      answers: Array.from(rawtask.getElementsByTagName("choice")).map(this.formatXMLChoice)
    };
    return task
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
