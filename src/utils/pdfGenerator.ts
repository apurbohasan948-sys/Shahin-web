import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Generates a high-quality PDF of the specified element by rendering it
 * to a high-density canvas and writing it into a standard A4 document.
 */
export async function downloadReportAsPdf(
  elementId: string,
  fileName: string = "Medical_Examination_Report.pdf",
  onProgress?: (loading: boolean) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return;
  }

  if (onProgress) onProgress(true);

  try {
    // Force some styles for high-fidelity printing before canvas capture
    const originBoxShadow = element.style.boxShadow;
    const originBorderRadius = element.style.borderRadius;
    const originBorder = element.style.border;

    element.style.boxShadow = "none";
    element.style.borderRadius = "0";
    element.style.border = "none";
    element.style.backgroundColor = "#ffffff";

    // Build the canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Double DPI for professional print quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794, // A4 pixels at ~96 DPI width
      windowHeight: 1123 // A4 pixels at ~96 DPI height
    });

    // Reset styles
    element.style.boxShadow = originBoxShadow;
    element.style.borderRadius = originBorderRadius;
    element.style.border = originBorder;

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    
    // Standard A4 aspect ratio in PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Could not generate PDF. Please try again or use the browser Print (Ctrl+P) option.");
  } finally {
    if (onProgress) onProgress(false);
  }
}
