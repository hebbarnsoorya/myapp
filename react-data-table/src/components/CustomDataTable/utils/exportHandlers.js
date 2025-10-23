import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For PDF table generation

/**
 * Helper to prepare data for export (excluding hidden columns)
 * @param {Array<Object>} data - The raw data list.
 * @param {Array<Object>} columnsConfig - The column definitions.
 * @returns {Array<Array<any>>} Array of arrays suitable for export.
 */
const prepareExportData = (data, columnsConfig) => {
  const visibleColumns = columnsConfig.filter(col => col.isVisible !== false);
  const headers = visibleColumns.map(col => col.header);
  
  const body = data.map(row => 
    visibleColumns.map(col => row[col.accessorKey] !== undefined ? row[col.accessorKey] : '')
  );
  
  return { headers, body };
};


// --- EXPORT HANDLERS ---

export const exportToCsv = (data, columnsConfig, filename = 'data_export') => {
  const { headers, body } = prepareExportData(data, columnsConfig);
  
  let csvContent = headers.join(',') + '\n';
  body.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data, columnsConfig, filename = 'data_export') => {
  const { headers, body } = prepareExportData(data, columnsConfig);
  const worksheetData = [headers, ...body];
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPdf = (data, columnsConfig, filename = 'data_export') => {
  const { headers, body } = prepareExportData(data, columnsConfig);

  const doc = new jsPDF();
  
  // Custom styling using the suggested primary color #E98D2E
  doc.setFontSize(10);
  doc.autoTable({
    head: [headers],
    body: body,
    theme: 'grid',
    headStyles: {
      fillColor: '#E98D2E', // Primary Accent Color
      textColor: '#FFFFFF',
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle'
    }
  });

  doc.save(`${filename}.pdf`);
};