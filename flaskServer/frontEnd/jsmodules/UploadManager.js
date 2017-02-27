var UploadManager = (function(){
    var s;
    var currentOnSubmit;
    var currentType;
    var currentForm;
    return {
        settings: {
            popUpIdentifier: "#popup",
            fileTypes: {
                "txt": {
                    title: "Text file (.txt)",
                    form: function()
                    {
                        var form = $("<div></div>", {class: "upload_form"});
            
                        var filenameContainer = $("<div></div>", {class: "filename_container"});
                        var filenameLabel = $("<label></label>", {class: "filename_label"}).html("Filename");
                        var filenameInput = $("<input></input>", {class: "filename_input default_input upload_input"}).attr("type", "text").attr("placeholder", "Filename");
                        filenameContainer.append(filenameLabel);
                        filenameContainer.append(filenameInput);

                        var contentContainer = $("<div></div>", {class: "upload_content_container"});
                        var contentLabel = $("<label></label>", {class: "content_label"}).html("Initial content");
                        var contentInput = $("<textarea></textarea>", {class: "content_input upload_input default_input"}).attr("type", "text").attr("placeholder", "Insert file content here...");
                        contentContainer.append(contentLabel);
                        contentContainer.append(contentInput);

                        form.append(filenameContainer);
                        form.append(contentContainer);

                        return form;
                    },
                    onSubmit: function(dom)
                    {
                        var filename = dom.find(".filename_input").val();
                        var content = dom.find(".content_input").val();
                        return {
                            filename: filename,
                            content: content
                        }
                    }
                },

                "wf": {
                    title: "Empty Workflow",
                    form: function()
                    {
                        var form = $("<div></div>", {class: "upload_form"});

                        var filenameContainer = $("<div></div>", {class: "filename_container"});
                        var filenameLabel = $("<label></label>", {class: "filename_label"}).html("Filename (*.wf)");
                        var filenameInput = $("<input></input>", {class: "filename_input default_input upload_input"}).attr("type", "text").attr("placeholder", "E.g. Dose_Calculation_Workflow.wf");
                        filenameContainer.append(filenameLabel);
                        filenameContainer.append(filenameInput);

                        var dagnameContainer = $("<div></div>", {class: "dagname_container"});
                        var dagnameLabel = $("<label></label>", {class: "dagname_label"}).html("Workflowname");
                        var dagnameInput = $("<input></input>", {class: "dagname_input default_input upload_input"}).attr("type", "text").attr("placeholder", "E.g. Dose Calculation Workflow");
                        dagnameContainer.append(dagnameLabel);
                        dagnameContainer.append(dagnameInput);

                        form.append(filenameContainer);
                        form.append(dagnameContainer);

                        return form;
                    },
                    onSubmit: function(dom)
                    {
                        var filename = dom.find(".filename_input").val();
                        var dagname = dom.find(".dagname_input").val();

                        var dag = {
                            name: dagname,
                            user: window.username,
                            nodes: []
                        };
                        var dagSerialized = JSON.stringify(dag);
                        return {
                            filename: filename,
                            content: dagSerialized
                        };
                    }
                }
            }
        },
        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            
        },
        requestUpload: function(onSubmit)
        {
            this.currentType = "txt";
            this.currentOnSubmit = onSubmit;
            var popUpContent = this.getPopUpContent();
            PopUpManager.show(popUpContent);
        },
        getPopUpContent: function()
        {
            var uploadContainer = $("<div></div>", {class: "upload_container"});

            var selection = $("<select></select>", {class: "file_type_selection"});

            for(var key in this.s.fileTypes)
            {
                var option = $("<option></option>").attr("value", key.toString()).attr("file_type", key.toString());
                option.html(this.s.fileTypes[key].title);
                selection.append(option);
            }

            var formContainer = $("<form></form>");
            var innerContainer = $("<div></div>");
            uploadContainer.append(selection);
            uploadContainer.append(formContainer);

            

            var submitButton = $("<input></input>", {class: "default_button"}).attr("type", "submit").val("CREATE FILE");
            formContainer.append(innerContainer);
            formContainer.append(submitButton);

            uploadContainer.append(formContainer);

            this.typeSelected("txt", innerContainer);

            selection.on("change ready", function(){
                UploadManager.typeSelected(this.value, innerContainer);
            });

            formContainer.on("submit", this.submit.bind(this));

            return uploadContainer;
        },
        typeSelected: function(key, container)
        {
            this.currentType = key;
            container.html("");
            this.currentForm = this.s.fileTypes[this.currentType].form();
            container.append(this.currentForm);
        },
        submit: function()
        {
            PopUpManager.close();

            this.currentOnSubmit(this.s.fileTypes[this.currentType].onSubmit(this.currentForm));
        },
    }
})();

module.exports = UploadManager;