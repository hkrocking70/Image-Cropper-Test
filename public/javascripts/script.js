$(document).ready(function() {
    var _URL = window.URL || window.webkitURL;
    var imageFlag = 0;

    function preview() {
        console.log("Hello");
    }

    $("#fileUpload").change(function(e) {
        var file, img;
        if (file = this.files[0]) {
            img = new Image();
            img.onload = function() {
                if (this.width == 1024 && this.height == 1024) {
                    $(".submitButton").show();
                } else {
                    $(".submitButton").hide();
                }
            };
            img.onerror = function() {
                $("#submitButton").hide();
                alert("Not a valid file: " + file.type);
            };
            img.src = _URL.createObjectURL(file);
        }
    });

    $('.submitBox').submit(function(e) {
        $(".uploadMsg").show();
        $(".newImage").empty();
        $(".croppingView").empty();
        var formData = new FormData(this);
        $.ajax({
            type: 'POST',
            url: '/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,

            success: function(data) {
                $(".uploadMsg").hide();
                $(".croppingView").append("<br><br><br><img src='/images/"+data + "' width='30%' class='cropImage'>");
                $(".croppingView").append("<div style='width: 100px; height: 100px; position; absolute; background: rgba(255, 255, 255, 0.5); z-index: 5; left: 50%; top: -50%; margin-top: 0;' class='draggabale'></div>")
                $(".croppingView").append("<br><button class='cropButton'>Crop It</button>")
                $(".draggabale" ).draggable();
                $(".croppingView").show();
            }
        });
        return false;
    });

    $(document).on("click", ".cropButton", function() {
        $(".cropMsg").show();
        pos = $(".draggabale").position();
        
        pos.left -= $(".cropImage").position().left;
        pos.top -= $(".cropImage").position().top;

        img_height = $(".cropImage").height();
        img_width = $(".cropImage").width();
        
        height_ratio = 1024/img_height;
        width_ratio = 1024/img_width;
        
        data = {};
        data.x = pos.left * width_ratio;
        data.y = pos.top * height_ratio;
        data.url = $(".cropImage").attr("src");
        $.ajax({
            type: 'POST',
            url: '/changeImages',
            data: data,
            success: function(data) {
                $(".croppingView").hide();
                window.setTimeout(function() {
                    $(".cropMsg").hide();
                    $(".newImage").append("<img src='/images/" + data.base + data.ext + "' width='40%'><br>")
                    $(".newImage").append("<img src='/images/" + data.base + "/" + data.base + "_755_450" + data.ext + "' width='40%'><br>")
                    $(".newImage").append("<img src='/images/" + data.base + "/" + data.base + "_365_450" + data.ext + "' width='40%'><br>")
                    $(".newImage").append("<img src='/images/" + data.base + "/" + data.base + "_365_212" + data.ext + "' width='40%'><br>")
                    $(".newImage").append("<img src='/images/" + data.base + "/" + data.base + "_380_380" + data.ext + "' width='40%'><br>")
                }, 5000);
            }
        });
    });
});