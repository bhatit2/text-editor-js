formatHeading = function() {
  let val = document.getElementById("sel").value;
  if (val) {
    window.format("formatBlock", val);
  } else {
    window.removeSelectedElements("h1,h2,h3,h4,h5,h6");
  }
};

selectTextColor = function(color) {
  window.format("foreColor", color);
  let ele = document.getElementById("textColor");
  ele.style.borderColor = color;
  // document.getElementById('editor').style.color = color;
};

highlightText = (function() {
  let highlighted = false;
  return function() {
    if (highlighted) {
      window.format("removeFormat");
      highlighted = false;
    } else {
      window.format("hiliteColor", "#ddf8ac");
      highlighted = true;
    }
  };
})();

togglePopup = function() {
  let ele = document.getElementById("popup");
  ele.style.display = ele.style.display === "none" ? "flex" : "none";
};

format = function format(command, value) {
  console.log("value is ", value);
  let s = document.execCommand(command, false, value);
  console.log(s);
};

setUrl = function setUrl() {
  var sText = document.getSelection();
  if(sText.anchorNode.wholeText){
    var url = prompt("please enter the url");
    if (url) {
      document.execCommand(
        "insertHTML",
        false,
        '<a href="' + url + '" target="_blank">' + sText + "</a>"
      );
    }
  }
  
};

function nextNode(node) {
  if (node.hasChildNodes()) {
    return node.firstChild;
  } else {
    while (node && !node.nextSibling) {
      node = node.parentNode;
    }
    if (!node) {
      return null;
    }
    return node.nextSibling;
  }
}

function getRangeSelectedNodes(range, includePartiallySelectedContainers) {
  var node = range.startContainer;
  var endNode = range.endContainer;
  var rangeNodes = [];

  // Special case for a range that is contained within a single node
  if (node === endNode) {
    rangeNodes = [node];
  } else {
    // Iterate nodes until we hit the end container
    while (node && node !== endNode) {
      rangeNodes.push((node = nextNode(node)));
    }

    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node !== range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node.parentNode;
    }
  }

  // Add ancestors of the range container, if required
  if (includePartiallySelectedContainers) {
    node = range.commonAncestorContainer;
    while (node) {
      rangeNodes.push(node);
      node = node.parentNode;
    }
  }

  return rangeNodes;
}

function getSelectedNodes() {
  var nodes = [];
  if (window.getSelection) {
    var sel = window.getSelection();
    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
      nodes.push.apply(nodes, getRangeSelectedNodes(sel.getRangeAt(i), true));
    }
  }
  return nodes;
}

function replaceWithOwnChildren(el) {
  var parent = el.parentNode;
  while (el.hasChildNodes()) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

window.removeSelectedElements = function(tagNames) {
  getSelectedNodes().forEach(function(node) {
    if (
      node.nodeType === 1 &&
      tagNames.indexOf(node.tagName.toLowerCase()) > -1
    ) {
      // Remove the node and replace it with its children
      replaceWithOwnChildren(node);
    }
  });
};
