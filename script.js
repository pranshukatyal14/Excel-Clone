const PS = new PerfectScrollbar("#cells", {
    wheelSpeed: 2,
    wheelPropogation: true
});

function findRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");

    //  let rowId=$(this).attr("id").split("-")[1];
    // let colId=$(this).attr("id").split("-")[3];

    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
}

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

let cellData = [];


for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`);
    let rowArray = [];
    for (let j = 1; j <= 100; j++) {
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false">`);
        rowArray.push({
            "font-family": "Noto Sans",
            "font-size": 14,
            "text": "",
            "bold": false,
            "italic": false,
            "underlined": false,
            "alignment": "left",
            "color": "#444",
            "bgcolor": "#fff"

        })
    }
    cellData.push(rowArray);
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

function getTopBottomLeftRightCell(rowId, colId) {
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return [topCell, bottomCell, leftCell, rightCell];
}

$(".input-cell").click(function (e) {

    let [rowId, colId] = findRowCol(this);
    let [topCell, bottomCell, leftCell, rightCell] = getTopBottomLeftRightCell(rowId, colId);


    if ($(this).hasClass("selected") && e.shiftKey) {
        unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    } else {
        selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }

});

function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if (e.shiftKey && $(ele).attr("contenteditable") == "false") {
        if ($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }
        if ($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");

        }
        if ($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }
        if ($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }
        $(ele).removeClass("selected top-selected bottom-selected right-selected left-selected");
    }
}

function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell, mouseSelection) {
    if (e.shiftKey || mouseSelection) {
        //TOP SELECTED OR NOT
        let topSelected;
        if (topCell) {
            topSelected = topCell.hasClass("selected");
        }
        // BOTTOM SELECTED OR NOT
        let bottomSelected;
        if (bottomCell) {
            bottomSelected = bottomCell.hasClass("selected");
        }
        //LEFT SELECTED OR NOT
        let leftSelected;
        if (leftCell) {
            leftSelected = leftCell.hasClass("selected");
        }
        // RIGHT SELECTED OR NOT
        let rightSelected;
        if (rightCell) {
            rightSelected = rightCell.hasClass("selected");
        }

        if (topSelected) {
            topCell.addClass("bottom-selected");
            $(ele).addClass("top-selected");
        }
        if (leftSelected) {
            leftCell.addClass("right-selected");
            $(ele).addClass("left-selected");
        }
        if (rightSelected) {
            rightCell.addClass("left-selected");
            $(ele).addClass("right-selected");
        }
        if (bottomSelected) {
            bottomCell.addClass("top-selected");
            $(ele).addClass("bottom-selected");
        }
    } else {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected")
    }
    $(ele).addClass("selected");
    changeHeader(findRowCol(ele));
}

function changeHeader([rowid, colId]) {
    let data = cellData[rowid - 1][colId - 1];
    $("#font-family").val(data["font-family"]);
    $("#font-family").css("font-family", data["font-family"]);
    $("#font-size").val(data["font-size"]);
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
    $("#fill-color-icon").css("border-bottom", `4px solid ${data.bgcolor}`);
    $("#text-color-icon").css("border-bottom", `4px sold ${data.color}`);

}
function addRemoveSelectFromFontStyle(data, property) {
    if (data[property]) {
        $(`#${property}`).addClass("selected");
    } else {
        $(`#${property}`).removeClass("selected");
    }

}
let mousemoved = false;
let startCellStored = false;
let startCell;
let endCell;

$(".input-cell").mousemove(function (event) {
    event.preventDefault();// stops the bydefault work
    if (event.buttons == 1 && !event.shiftKey) {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected right-selected left-selected");

        mousemoved = true;
        if (!startCellStored) {
            let [rowId, colId] = findRowCol(event.target);
            startCell = { rowId: rowId, colId: colId };
            startCellStored = true;

        } else {
            let { rowId, colId } = findRowCol(event.target);
            endCell = { rowId: rowId, colId: colId };
            selectAllBetweenRange(startCell, endCell);
        }


    } else if (event.buttons == 0 && mousemoved) {
        startCellStored = false;
        mousemoved = false;
        let [rowId, colId] = findRowCol(event.target);
        endCell = { rowId: rowId, colId: colId };
        selectAllBetweenRange(startCell, endCell);
    }
});

