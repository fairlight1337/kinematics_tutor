var links;
var ik_canvas, data_canvas;
var ctx, ctx_data;
var padding;
var mouse_x, mouse_y;
var mousebutton_down;


function clear_canvas() {
    "use strict";
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ik_canvas.width, ik_canvas.height);
    
    ctx_data.fillStyle = "#ffffff";
    ctx_data.fillRect(0, 0, data_canvas.width, data_canvas.height);
}

function draw_coordinate_system(pad, pixels_per_tick, label_every) {
    "use strict";
    
    var ticks_x, ticks_y, i;
    
    padding = pad;
    ctx.borderStyle = "#000000";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(ik_canvas.width - padding, ik_canvas.height - padding);
    ctx.lineTo(padding, ik_canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    
    ticks_x = (ik_canvas.width - 2 * padding) / pixels_per_tick;
    ticks_y = (ik_canvas.height - 2 * padding) / pixels_per_tick;
    
    for (i = 1; i < ticks_x; i++) {
	ctx.beginPath();
	ctx.strokeStyle = "#efefef";
	ctx.lineWidth = 1;
        ctx.moveTo(padding + i * pixels_per_tick, ik_canvas.height - padding - 0);
        ctx.lineTo(padding + i * pixels_per_tick, padding);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
        ctx.moveTo(padding + i * pixels_per_tick, ik_canvas.height - padding - 0);
        ctx.lineTo(padding + i * pixels_per_tick, ik_canvas.height - padding + 3);
	ctx.stroke();
	
	if((i % label_every) == 0) {
	    ctx.textBaseline = "top";
	    ctx.textAlign = "center";
	    ctx.font = "10px sans-serif";
	    ctx.strokeStyle = "#000000";
	    ctx.fillStyle = "#888888";
	    ctx.fillText(i * pixels_per_tick / 1000.0, padding + i * pixels_per_tick, ik_canvas.height - padding + 5);
	}
    }
    
    for (i = 1; i < ticks_y; i++) {
	ctx.beginPath();
	ctx.strokeStyle = "#efefef";
	ctx.lineWidth = 1;
        ctx.moveTo(padding, ik_canvas.height - padding - i * pixels_per_tick);
        ctx.lineTo(ik_canvas.width - padding, ik_canvas.height - padding - i * pixels_per_tick);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
        ctx.moveTo(padding - 3, ik_canvas.height - padding - i * pixels_per_tick);
        ctx.lineTo(padding + 0, ik_canvas.height - padding - i * pixels_per_tick);
	ctx.stroke();
	
	if((i % label_every) == 0) {
	    ctx.textBaseline = "middle";
	    ctx.textAlign = "right";
	    ctx.font = "10px sans-serif";
	    ctx.strokeStyle = "#000000";
	    ctx.fillStyle = "#888888";
	    ctx.fillText(i * pixels_per_tick / 1000.0, padding - 5, ik_canvas.height - padding - i * pixels_per_tick + 1);
	}
    }
}

function draw_joint(link, x, y, angle) {
    "use strict";
    
    var radius = 6;
    
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#000000";
    ctx.borderStyle = "#000000";
    ctx.fillStyle = "#ffffff";
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    
    if(link.hovered) {
        radius = 3;
        
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    if(link.selected) {
        radius = 3;
        
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.fillStyle = "#000000";
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

function draw_endeffector(x, y, angle) {
    "use strict";
    
    var size = 10;
}

function draw_joints() {
    "use strict";
    
    var link, i, current_angle, current_x, current_y, ee_x, ee_y;
    
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    
    ctx.beginPath();
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        current_angle += link.angle;
        
        draw_joint(link, current_x, current_y, current_angle);
        
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
    }
    
    draw_endeffector(current_x, current_y, current_angle);
}

function draw_link(link, x, y, angle) {
    "use strict";
    
    var thickness = 3;
    
    var x_displacement = thickness * Math.sin(angle);
    var y_displacement = thickness * Math.cos(angle);
    
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    
    ctx.moveTo(x - x_displacement,
               y - y_displacement);
    ctx.lineTo(x + link.length * Math.cos(angle) - x_displacement,
               y - link.length * Math.sin(angle) - y_displacement);
    ctx.lineTo(x + link.length * Math.cos(angle) + x_displacement,
               y - link.length * Math.sin(angle) + y_displacement);
    ctx.lineTo(x + x_displacement,
               y + y_displacement);
    ctx.lineTo(x - x_displacement,
               y - y_displacement);
    
    ctx.fill();
    ctx.stroke();
}

function draw_links() {
    "use strict";
    
    var link, i, current_angle, current_x, current_y;
    
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    
    //ctx.beginPath();
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        current_angle += link.angle;
        
        draw_link(link, current_x, current_y, current_angle);
        
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
    }
    
    /*ctx.fill();
    ctx.stroke();*/
}

function draw_annotation(index, x, y, length, angle_from, angle_length) {
    "use strict";
    
    var linewidth = 0.75;
    var linecolor = "#aaaaaa";
    var angle_whole = angle_from + angle_length;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * Math.cos(-angle_from), y + length * Math.sin(-angle_from));
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = linecolor;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x, y, length, -angle_from, -angle_whole, Math.sin(angle_length) > 0);
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = linecolor;
    ctx.stroke();
    
    ctx.font = "12px sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#888888";
    
    var angle_rad;
    
    if(angle_length < -Math.PI) {
	angle_rad = 2 * Math.PI + angle_length;
    } else if(angle_length > Math.PI) {
	angle_rad = -(2 * Math.PI - angle_length);
    } else {
	angle_rad = angle_length;
    }
    
    if(angle_rad > 0) {
	ctx.fillText("q" + index,
    		     x + (3/4 * length) * Math.cos(angle_from + angle_rad / 2),
    		     y - (3/4 * length) * Math.sin(angle_from + angle_rad / 2));
    } else {
	ctx.fillText("-q" + index,
    		     x + (3/4 * length) * Math.cos(angle_from + angle_rad / 2),
    		     y - (3/4 * length) * Math.sin(angle_from + angle_rad / 2));
    }
}

