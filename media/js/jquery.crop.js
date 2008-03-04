jQuery.fn.crop = function(image, opts) {
  
  var o = {
    maxSize: { x: 400, y: 400 },
    aspectRatio: { x: 1, y: 1 },
    action: ".",
    threshold: 20,
    warningThreshold: {x: 200, y: 200 }
  };
  
  jQuery.extend(o, opts);
 
	/* 
  $(window).bind("load", function(){
    $("div.instruction").text("drag to select");
  });
 	*/ 
  return this.each(function(){
    var selectionBorder = 1;
    var dimensions = { height: image.height(), width: image.width() };
    var scale = Math.ceil(Math.max(dimensions.height / o.maxSize.y, dimensions.width / o.maxSize.x));
    var dragging = false;
    var anchorCoords = { x: 0, y: 0 };
    var container = jQuery("<div class='container'></div>");
    var imageCropper = jQuery("<div class='image-cropper'></div>");
    var imageSource = image.attr("src");
    var imageDiv = jQuery("<div class='image'><img height='" + (dimensions.height / scale) + 
      "' width='" + (dimensions.width / scale) + "' src='" + imageSource + "'/></div>");
    var selectMax = jQuery("<a href='#'>Select maximum</a>");
    var selectNone = jQuery("<a href='#'>Select none</a>");
    var instruction = jQuery("<div class='instruction'>drag to select<div>");
    var warning = jQuery("<div class='warning' style='display: none'>The selection is too small. " +
      "Please select a larger region to ensure a quality image.</div>");
    var selection = jQuery("<div class='selection' style='display: none'><img height='" + (dimensions.height / scale) + 
      "' width='" + (dimensions.width / scale) + "' src='" + imageSource + "'/></div>");
    var selectionSize = jQuery("<div class='size'></div>");
    var form = jQuery("" + 
      "<form method='post' action='" + o.action + "'>" +
      "  <input type='hidden' name='image' value='" + imageSource + "'/>" +
      "  <input type='hidden' name='top' value='-10'/>" +
      "  <input type='hidden' name='bottom' value='-10'/>" +
      "  <input type='hidden' name='left' value='-10'/>" +
      "  <input type='hidden' name='right' value='-10'/>" +
      "  <input type='submit' name='crop' value='Crop'/>" +
      "</form>");
      
    function updateForm(top, left, height, width){
      top = top || -10;
      left = left || -10;
      height = height || 0;
      width = width || 0;
      jQuery("input[name=top]").val(top * scale);
      jQuery("input[name=left]").val(left * scale);
      jQuery("input[name=bottom]").val((top + height) * scale);
      jQuery("input[name=right]").val((left + width) * scale);
    }
  
    function resetCrop(){
      selection.hide();
      warning.hide();
      updateForm();
      instruction.show();
    }
  
    function selectCropMax(){
      var selectionDimensions = Math.min(dimensions.height, dimensions.width);
      selection
        .show()
        .css({
          "top": "0px",
          "left": "0px",
          "height": selectionDimensions / scale - selectionBorder * 2 + "px",
          "width": selectionDimensions / scale - selectionBorder * 2 + "px"
        })
        .children("img").css({
          left: "-" + selectionBorder + "px",
          top: "-" + selectionBorder + "px"
        });
      warning.hide();
      selectionSize.text(selectionDimensions + "x" + selectionDimensions);
      updateForm("0", "0", selectionDimensions / scale - selectionBorder * 2, selectionDimensions / scale - selectionBorder * 2);
    }
  
    function beginSelect(e){
      selectionSize.text("");
      jQuery("body").addClass("crosshair");
      selection.removeClass("move");
      var offset = imageCropper.offset();
      dragging = true;
      instruction.hide();
      anchorCoords.x = e.pageX - offset.left;
      anchorCoords.y = e.pageY - offset.top;
      selection.show().css({
        "top": "-10px",
        "left": "-10px",
        "height": "0px",
        "width": "0px"
      });
      return false;
    }
  
    function changeSelect(e){
      if (! dragging) { return true; }
      
      var offset = imageCropper.offset();
      var mouseCoords = { 
        x: Math.min(imageCropper.width(), Math.max(e.pageX - offset.left, 0)),
        y: Math.min(imageCropper.height(), Math.max(e.pageY - offset.top, 0))
      };
      var transform = { 
        x: mouseCoords.x < anchorCoords.x ? -1 : 0,
        y: mouseCoords.y < anchorCoords.y ? -1 : 0
      };
      var selectionDimensions = {
        width: Math.abs(mouseCoords.x - anchorCoords.x),
        height: Math.abs(mouseCoords.y - anchorCoords.y)
      };
      var ratio = selectionDimensions.height / selectionDimensions.width;
      if (ratio > o.aspectRatio.y / o.aspectRatio.x)
      {
        selectionDimensions.height = selectionDimensions.width * (o.aspectRatio.x / o.aspectRatio.y);
      }
      else if (ratio < o.aspectRatio.y / o.aspectRatio.x)
      {
        selectionDimensions.width = selectionDimensions.height * (o.aspectRatio.y / o.aspectRatio.x);
      }
      var newCoords = {
        left: anchorCoords.x + selectionDimensions.width * transform.x,
        top: anchorCoords.y + selectionDimensions.height * transform.y
      };
      selection.css({
        width: selectionDimensions.width + "px",
        height: selectionDimensions.height + "px",
        left: newCoords.left + "px",
        top: newCoords.top + "px"
      });
      selection.children("img").css({
        left: "-" + (newCoords.left + selectionBorder) + "px",
        top: "-" + (newCoords.top + selectionBorder) + "px"
      });
      selectionSize.text((selectionDimensions.width * scale) + "x" + (selectionDimensions.width * scale));
      return false;
    }
  
    function endSelect(e){
      if (!dragging) { return true; }
      if (selection.width() < o.threshold || selection.height() < o.threshold)
      {
        resetCrop();
        return false;
      }
      if (selection.width() * scale < o.warningThreshold.x || selection.height() * scale < o.warningThreshold.y)
      {
        warning.show();
      }
      else
      {
        warning.hide();
      }
      var selectionElem = selection.get(0);
      updateForm(selectionElem.offsetTop, selectionElem.offsetLeft, selection.height(), selection.width());
      jQuery("body").removeClass("crosshair");
      selection.addClass("move");
      if (parseInt(jQuery("input[name=right]").val()) < 0)
      {
        instruction.show();
      }
      dragging = false;
      return false;
    }

    // Add elements to DOM and hook up their events
    selectNone.click(function(){
      resetCrop();
      return false;
    });
    selectMax.click(function(){
      selectCropMax();
      return false;
    });
    jQuery(this).after(container).remove();
    container
      .append(selectNone)
      .append(" | ")
      .append(selectMax)
      .append(warning)
      .append(imageCropper)
      .append(form);
    imageCropper
      .append(imageDiv)
      .append(selection)
      .append(instruction)
      .height(dimensions.height / scale)
      .width(dimensions.width / scale)
      .mousedown(beginSelect);
    selection
      .append(selectionSize)
      .draggable({
        containment: "parent",  
        drag: function(e, ui){
          selection.children("img").css({
            left: "-" + (ui.position.left + selectionBorder) + "px",
            top: "-" + (ui.position.top + selectionBorder) + "px"
          });
        },
        stop: function(e, ui){
          updateForm(this.offsetTop, this.offsetLeft, jQuery(this).height(), jQuery(this).width());
        },
        handle: jQuery("div.selection,div.size")
      });
    jQuery(document)
      .mousemove(changeSelect)
      .mouseup(endSelect);
  });
};