function selectAllBetweenRange(start, end) {
    for (let i = (start.rowId < end.rowId ? start.rowId : end.rowId); i <= (start.rowId < end.rowId ? end.rowId : start.rowId); i++) {
        for (let j = (start.colId < end.colId ? start.colId : end.colId); j <= (start.colId < end.colId ? end.colId : start.colId); j++) {
            let [topCell, bottomCell, leftCell, rightCell] = getTopBottomLeftRightCell(i, j);
            selectCell($(`#row-${i}-col-${j}`)[0], {}, topCell, bottomCell, leftCell, rightCell, true);
        }

    }
}

$(".menu-selector").change(function (e) {
    let value = $(this).val();
    let key = $(this).attr("id");
    if (key == "font-family") {
        $("#font-family").css(key, value);
    }
    if (!isNaN(value)) {
        value = parseInt(value);
    }

    $(".input-cell.selected").css(key, value);
    $(".input-cell.selected").each(function (index, data) {
        let [rowid, colId] = findRowCol(data);
        cellData[rowid - 1][colId - 1][key] = value;
    });

});


$(".alignment").click(function (e) {
    $(".alignment.selected").removeClass("selected");
    $(this).addClass("selected");
    let alignment = $(this).attr("data-type");
    $(".input-cell.selected").css("text-align", alignment);
    $(".input-cell.selected").each(function (index, data) {
        let [rowId, colId] = findRowCol(data);
        cellData[rowId - 1][colId - 1].alignment = alignment;
    });
});

$("#bold").click(function (e) {
    setFontStyle(this, "bold", "font-weight", "bold");

});

$("#italic").click(function (e) {
    setFontStyle(this, "italic", "font-style", "italic");
})

$("#underlined").click(function (e) {
    setFontStyle(this, "underlined", "text-decoration", "underline");

});
function setFontStyle(ele, property, key, value) {
    if ($(ele).hasClass("selected")) {
        $(ele).removeClass("selected");
        $(".input-cell.selected").css(key, "");
        $(".intput-cell.selected").each(function (index, data) {
            let [rowid, colId] = findRowCol(data);
            cellData[rowid - 1][colId - 1].property = false;
        });
    } else {
        $(ele).addClass("selected");
        $(".input-cell.selected").css(key, value);
        $(".input-cell.selected").each(function (index, data) {
            let [rowId, colId] = findRowCol(data);
            cellData[rowId - 1][colId - 1].property = true;
        })
    }
}

$(".color-pick").colorPick({
    'initialColor': '#TYPECOLOR',
    'allowRecent': true,
    'recentMax': 5,
    'allowCustomColor': true,
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
    'onColorSelected': function () {
        if (this.color != "#TYPECOLOR") {
            if (this.element.attr("id") == "fill-color") {
                $("#fill-color-icon").css("border-bottom", `4px solid ${this}.color`);
                $(".input-cell.selected").css("background-color", this.color);
                $(".input-cell.selected").each((index, data) => {
                    let [rowId, colId] = findRowCol(data);
                    cellData[rowId - 1][colId - 1].bgcolor = this.color;
                })
            } else {
                $("#text-color-icon").css("border-bottom", `4px solid ${this}.color`);
                $(".input-cell.selected").css("color", this.color);
                $(".input-cell.selected").each((index, data) => {
                    let [rowId, colId] = findRowCol(data);
                    cellData[rowId - 1][colId - 1].color = this.color;
                });

            }
        }
    }
});

$("#fill-color-icon,#text-color-icon").click(function (e) {
    setTimeout(() => {
        $(this).parent().click();
    }, 10);
});

$(".sheet-tab").bind("contextmenu", function (e) {
    e.preventDefault();
    selectSheet(this);

    $(".sheey-options-modal").remove();
    let modal = $(`<div class="sheet-options-modal">
    <div class="option  sheet-rename">Rename</div>
    <div class="option  sheet-delete">Delete</div>

                </div>`);
    $(".container").append(modal);
    $(".sheet-options-modal").css({ "bottom": 0.04 * $(window).height(), "left": e.pageX });
    $(".sheet-rename").click(function (e) {
       
    })
});



$(".container").click(function (e) {
    $(".sheet-options-modal").remove();

});



$(".sheet-tab").click(function (e) {
    selectSheet(this);
})


function selectSheet(ele) {
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
}