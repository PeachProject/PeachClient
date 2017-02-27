$.widget("peach.parameterWidget", {
    options: {
        parameters: undefined,
        usage: undefined,
        stateClass: "active",
        addClassOnShow: true,
        containerDom: undefined
    },

    _create: function()
    {
        this._update();
    },


    _update: function()
    {
        this.options.containerDom.html("");
        
        if(typeof this.options.parameters === typeof undefined || this.options.parameters.length <= 0)
        {
            this._hide();
            return;
        }

        this._show();
    },

    _hide: function()
    {
        (this.options.addClassOnShow && this.element.removeClass(this.options.stateClass) || this.element.addClass(this.options.stateClass));
        this.options.containerDom.html("");
    },

    load: function(params, usage)
    {
        this.options.parameters = params;
        this.options.usage = usage;
        this._update();
    },

    close: function(undefined, undefined)
    {
        this.load(undefined, undefined);
    },

    _show: function()
    {
        (this.options.addClassOnShow && this.element.addClass(this.options.stateClass) || this.element.removeClass(this.options.stateClass));        


        for(var i = 0;i < this.options.parameters.length; ++i)
        {
            var dom = this._createEditor(i);
            this.options.containerDom.append(dom);
        }
    },

    _createEditor: function(id)
    {
        var usage = this.options.usage[id];
        var param = this.options.parameters[id];

        if(usage == null)
        {
            usage = "";
        }

        var item = $("<li></li>", {class: "param_editor"});
        var label = $("<label></label>").attr("for", param.key).html(param.name);


        var field;

        switch(param.parameterType)
        {
            case 0:
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "text").attr("id", "param_" + param.key).val(usage);
                break;
            case 1:
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "number").attr("step", "1").attr("id", "param_" + param.key).val(usage);
                break;
            case 2:
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "number").attr("step", "0.0001").attr("id", "param_" + param.key).val(usage);
                break;
            case 3:
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "number").attr("step", "1").attr("id", "param_" + param.key).val(usage);
                break;
            case 4:
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "number").attr("step", "0.0001").attr("id", "param_" + param.key).val(usage);
                break;
            case 5:
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "text").attr("id", "param_" + param.key).val(usage);
                break;
            case 6:
                var checked = (usage == "true" || usage === true);
                console.log(checked);
                field = $("<input></input>", {class: "param_editor_field default_input"}).attr("type", "checkbox").attr("id", "param_" + param.key).prop("checked", checked);
                break;
        }

        item.append(label);
        item.append(field);
        if(param.parameterType != 6)
        {
            field.on("change paste keyup", (function(ev){
                this._updateValue(id, $(ev.target).val());
            }).bind(this));
        }else{
            field.on("change", (function(ev){
                this._updateValue(id, $(ev.target).is(":checked"));
            }).bind(this));
        }
        
        return item;
    },

    _updateValue: function(id, value)
    {
        var usage = this.options.usage[id];
        if(typeof usage === typeof undefined)
        {
            console.log("Couldn't find usage with id=" + id);
            return;
        }
        this.options.usage[id] = value.toString();
    }
});