function draw_annotations() {
    "use strict";
    
    var link, i, current_angle, current_x, current_y;
    
    // Angles
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
        draw_annotation(i, current_x, current_y, 3/4 * link.length, current_angle, link.angle);
        current_angle += link.angle;
        
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
    }
}

function draw_overlay() {
    "use strict";
    
    var link, i, current_angle, current_x, current_y;
    
    // Angles
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
        current_angle += link.angle;
        
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
    }
    
    ctx.beginPath();
    ctx.font = "12px sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#888888";
    
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("qee = " + (current_angle * 180.0 / Math.PI).toFixed(2) + " deg", ik_canvas.width - padding, padding);
}

function draw_data() {
    "use strict";
    
    var link, i, current_angle, current_x, current_y;
    
    // Angles
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    var last_y = 0;
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
	ctx_data.beginPath();
	ctx_data.font = "12px sans-serif";
	ctx_data.textBaseline = "top";
	ctx_data.textAlign = "left";
	ctx_data.lineWidth = 1.0;
	ctx_data.strokeStyle = "#000000";
	ctx_data.fillStyle = "#888888";

	var angle_rad;
	
	if(link.angle < -Math.PI) {
	    angle_rad = 2 * Math.PI + link.angle;
	} else if(link.angle > Math.PI) {
	    angle_rad = -(2 * Math.PI - link.angle);
	} else {
	    angle_rad = link.angle;
	}
	
	ctx_data.fillText("q" + i + " = " + (angle_rad * 180.0 / Math.PI).toFixed(2) + " deg",
			  padding / 2,
			  i * 20 + padding / 2);
	
        current_angle += link.angle;
        
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
	last_y = i * 20 + padding / 2;
    }
    
    // Positions
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
	ctx_data.beginPath();
	ctx_data.font = "12px sans-serif";
	ctx_data.textBaseline = "top";
	ctx_data.textAlign = "left";
	ctx_data.lineWidth = 1.0;
	ctx_data.strokeStyle = "#000000";
	ctx_data.fillStyle = "#888888";

	var angle_rad;
	
	if(link.angle < -Math.PI) {
	    angle_rad = 2 * Math.PI + link.angle;
	} else if(link.angle > Math.PI) {
	    angle_rad = -(2 * Math.PI - link.angle);
	} else {
	    angle_rad = link.angle;
	}
	
	if(i > 0) {
	    ctx_data.fillText("x" + i + " = (" + ((current_x - padding - 0.5) / 1000.0).toFixed(3) + ", " + ((current_y - (ik_canvas.height - padding - 0.5)) / 1000.0).toFixed(3) + ")",
			      padding / 2,
			      last_y + i * 20 + padding / 2);
	}
	
        current_angle += link.angle;
        
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
    }
    
    ctx_data.fillText("x" + i + " = (" + ((current_x - padding - 0.5) / 1000.0).toFixed(3) + ", " + ((current_y - (ik_canvas.height - padding - 0.5)) / 1000.0).toFixed(3) + ")",
		      padding / 2,
		      last_y + i * 20 + padding / 2);
}

