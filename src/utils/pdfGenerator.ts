import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Generates a high-quality PDF of the specified element by rendering it
 * to a high-density canvas and writing it into a standard A4 document.
 * 
 * Safely handles Tailwind v4 oklch/oklab color parsing issues with html2canvas.
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

  // Keep references for cleanups & rollbacks
  const originalInlineStyles: { element: HTMLStyleElement; content: string }[] = [];
  const tempStyleTags: HTMLStyleElement[] = [];
  const disabledLinkElements: HTMLLinkElement[] = [];

  try {
    // 1. Process all local style sheets on the page
    const styleElements = Array.from(document.querySelectorAll("style"));
    const linkElements = Array.from(document.querySelectorAll("link[rel='stylesheet']")) as HTMLLinkElement[];

    // Backup and sanitize existing inline style blocks
    for (const styleEl of styleElements) {
      originalInlineStyles.push({
        element: styleEl,
        content: styleEl.innerHTML
      });
      
      let sanitizedText = styleEl.innerHTML;
      sanitizedText = sanitizedText.replace(/oklch\([^\)]+\)/gi, "rgb(80, 80, 80)");
      sanitizedText = sanitizedText.replace(/oklab\([^\)]+\)/gi, "rgb(80, 80, 80)");
      styleEl.innerHTML = sanitizedText;
    }

    // Convert link stylesheets to inline styled text so we can strip oklch/oklab
    for (const linkEl of linkElements) {
      try {
        const href = linkEl.href;
        // Only fetch local/relative styles to prevent CORS failures or breaking Google Fonts
        if (href && (href.startsWith(window.location.origin) || href.startsWith("/") || !href.startsWith("http"))) {
          const response = await fetch(href);
          if (response.ok) {
            let cssText = await response.text();
            cssText = cssText.replace(/oklch\([^\)]+\)/gi, "rgb(80, 80, 80)");
            cssText = cssText.replace(/oklab\([^\)]+\)/gi, "rgb(80, 80, 80)");

            // Make a temporary style block
            const tempStyle = document.createElement("style");
            tempStyle.innerHTML = cssText;
            document.head.appendChild(tempStyle);
            tempStyleTags.push(tempStyle);

            // Disable link stylesheet to avoid html2canvas from loading it
            linkEl.disabled = true;
            disabledLinkElements.push(linkEl);
          }
        }
      } catch (err) {
        console.warn("Failed to sanitize stylesheet link safely:", linkEl.href, err);
      }
    }

    // Force styles on printable paper before canvas render
    const originBoxShadow = element.style.boxShadow;
    const originBorderRadius = element.style.borderRadius;
    const originBorder = element.style.border;

    element.style.boxShadow = "none";
    element.style.borderRadius = "0";
    element.style.border = "none";
    element.style.backgroundColor = "#ffffff";

    // 2. Build the canvas
    const canvas = await html2canvas(element, {
      scale: 2.2, // ~High quality print output DPI scaling
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794, // Standard A4 pixel width
      windowHeight: 1123 // Standard A4 pixel height
    });

    // Reset layout styles back
    element.style.boxShadow = originBoxShadow;
    element.style.borderRadius = originBorderRadius;
    element.style.border = originBorder;

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    
    // Create standard A4 PDF (210mm x 297mm)
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
    console.error("Error generating PDF document:", error);
    alert("Could not generate PDF directly. Please use the browser Print option (Ctrl+P) in the preview tab.");
  } finally {
    // 3. Rollback all modified styles to keep original interface beautifully intact
    for (const item of originalInlineStyles) {
      item.element.innerHTML = item.content;
    }
    for (const tempStyle of tempStyleTags) {
      tempStyle.remove();
    }
    for (const disabledLink of disabledLinkElements) {
      disabledLink.disabled = false;
    }

    if (onProgress) onProgress(false);
  }
}
