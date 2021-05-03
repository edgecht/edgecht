// Edgecht
// why would you keep the correct answers on the client?
// just why
window.edgecht = {
  isinit: false,
  removecdata: function (data) {
    return data.replace("<![CDATA[", "").replace("]]>", "");
  },
  ordinal_suffix_of: function (i) { // from https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
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
      type: element.hasAttribute("type")
        ? element.getAttribute("type")
        : "checkbox/radio",
      contents:
        element.getElementsByTagName("content").length != 0
          ? edgecht.removecdata(
              element.getElementsByTagName("content")[0].innerHTML
            )
          : null, // why
    };
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
    amountof = bigtask.length / 3; // amount of requirements
    for (task = 0; task < amountof; task++) {
      thistask = {
        eleid: bigtask.shift(),
        type: bigtask.shift(),
        value: bigtask.shift(),
      };
      taskreq.push(thistask);
    }
    return taskreq;
  },
  createMessageForCorrectAnswer: function (progress, task) {
    parsedTask = this.parseTask(progress,task)
    switch (parsedTask.type) {
      case "MR":
        // Multiple Choice
        rq = parsedTask.requirements.map(x => x.value == "true")
        rightarr = []
        for (i = 0; i < rq.length; i++) {
          if (rq[i]) {
            rightarr.push(this.ordinal_suffix_of(i+1))
          }
        }
        return parsedTask.question + "\nThe correct answers are " + rightarr.join(", ")
      case "gmc":
        // Single Choice
        return "Single Choice placeholder"
      case "sa":
        // Textbox
        return "Textbox placeholder"
      default:
        return "This question type is not supported. ("+parsedTask.type+")"
    }
    return "This question type is supported but something went wrong. ("+parsedTask.type+")" 
    // @TODO: finish createMessageForCorrectAnswer
    // @BODY this function creates a message that explains which answer is correct, which can be shown to the end user lmao
  },
  parseTask: function (progress, task) {
    rawtask = this.getTaskDoc(progress, task);
    requireTask = this.parseTaskRequirements(this.grabRequirements(rawtask));
    contents = Array.from(rawtask.getElementsByTagName("content"));
    /*contents.pop() // remove ending div
    contents.shift() // remove start of div*/
    task = {
      requirements: requireTask,
      type: rawtask.getElementsByTagName("type")[0].innerHTML,
      // @TODO make this better
      // @BODY great
      question: jQuery(this.removecdata(contents[1].innerHTML)).text(), // this is garbage, fails sometimes, fix this
      // by looking for one that doesnt start with
      // <div> maybe?
      answers: Array.from(rawtask.getElementsByTagName("choice")).map(
        this.formatXMLChoice
      ),
    };
    return task;
  },
  displayUserMessage: function (progress, task) {
    this.displayMessage(this.createMessageForCorrectAnswer(progress, task))
  },
  displayMessage: function (message) {
    $( "#dialog-edgecht" ).text(message)
    $( "#dialog-edgecht" ).dialog("open")
  },
  init: function () {
    if (this.isinit) {
      console.warn("Uh oh already started in this session");
      return;
    }
    console.log("EDGECHT");
    console.log("Because Edgenuity's Coders are garbage");
    this.isinit = true;
    $("body").append("<div id='dialog-edgecht' title='edgecht'>Placeholder</div>")
    $( "#dialog-edgecht" ).dialog({ autoOpen: false, show: true, hide: true });
    //@TODO Actually do stuff here
    //@Body lmao
  },
};

edgecht.init();