function check_selections() {
    "use strict";
    
    var link, i, current_angle, current_x, current_y;
    
    current_angle = 0;
    current_x = padding + 0.5;
    current_y = ik_canvas.height - padding - 0.5;
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
        link.hovered = false;
    }
    
    // Look for hovered joints
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
        var diff_x = mouse_x - current_x;
        var diff_y = mouse_y - current_y;
        
        if(Math.sqrt((diff_x * diff_x) + (diff_y * diff_y)) <= 20) {
            link.hovered = true;
            
            break;
        }
        
        current_angle += link.angle;
        current_x += link.length * Math.cos(current_angle);
        current_y -= link.length * Math.sin(current_angle);
    }
}

function redraw_canvas() {
    "use strict";
    
    clear_canvas();
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    
    draw_coordinate_system(20.5, 20, 5);
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    
    draw_annotations();
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    
    check_selections();
    draw_links();
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    
    draw_joints();
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#000000";
    
    draw_overlay();
    draw_data();
}

function Link(length, angle) {
    "use strict";
    
    this.length = length;
    this.angle = angle;
    this.hovered = false;
    this.selected = false;
}

function add_link(length, angle) {
    "use strict";
    
    var link = new Link(length, angle);
    links.push(link);
}

function remove_last_link() {
    links.pop();
}

function build_random_chain() {
    var i, n = 0;
    
    while(n < 2) {
	n = Math.round(Math.random() * 5);
    }
    
    links = [];
    var cur_ang = 0;
    
    for(i = 0; i < n; i++) {
	var angle = Math.random() * Math.PI / 2 - cur_ang;
	add_link(100, angle);
	cur_ang += angle;
    }
}

function init_canvas(canvas, data_displayer) {
    "use strict";
    
    ik_canvas = canvas;
    data_canvas = data_displayer;
    
    ctx = ik_canvas.getContext("2d");
    ctx_data = data_canvas.getContext("2d");
    
    links = [];
    mousebutton_down = false;
    
    clear_canvas();
    
    add_link(100, Math.PI / 4);
    add_link(100, -Math.PI / 4);
    add_link(100, Math.PI / 4);
    
    redraw_canvas();
}

function mouse_move(event) {
    "use strict";
    
    var link, i, x, y, angle;
    
    angle = 0;
    x = padding + 0.5;
    y = ik_canvas.height - padding - 0.5;
    
    mouse_x = event.clientX - ik_canvas.offsetLeft;
    mouse_y = (event.clientY - ik_canvas.offsetTop);
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
        if(link.selected) {
            if(mousebutton_down) {
                var px = mouse_x - x;
                var py = mouse_y - y;
                var pl = Math.sqrt(px * px + py * py);
                
                var pq;
                
                if(py <= 0) {
                    pq = Math.acos(px / pl) - angle;
                } else {
                    pq = -Math.acos(px / pl) - angle;
                }
                
                link.angle = pq;
            }
            
            break;
        }
        
        angle += link.angle;
        x += link.length * Math.cos(angle);
        y -= link.length * Math.sin(angle);
    }
    
    redraw_canvas();
}

function mouse_down(event) {
    "use strict";
    
    var link, i;
    mousebutton_down = true;
    
    for (i = 0; i < links.length; i++) {
        link = links[i];
        
        link.selected = link.hovered;
    }
    
    redraw_canvas();
}

function mouse_up(event) {
    mousebutton_down = false;
}

function generateFKLaTeXFormulas() {
    return "";
}

function generateFKLaTeXTikZ() {
    return "";
}

