function onlyOne(checkbox) {
    let checkboxes = document.getElementsByName('R')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    })
}