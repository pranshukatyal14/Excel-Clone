const PS = new PerfectScrollbar("#cells", {
    wheelSpeed: 2,
    wheelPropogation: true
});

for (let i = 1; i <= 100; i++) {
    let str = "";
    let n = i;

    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = 'Z' + str;
            n = Math.floor((n / 26)) - 1;
        } else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor((n / 26));

        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`);
}

for (let j = 1; j <= 100; j++) {

    $("#rows").append(`<div class="row-name">${j}</div>`);
}

for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`)
    for (let j = 1; j <= 100; j++) {
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" >`)
    }
    $("#cells").append(row);
}

$("#cells").scroll(function () {
    // console.log(this.scrollLeft);
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
});

$(".input-cell").dblclick(function () {
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function () {
    $(this).attr("contenteditable", "false");
});

$(".input-cell").click(function (e) {

    if (e.shiftKey) {

        let idArray = $(this).attr("id").split("-");
        let rowId = parseInt(idArray[1]);
        let colId = parseInt(idArray[3]);
        //  let rowId=$(this).attr("id").split("-")[1];
        // let colId=$(this).attr("id").split("-")[3];


        // top selected or not
        let topSelected;
        let topCell;
        if (rowId != 0) {
            topCell = $(`#row-${rowId - 1}-col-${colId}`);
            topSelected = topCell.hasClass("selected");
        }
        // bottomSelected Or Not
        let bottomCell = $(`#row-${rowId + 1}-col-${colId}`)
        let bottomSelected = bottomCell.hasClass("selected");


        // left selected or not
        let leftCell;
        let leftSelected;
        if (colId != 0) {
            leftCell = $(`#row-${rowId}-col-${colId - 1}`)
            leftSelected = leftCell.hasClass("selected");

        }

        //right selected or not
        let rightCell = $(`#row-${rowId}-col-${colId + 1}`)
        let rightSelected = rightCell.hasClass("selected");

        if (topSelected) {

            topCell.addClass("bottom-selected")
            $(this).addClass("top-selected");
        }

        if (leftSelected) {

            leftCell.addClass("right-selected");
            $(this).addClass("left-selected");
        }

        if (rightSelected) {

            rightCell.addClass("left-selected");
            $(this).addClass("right-selected");
        }
        if (bottomSelected) {

            bottomCell.addClass("top-selected");
            $(this).addClass("bottom-selected");
        }
    } else {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    }

    $(this).addClass("selected");
});