function generateFKMathematica() {
    var link, i, c = "(* Content-type: application/vnd.wolfram.mathematica *)\n\n";
    c += "(*** Wolfram Notebook File ***)\n(* http://www.wolfram.com/nb *)\n\n(* CreatedBy='Mathematica 9.0' *)\n\n(* Beginning of Notebook Content *)\n";
    
    c += "Notebook[{";
    // Lengths
    c += "Cell[BoxData[{\n";
    for(i = 0; i < links.length; i++) {
	link = links[i];
	
	if(i > 0) {
	    c += ", \"\\[IndentingNewLine]\",\n";
	}
	
	c += "RowBox[{RowBox[{\"L\\[LetterSpace]" + i + "\", \"=\", \"" + (link.length / 1000.0) + "\"}], \";\"}]";
    }
    c += "}], \"Input\"],\n\n";
    c += "Cell[BoxData[{\n";
    
    // Formulas
    var parameters = "", old_parameters = "", angle_sum = "";
    for(i = 0; i < links.length; i++) {
	link = links[i];
	
	if(i > 0) {
	    c += ", \"\\[IndentingNewLine]\",\n";
	    parameters += ", \",\", ";
	    angle_sum += ", \"+\", ";
	    old_parameters += "\"q" + (i - 1) + "\"";
	}
	
	parameters += "\"q" + i + "_\"";
	angle_sum += "\"q" + i + "\"";
	c += "RowBox[{\n";
	c += "RowBox[{\"x\\[LetterSpace]" + i + "\", \"[\", RowBox[{" + parameters + "}], \"]\"}], \":=\",";
	if(i > 0) {
	    c += "RowBox[{\"x\\[LetterSpace]" + (i - 1) + "\", \"[\", RowBox[{" + old_parameters + "}], \"]\"}], \"+\",\n";
	}
	c += "RowBox[{\"{\",";
	c += "RowBox[{";
	c += "RowBox[{\"L\\[LetterSpace]" + i + "\", \"*\",";
	c += "RowBox[{\"Cos\", \"[\", RowBox[{" + angle_sum + "}], \"]\"}]}], \",\",";
	c += "RowBox[{\"L\\[LetterSpace]" + i + "\", \"*\",";
	c += "RowBox[{\"Sin\", \"[\", RowBox[{" + angle_sum + "}], \"]\"}]}]}], \"}\"}]}]\n";
	
	if(i > 0) {
	    old_parameters += ", \",\", ";
	}
    }
    c += "}], \"Input\"],";
    
    // Angles
    var angle_names = "";
    
    c += "Cell[BoxData[{\n";
    for(i = 0; i < links.length; i++) {
	link = links[i];
	
	if(i > 0) {
	    c += ", \"\\[IndentingNewLine]\",\n";
	    angle_names += ", \",\", ";
	}
	
	var angle_rad, angle_length = link.angle;
	
	if(angle_length < -Math.PI) {
	    angle_rad = 2 * Math.PI + angle_length;
	} else if(angle_length > Math.PI) {
	    angle_rad = -(2 * Math.PI - angle_length);
	} else {
	    angle_rad = angle_length;
	}
	
	c += "RowBox[{RowBox[{\"q\\[LetterSpace]" + i + "\", \"=\", RowBox[{\"" + (angle_rad * 180.0 / Math.PI).toFixed(2) + "\", \"Degree\"}]}], \";\"}]";
	angle_names += "\"q\\[LetterSpace]" + i + "\"";
    }
    c += "}], \"Input\"],";
    
    // Evaluation of end effector
    c += "Cell[BoxData[{\n";
    c += "RowBox[{\"x\\[LetterSpace]" + (links.length - 1) + "\", \"[\",";
    c += "RowBox[{";
    c += angle_names + "}], \"]\"}]";
    c += "}], \"Input\"]";
    
    c += "}]\n";
    
    return c;
}

function Point(x, y) {
    "use strict";
    
    this.x = x;
    this.y = y;
}

function Solution(neg, pos) {
    "use strict";
    
    this.pos = pos;
    this.neg = neg;
}

