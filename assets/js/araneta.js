document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const headerRow = document.getElementById("headerRow");
  const tableBody = document.getElementById("tableBody");
  const downloadBtn = document.getElementById("downloadBtn");
  let selectedFiles = [];

  fileInput.addEventListener("change", function (event) {
    selectedFiles = Array.from(event.target.files);
    document.getElementById("fileCount").innerText =
      selectedFiles.length + " file(s) selected";
  });

  uploadBtn.addEventListener("click", function () {
    if (selectedFiles.length === 0) {
      alert("Please select file(s) first.");
      return;
    }

    while (headerRow.children.length > 1) {
      headerRow.removeChild(headerRow.lastChild);
    }

    const allData = [];
    let filesRead = 0;

    selectedFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result.trim();
        const firstLine = content.split("\n")[0];
        const values = firstLine.split(",");

        allData[i] = values;

        const th = document.createElement("th");
        th.textContent = file.name;
        headerRow.appendChild(th);

        filesRead++;
        if (filesRead === selectedFiles.length) {
          const maxRows = Math.max(...allData.map(arr => arr.length));
          const existingRows = tableBody.querySelectorAll("tr");

          for (let j = 0; j < existingRows.length; j++) {
            if (j < maxRows) {
              allData.forEach(values => {
                const cell = document.createElement("td");
                cell.textContent = values[j] || "";
                existingRows[j].appendChild(cell);
              });
            } else {
              tableBody.removeChild(existingRows[j]);
            }
          }

          for (let rowIndex = existingRows.length; rowIndex < maxRows; rowIndex++) {
            const row = document.createElement("tr");
            const fieldCell = document.createElement("td");
            fieldCell.textContent = "";
            row.appendChild(fieldCell);

            allData.forEach(values => {
              const cell = document.createElement("td");
              cell.textContent = values[rowIndex] || "";
              row.appendChild(cell);
            });

            tableBody.appendChild(row);
          }
        }
      };
      reader.readAsText(file);
    });
  });

  downloadBtn.addEventListener("click", function () {
    const rows = document.querySelectorAll("table tr");
    let csvContent = "";

    rows.forEach(row => {
      const cells = row.querySelectorAll("th, td");
      const rowData = Array.from(cells).map(cell =>
        `"${cell.textContent.replace(/"/g, '""')}"`
      );
      csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  document.getElementById("clear").addEventListener("click", function () {
  fileInput.value = "";
  selectedFiles = [];
  document.getElementById("fileCount").innerText = "";

  // Remove all <th> except the first one (Field Name)
  while (headerRow.children.length > 1) {
    headerRow.removeChild(headerRow.lastChild);
  }

  // Clear data cells in each row but keep the first cell (field name)
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach(row => {
    while (row.children.length > 1) {
      row.removeChild(row.lastChild);
    }
  });
});


});
