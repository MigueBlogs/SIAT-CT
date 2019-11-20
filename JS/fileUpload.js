$(function(){
    var filesArray = [];

    $("#media").on("change", function(event) {
        console.log(event);
        event.preventDefault();
        var fileName = event.target.value.toLowerCase();
        upload(event.target.files);
        $("#uploadFormFile input").val("");
    });

    var upload = function(files){
        // console.log(files);
        var formData = new FormData(),
        xhr = new XMLHttpRequest(), x;

        for(x = 0; x < files.length; x++){
            formData.append('file[]', files[x]);
        }

        xhr.onload = function(){
            var data = JSON.parse(this.responseText);
            filesArray = [];
            data.uploaded.forEach(function(d){
                filesArray.push({
                    url: d.file,
                    name: d.name,
                    ext: d.ext
                });
            });

            console.log(filesArray);
            var templateSource = $("#filesUploaded-template").html();
            var template = Handlebars.compile(templateSource);
            var outputHTML = template({files: filesArray});
            $("#filesUploaded").html(outputHTML);

            $("#filesUploaded .deleteFile").on("click", function() {
                const fileUrl = $(this).attr("data-fileUrl");
                $(".file-item span[data-fileUrl='" + fileUrl + "']").parent().remove();
            });
        }

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                console.log('Bytes Loaded: ' + e.loaded);
                console.log('Total Size: ' + e.total);
                console.log('Percentage Uploaded: ' + (e.loaded / e.total))
                var percent = Math.round((e.loaded / e.total) * 100);
                $('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
            }
        });

        xhr.open('post', 'upload.php');
        xhr.send(formData);
    }

    function loadFile(fileUrl){
        var name = fileUrl.substr(fileUrl.lastIndexOf("/") + 1, fileUrl.lastIndexOf(".") - fileUrl.lastIndexOf("/") - 1);
        var extension = fileUrl.substr(fileUrl.lastIndexOf(".") + 1);
    }
});
