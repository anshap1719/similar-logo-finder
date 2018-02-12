var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');
var data;

// highlight drag area
$fileInput.on('dragenter focus click', function () {
    $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function () {
    $droparea.removeClass('is-active');
});


// change inner text
$fileInput.on('change', function () {
    var filesCount = $(this)[0].files.length;
    file = $(this)[0].files[0];
    var $textContainer = $(this).prev('.js-set-number');

    if (filesCount === 1) {
        // if single file then show file name
        $textContainer.text($(this).val().split('\\').pop());
    } else {
        // otherwise show number of files
        $textContainer.text(filesCount + ' files selected');

    }
    var canvas = document.getElementById('canvasu');
    var img = document.createElement("img");
    fr = new FileReader(); // FileReader instance
    fr.readAsDataURL(file);

    fr.onload = function (e) {
        img.src = e.target.result;
        sessionStorage.setItem('queryImage', e.target.result);
        img.onload = function () {
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 400;
            var MAX_HEIGHT = 300;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL();
            console.log(dataurl);
            url = 'https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/upload/' + 'testing';
            //$fileInput.val().split('\\').pop()
            $.put(url, dataurl, function (result) {
                var urls = JSON.parse(result).map(function(t) {
                    return {
                        url: "https://s3.ap-south-1.amazonaws.com/clogos/" + t
                    }
                });
                sessionStorage.setItem('results', JSON.stringify(urls));
                window.location.href = "./results.html"
            });
        }
    }
});


function _ajax_request(url, data, callback, method) {
    return jQuery.ajax({
        url: 'https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/upload/' + 'testing',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        type: method,
        data: data,
        success: callback
    });
}


jQuery.extend({
    put: function (url, data, callback) {
        return _ajax_request(url, data, callback, 'PUT');
    }
});


function getBinary() {
    data = fr.result;
    console.log(data);
    $.ajax({
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        method: 'PUT',
        data: data,
        url: 'https://ml2wqc35jk.execute-api.ap-south-1.amazonaws.com/api/upload/' + $fileInput.val().split('\\').pop(),
        success: function (response) {
            console.log(response);
        }
    });
}