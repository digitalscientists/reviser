var DS = {
	Reviser:function(el) {
		// initialization
		this.editorElement = $(el);
		this.contentBackup = this.editorElement.html();
		this.menu = new DS.Menu(this);
		/*-------- Editor Core ---------------*/
		this.appendMenuToElement = function() {
			var coords = this.editorElement.offset();
			this.menu.attr("id",this.editorElement[0].id + '_reviser');
			$('body').append(this.menu);
			this.menu.css({
				'position':'absolute',
				'display':'none',
				'top':coords.top-24,
				'left':coords.left
			});
			//this.menu.slideToggle('medium');
			this.menu.show();
		};
		this.setElementToEditable = function(){
			this.editorElement.unbind('click');
			this.editorElement.attr('contenteditable',true);
			return true;
		};
		this.setElementToNonEditable = function(){
			var menu = $('#'+this.editorElement[0].id + '_reviser');
			/*menu.slideToggle('medium',function(){
				menu.remove();
			});*/
			menu.remove();
			this.editorElement.attr('contenteditable',false);
			$(this.editorElement).click(function(){
				this.editor = new DS.Reviser(this);
			});
			return true;
		};
		/*------------------------------------*/
		this.appendMenuToElement();
		this.setElementToEditable();
	},
	Menu:function(editor){
		var editor = editor;
		$.extend(this,DS.Commands);
		var menu = $('<div class="reviser_menu">\
			<a href="#" class="reviser_btn" id="boldSelection" alt="Text Bold">bold</a>\
			<a href="#" class="reviser_btn" id="italicSelection" alt="Text Italic">italic</a>\
			<a href="#" class="reviser_btn" id="strikethroughSelection" alt="Text Strike">strike</a>\
			<a href="#" class="reviser_btn" id="underlineSelection" alt="Text Under">underline</a>\
			<a href="#" class="reviser_btn" id="insertImage" alt="Insert Image">image</a>\
			<a href="#" class="reviser_btn" id="blockquoteSelection" alt="Insert Block Quote">block quote</a>\
			<a href="#" class="reviser_btn" id="insertOrderedList" alt="Insert Ordered List">ordered list</a>\
			<a href="#" class="reviser_btn" id="insertUnorderedList" alt="Insert Ordered List">unordered list</a>\
			<a href="#" class="reviser_btn" id="createLink" alt="Insert Link">link</a>\
			<a href="#" class="reviser_btn" id="save" alt="Save">save</a>\
			<a href="#" class="reviser_btn" id="revert" alt="Save">cancel</a>\
		</div>');
		this.bindMenu = function(){
			var scope = this;
			$('.reviser_btn',menu).each(function(){
				$(this).click(function(){
					scope[this.id].call(scope);
				});
			});
		};
		this.save = function(){
			editor.setElementToNonEditable();
			console.log(editor.editorElement.html());
		};
		this.revert = function(){
			editor.setElementToNonEditable();
			editor.editorElement.html(editor.contentBackup);
		};
		this.bindMenu();
		return menu;
	},
	Commands:{
		createLink:function() {
			url = this.needInput("What url? (Use http://)");
			return this.exec('createLink',url);
		},
		boldSelection: function() {
			this.exec('bold', null);
		},
		underlineSelection: function() {
			return this.exec('underline', null);
		},
		italicSelection: function() {
			return this.exec('italic', null);
		},
		strikethroughSelection: function() {
			return this.exec('strikethrough', null);
		},
		blockquoteSelection: function() {
			return this.exec('blockquote', null);
		},
		colorSelection: function(color) {
			return this.exec('forecolor', color);
		},
		insertOrderedList: function() {
			return this.exec('insertorderedlist', null);
		},
		insertUnorderedList: function() {
			return this.exec('insertunorderedlist', null);
		},
		insertImage: function() {
			url = this.needInput("What url? (Use http://)");
			return this.exec('insertImage', url);
		},
		insertHTML: function(html) {
	 		if ($.browser.msie) {
		     var range = this.editingElement._selection.getRange();
		     range.pasteHTML(html);
		     range.collapse(false);
		     range.select();
		   } else {
		     return this.exec('insertHTML', html);
		   }
		},
		needInput:function(msg) {
			var resp = prompt(msg);
			if (resp == "") {
				this.getInput(msg);
			}else{
				return resp;
			}
		},
		exec:function(fn,val){
			document.execCommand(fn,false,val);
			return false;
		}
	}
};