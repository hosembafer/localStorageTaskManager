var obj = new Object;
	obj.list = new Object;

$(document).ready(function() {
	
	init();
	
	sortableList = document.getElementById("main_list");
	var p = new Sortable(sortableList, {
		handle: ".item__tpl1__left",
		draggable: ".item__tpl1",
		onUpdate: function(evt) {
			arr = document.getElementsByClassName("item__tpl1");
			for(i = 0; i < arr.length; i++)
			{
				
				item_id = parseInt(arr[i].getAttribute("rel"));
				for(l = 0; l < arr.length; l++)
				{
					if(l == item_id)
					{
						obj.list[item_id].num = i;
					}
				}
			}
			
			normalizeObj();
			updateList();
		}
	});
	
	$("#add_area__show_btn").click(function() {
		e = $("#add_area");
		if($(e).css("display") == "none")
		{
			this.children[0].innerHTML = "-";
			$(e).slideDown(150);
		}
		else
		{
			this.children[0].innerHTML = "+";
			$(e).slideUp(150);
		}
	});
	
	$("#add_btn").click(function() {
		title = document.getElementById("add_area__title");
		text = document.getElementById("add_area__text");
		if(title.value == "")
		{
			title.classList.add("red");
			$(title).focus();
			return false;
		}
		else
		{
			title.classList.remove("red");
		}
		
		addToList(title.value, text.value);
		
		title.value = "";
		text.value = "";
	});
	
	$("#edit_btn").click(function() {
		item_id = parseInt(document.getElementById("edit_area").getAttribute("rel"));
		
		title = document.getElementById("edit_area__title");
		text = document.getElementById("edit_area__text");
		
		if(title.value == "")
		{
			title.classList.add("red");
			$(title).focus();
			return false;
		}
		else
		{
			title.classList.remove("red");
		}
		
		editItem(item_id, title.value, text.value);
	});
	
	$("#remove_btn").click(function() {
		item_id = parseInt(document.getElementById("edit_area").getAttribute("rel"));
		removeFromList(item_id);
	});
	
});

function init()
{
	if(localStorage.getItem("projects") == null)
		normalizeObj();
		
	obj = JSON.parse(localStorage.getItem("projects"));
	
	normalizeObj();
	updateList();
}

function addToList(title, text)
{
	size = Object.keys(obj.list).length;
	obj.list[size]={
		"title": title,
		"text": text,
		"num": size
	};
	
	normalizeObj();
	updateList();
}

function removeFromList(item_id)
{
	delete obj.list[item_id];
	normalizeObj();
	
	$(".item__tpl1[rel="+item_id+"]").slideUp(500);
	resetEditForm();
	setTimeout(updateList, 500);
}

function resetEditForm()
{
	document.getElementById("edit_area").setAttribute("rel", "");
	document.getElementById("edit_area__title").value = "";
	document.getElementById("edit_area__text").value = "";
	$("#edit_area").slideUp(150);
}

function updateList()
{
	document.getElementById("main_list").innerHTML = "";
	arr = obj.list;
	size = Object.keys(obj.list).length;
	for(n in arr)
	{
		for(l = 0; l < size; l++)
		{
			if(l == arr[n].num)
			{
				classes = "";
				if(arr[n].isRed != null)
					classes = "red";
				
				str = ""+
					"<div class='item__tpl1 " + classes + "' rel='" + n + "' num='" + arr[n].num + "'>" +
						"<div class='item__tpl1__left' onclick='getSolving(this);'>" +
							"<div class='item__tpl1__left__title'>" + arr[n].title + "</div>" +
						"</div>" +
						"<div class='item__tpl1__right'>" +
							"<div class='btn__tpl1' onclick='prepareToEdit(" + n + ")'>Edit</div>" +
						"</div>" +
						"<div class='clearfix'></div>" +
					"</div>" +
				"";
				
				document.getElementById("main_list").innerHTML = document.getElementById("main_list").innerHTML + str
			}
		}
	}
	
	$("#main_list .item__tpl1").sort(function (a, b) {
		return +a.getAttribute("num") - +b.getAttribute("num");
	}).appendTo("#main_list");	
}

function prepareToEdit(item_id)
{
	$("#edit_area").slideDown(150);
	document.getElementById("edit_area").setAttribute("rel", item_id);
	document.getElementById("edit_area__title").value = obj.list[item_id].title;
	document.getElementById("edit_area__text").value = obj.list[item_id].text;
}

function editItem(item_id, title, text)
{
	obj.list[item_id].title = title;
	obj.list[item_id].text = text;
	
	normalizeObj();
	updateList();
	resetEditForm();
}

function getSolving(elem)
{
	score = elem.parentNode;
	item_id = parseInt(score.getAttribute("rel"));
	
	if(score.classList.contains("red"))
	{
		delete obj.list[item_id].isRed;
		score.classList.remove("red");
	}
	else
	{
		obj.list[item_id].isRed = true;
		score.classList.add("red");
	}
	
	normalizeObj();
}

function normalizeObj()
{
	localStorage.setItem("projects", JSON.stringify(obj));
}
