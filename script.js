(function(){
  var t = document.getElementById("wtoggle");
  var draggables = document.querySelectorAll(".drag");
  if(!t) return;
  draggables.forEach(function(d){ d.style.display = "none"; });
  t.addEventListener("click", function(){
    var on = t.classList.toggle("on");
    draggables.forEach(function(d){ d.style.display = on ? "" : "none"; });
  });
})();

(function(){
  var FILLOUT_URL = "";
  var btns = document.querySelectorAll("#shipBtn, #shipNowBtn");
  if(!btns.length) return;
  btns.forEach(function(b){
    if(FILLOUT_URL){
      b.href = FILLOUT_URL; b.target = "_blank"; b.rel = "noopener";
    } else {
      b.addEventListener("click", function(e){
        e.preventDefault();
        alert("// SHIP BUTTON NOT CONNECTED YET\n\npaste your fillout URL into index.html\n(search for FILLOUT_URL)");
      });
    }
  });
})();

(function(){
  var c = document.getElementById("clock");
  if(!c) return;
  function tick(){
    var d = new Date();
    function p(n){ return (n<10?"0":"")+n; }
    c.textContent = p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());
  }
  tick(); setInterval(tick, 1000);
})();

(function(){
  var draggables = document.querySelectorAll(".drag");
  var active = null, ox = 0, oy = 0, moved = false;

  function init(el){
    var cs = getComputedStyle(el);
    if(cs.position !== "absolute"){ el.style.position = "absolute"; }
    if(el.style.left === "" && cs.left === "auto"){
      var r = parseFloat(cs.right);
      if(!isNaN(r) && cs.right.indexOf("%") === -1){
        el.style.left = (window.innerWidth - r - el.offsetWidth) + "px";
        el.style.right = "auto";
      } else {
        el.style.left = el.getBoundingClientRect().left + "px";
      }
    }
    if(el.style.top === "" && cs.top === "auto"){
      el.style.top = el.getBoundingClientRect().top + "px";
    }
    el.addEventListener("mousedown", down);
    el.addEventListener("touchstart", down, {passive:false});
  }

  function down(e){
    if(e.target.tagName === "A") return;
    active = e.currentTarget;
    moved = false;
    active.classList.add("grabbing");
    var pt = (e.touches ? e.touches[0] : e);
    var r = active.getBoundingClientRect();
    ox = pt.clientX - r.left;
    oy = pt.clientY - r.top;
    e.preventDefault();
  }

  function move(e){
    if(!active) return;
    var pt = (e.touches ? e.touches[0] : e);
    var x = pt.clientX - ox;
    var y = pt.clientY - oy;
    x = Math.max(-active.offsetWidth*0.6, Math.min(x, window.innerWidth - active.offsetWidth*0.4));
    y = Math.max(0, Math.min(y, (document.body.scrollHeight) - 10));
    active.style.left = x + "px";
    active.style.top = y + "px";
    moved = true;
    if(e.touches) e.preventDefault();
  }

  function up(){
    if(active) active.classList.remove("grabbing");
    active = null;
  }

  draggables.forEach(init);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  document.addEventListener("touchmove", move, {passive:false});
  document.addEventListener("touchend", up);
})();