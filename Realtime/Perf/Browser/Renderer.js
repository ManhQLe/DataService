
var Renderer = {

	RenderComments: function (Comments) {		
		if (!Comments)
			return;
		var li = document.createElement("li");
		li.appendChild(Renderer.CreateRFCComment(Comments))
		var List = document.querySelector(".RFC-COMMENTS-LIST")
		List.appendChild(li);
		List.scrollTop = List.scrollHeight;
	},
	GetTemplate: function (id) {
		var content = document.getElementById(id).content;
		var Temp;
		if (content == null) {
			var Div = document.createElement("div");
			Div.innerHTML = document.getElementById(id).innerHTML;
			Temp = Div.querySelector("*");
		}
		else
			Temp = content;
		return document.importNode(Temp, true);
	},
	UserImageURL:function(NT){
        return "/Resources/Images/nvidia.png".replace("{0}",NT);
	},
	CreateRFCComment: function (c) {
		var url = this.UserImageURL(c.NTAccount);
		var X = Renderer.GetTemplate("RFC-COMMENT-TEMPLATE")
		d3.select(X).select(".HEAD > img.USERPROF").attr("src", url);
		d3.select(X).select(".HEAD >.INFO> div.USERNAME").text(c.UserName);
		d3.select(X).select(".HEAD >.INFO> div.COMMENT-DATE").text(moment(new Date(c.Date)).format("MM/DD/YYYY hh:mmA"));
		d3.select(X).select("div.COMMENTS").html(c.Comments.replace(/(?:\r\n|\r|\n)/g, "<br/>"));
		return X;
	},
	CreateRFCItem: function (r) {
		var X = Renderer.GetTemplate("RFC-ITEM-TEMPLATE")
		d3.select(X).select("a.RFC-LINK").datum(r).text(r["RFC ID"]).on("click", function (mr) {
			UI.OpenChangearRFC(mr.OID);
		})
		d3.select(X).select("div.RFC-SUMMARY")
		.attr("title", r.Summary)
		.text(r.Summary)
		var ImpactColor = DataManager.ImpactColor[r.Category];
		d3.select(X).select("div.RFC-IMPACT > div")
		.style({
			"background-color": ImpactColor ? ImpactColor : "#808080"
		})
		.text(r.Category)
		return X;
	},
}