function circle_joint(x0, y0, r0, x1, y1, r1) {
    "use strict";
    // This function returns the intermediate joint position Point
    // between two links. `solution_index` can be either 0 or two for
    // the positive or the negative solution, respectively.
    var dx = x0 - x1;
    var dy = y0 - y1;

    var y_sqrt_sum = Math.pow(dy, 2) * (Math.pow(dx, 2) + Math.pow(dy, 2) - Math.pow(r0 - r1, 2)) * (-Math.pow(dx, 2) - Math.pow(dy, 2) + Math.pow(r0 + r1, 2));
    var x_sqrt_sum = -Math.pow(dx, 2) * (-Math.pow(dx, 2) - Math.pow(dy, 2) + Math.pow(r0 - r1, 2)) * (-Math.pow(dx, 2) - Math.pow(dy, 2) + Math.pow(r0 + r1, 2))
    
    console.info("circle_joint(" + x0 + ", " + y0 + ", " + r0 + ", " + x1 + ", " + y1 + ", " + r1 + ")");
    
    if(Math.abs(dy) > 0.001) {
	console.info("in dy: " + y_sqrt_sum);
	
	if(y_sqrt_sum < 0 && y_sqrt_sum > -0.01) {
	    y_sqrt_sum = 0;
	}
	
	var y_sqrt = Math.sqrt(y_sqrt_sum);
	var y_neg = (1 / (2 * (Math.pow(dx, 2) + Math.pow(dy, 2)) * dy)) * (-Math.pow(dy, 2) * Math.pow(r0, 2) + Math.pow(dy, 2) * Math.pow(r1, 2) + dy * (Math.pow(dx, 2) + Math.pow(dy, 2)) * (y0 + y1) + y_sqrt * x0 - y_sqrt * x1);
	var y_pos = (1 / (2 * (Math.pow(dx, 2) + Math.pow(dy, 2)) * dy)) * (-Math.pow(dy, 2) * Math.pow(r0, 2) + Math.pow(dy, 2) * Math.pow(r1, 2) + dy * (Math.pow(dx, 2) + Math.pow(dy, 2)) * (y0 + y1) - y_sqrt * x0 + y_sqrt * x1);
	
	var x_neg_neg = x0 - Math.sqrt(Math.pow(r0, 2) - Math.pow(y_neg, 2) + 2 * y_neg * y0 - Math.pow(y0, 2));
	var x_neg_pos = x0 + Math.sqrt(Math.pow(r0, 2) - Math.pow(y_neg, 2) + 2 * y_neg * y0 - Math.pow(y0, 2));
	var x_pos_neg = x0 - Math.sqrt(Math.pow(r0, 2) - Math.pow(y_pos, 2) + 2 * y_pos * y0 - Math.pow(y0, 2));
	var x_pos_pos = x0 + Math.sqrt(Math.pow(r0, 2) - Math.pow(y_pos, 2) + 2 * y_pos * y0 - Math.pow(y0, 2));
	
	if(y_neg != y_pos) {
	    return Array(new Solution(new Point(x_neg_neg, y_neg), new Point(x_neg_pos, y_neg)), new Solution(new Point(x_pos_neg, y_pos), new Point(x_pos_pos, y_pos)));
	} else {
	    return Array(new Solution(new Point(x_neg_neg, y_neg), new Point(x_neg_pos, y_neg)));
	}
    } else if(Math.abs(dx) > 0.001) {
	console.info("in dx: " + x_sqrt_sum);
	
	if(x_sqrt_sum < 0 && x_sqrt_sum > -0.01) {
	    x_sqrt_sum = 0;
	}
	
	var x_sqrt = Math.sqrt(x_sqrt_sum);
	var x_neg = (1 / (2 * (Math.pow(dx, 2) + Math.pow(dy, 2)) * dx)) * (-Math.pow(dx, 2) * Math.pow(r0, 2) + Math.pow(dx, 2) * Math.pow(r1, 2) + dx * (Math.pow(dx, 2) + Math.pow(dy, 2)) * (x0 + x1) + x_sqrt * y0 - x_sqrt * y1);
	var x_pos = (1 / (2 * (Math.pow(dx, 2) + Math.pow(dy, 2)) * dx)) * (-Math.pow(dx, 2) * Math.pow(r0, 2) + Math.pow(dx, 2) * Math.pow(r1, 2) + dx * (Math.pow(dx, 2) + Math.pow(dy, 2)) * (x0 + x1) - x_sqrt * y0 + x_sqrt * y1);
	
	var y_neg_neg = y0 - Math.sqrt(Math.pow(r0, 2) - Math.pow(x_neg, 2) + 2 * x_neg * x0 - Math.pow(x0, 2));
	var y_neg_pos = y0 + Math.sqrt(Math.pow(r0, 2) - Math.pow(x_neg, 2) + 2 * x_neg * x0 - Math.pow(x0, 2));
	var y_pos_neg = y0 - Math.sqrt(Math.pow(r0, 2) - Math.pow(x_pos, 2) + 2 * x_pos * x0 - Math.pow(x0, 2));
	var y_pos_pos = y0 + Math.sqrt(Math.pow(r0, 2) - Math.pow(x_pos, 2) + 2 * x_pos * x0 - Math.pow(x0, 2));
	
	if(x_neg != x_pos) {
	    return Array(new Solution(new Point(x_neg, y_neg_neg), new Point(x_neg, y_neg_pos)), new Solution(new Point(x_pos, y_pos_neg), new Point(x_pos, y_pos_pos)));
	} else {
	    return Array(new Solution(new Point(x_neg, y_neg_neg), new Point(x_neg, y_neg_pos)));
	}
    } else {
	console.warn("No solution!");
	
	return Array();
    }
}

function get_ik(x, y) {
    "use strict";
    // This function returns the inverse kinematics solution for two
    // links and their intermediate joint
    /*var solutions = circle_joint(from_x, from_y, from_length, to_x, to_y, to_length);
    console.log(solutions);*/
    
    var solutions = null, i, link;
    var from_x, from_y;
    var sol_pts = Array();
    
    for(i = 0; i < links.length - 1; i++) {
	link = links[i];
	
	if(i == 0) {
	    from_x = 0;
	    from_y = 0;
	}
	
	var remaining_length = 0;
	var j;
	for(j = i + 1; j < links.length; j++) {
	    remaining_length += links[j].length;
	    solutions = circle_joint(from_x, from_y, link.length / 1000.0, x, y, remaining_length / 1000.0);
	    
	    if(solutions.length > 0) {
		break;
	    }
	}
	
	if(solutions.length > 0) {
	    // Solution selection
	    var solution = solutions[0].pos;
	    
	    from_x = solution.x;
	    from_y = solution.y;
	    sol_pts.push(solution);
	    
	    solutions = null;
	} else {
	    console.warn("Couldn't find solution for link " + i + "! Aborting.");
	    
	    break;
	}
    }
    
    return sol_pts;
}

function test_ik() {
    var x_ref = 0.0;
    var y_ref = 0.1;
    
    var sols = get_ik(x_ref, y_ref);
    var sol, x0 = 0, y0 = 0, angle0 = 0;
    
    ctx.beginPath();
    
    console.info(sols);
    for(i in sols) {
	sol = sols[i];
	ctx.strokeColor = "#000000";
	
	var x = 1000 * sol.x + padding;
	var y = (ik_canvas.height - padding) - 1000 * sol.y;
	ctx.moveTo(x, y);
	ctx.arc(x, y, 100, 0, 2 * Math.PI);
	
	var angle;
	if(sol.y - y0 < 0) {
	    angle = Math.asin((sol.y - y0) / (links[i].length / 1000.0));
	} else {
	    angle = Math.acos((sol.x - x0) / (links[i].length / 1000.0));
	}
	
	links[i].angle = angle - angle0;
	
	x0 = sol.x;
	y0 = sol.y;
	console.info("Setting " + sol.x + ", " + sol.y);
	angle0 += angle;
    }
    
    var angle_end;
    if(x0 - x_ref < 0) {
	console.info("!");
	angle_end = Math.asin((y_ref - y0) / (links[links.length - 1].length / 1000.0));
    } else {
	console.info("? " + x_ref + ", " + x0 + ", " + ((x_ref - x0) / (links[links.length - 1].length / 1000.0)));
	angle_end = Math.acos((x_ref - x0) / (links[links.length - 1].length / 1000.0));
    }
    
    links[links.length - 1].angle = angle_end - angle0;
    
    ctx.stroke();
    
    redraw_canvas();
}

function export_fk(option) {
    "use strict";
    
    var file_name = "";
    var file_type = "";
    var file_content = "";
    
    switch(option) {
    case "latex_formulas":
	file_name = "ForwardKinematicsFormulas.tex";
	file_type = "application/x-latex";
	file_content = generateFKLaTeXFormulas();
	break;

    case "latex_tikz":
	file_name = "ForwardKinematicsTikZ.tex";
	file_type = "application/x-latex";
	file_content = generateFKLaTeXTikZ();
	break;
	
    case "mathematica":
	file_name = "ForwardKinematics.nb";
	file_type = "application/mathematica";
	file_content = generateFKMathematica();
	break;
    }
    
    if(file_type != "") {
	var blobData = new Blob([file_content],
				{"type" : file_type,
				 endings : "transparent"});
	window.saveAs(blobData, file_name);
    }
}
