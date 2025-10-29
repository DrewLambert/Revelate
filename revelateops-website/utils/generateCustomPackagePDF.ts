import { jsPDF } from 'jspdf';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  comments: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  deliverables: string[];
}

export function generateCustomPackagePDF(
  userInfo: UserInfo,
  selectedServices: Service[]
): void {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Brand Colors (RGB)
  const navy = { r: 26, g: 31, b: 58 };
  const cyan = { r: 0, g: 217, b: 255 };
  const white = { r: 255, g: 255, b: 255 };
  const lightGray = { r: 245, g: 245, b: 250 };
  const textGray = { r: 60, g: 60, b: 60 };

  // Helper function to add subtle constellation stars
  const addConstellationStars = () => {
    doc.setFillColor(cyan.r, cyan.g, cyan.b);
    doc.setGState(doc.GState({ opacity: 0.08 }));

    // Add small star circles at various positions
    const stars = [
      { x: 30, y: 50 },
      { x: 80, y: 40 },
      { x: 140, y: 60 },
      { x: 170, y: 45 },
      { x: 50, y: 150 },
      { x: 160, y: 140 },
      { x: 100, y: 200 },
      { x: 180, y: 180 },
    ];

    stars.forEach(star => {
      doc.circle(star.x, star.y, 0.5, 'F');
    });

    doc.setGState(doc.GState({ opacity: 1 }));
  };

  // Helper function to add new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin - 15) {
      doc.addPage();
      addConstellationStars();
      addPageHeader();
      yPosition = 50;
      return true;
    }
    return false;
  };

  // Function to add clean header on each page
  const addPageHeader = () => {
    // Navy header bar
    doc.setFillColor(navy.r, navy.g, navy.b);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Try to add logo if available
    // For now, use text - you can replace with doc.addImage() when logo is ready
    doc.setTextColor(white.r, white.g, white.b);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('REVELATE', margin, 15);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cyan.r, cyan.g, cyan.b);
    doc.text('OPERATIONS', margin, 22);

    // Tagline
    doc.setFontSize(7);
    doc.setTextColor(white.r, white.g, white.b);
    doc.setGState(doc.GState({ opacity: 0.6 }));
    doc.text('Salesforce Expertise for Series B SaaS', margin, 30);
    doc.setGState(doc.GState({ opacity: 1 }));

    // Thin cyan line at bottom of header
    doc.setDrawColor(cyan.r, cyan.g, cyan.b);
    doc.setLineWidth(0.5);
    doc.line(0, 40, pageWidth, 40);
  };

  // Add first page header
  addPageHeader();
  addConstellationStars();

  // Document Title
  yPosition = 55;
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Custom Service Package', margin, yPosition);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textGray.r, textGray.g, textGray.b);
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.text(`Generated: ${today}`, margin, yPosition + 6);

  yPosition += 18;

  // Client Information Section
  doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
  const clientBoxHeight = userInfo.comments ? 48 : 36;
  doc.roundedRect(margin, yPosition, contentWidth, clientBoxHeight, 1, 1, 'F');

  // Left accent line
  doc.setFillColor(cyan.r, cyan.g, cyan.b);
  doc.rect(margin, yPosition, 2, clientBoxHeight, 'F');

  yPosition += 8;

  // Section label
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARED FOR', margin + 6, yPosition);

  yPosition += 7;

  // Client name
  doc.setFontSize(13);
  doc.text(`${userInfo.firstName} ${userInfo.lastName}`, margin + 6, yPosition);

  yPosition += 6;

  // Title and company
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textGray.r, textGray.g, textGray.b);
  doc.text(`${userInfo.title} | ${userInfo.companyName}`, margin + 6, yPosition);

  yPosition += 6;

  // Contact info
  doc.setFontSize(8);
  doc.text(`Email: ${userInfo.email}`, margin + 6, yPosition);
  doc.text(`Phone: ${userInfo.phone}`, margin + 95, yPosition);

  yPosition += 6;

  // Comments if present
  if (userInfo.comments) {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin + 6, yPosition, margin + contentWidth - 6, yPosition);
    yPosition += 4;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.text('Additional Comments:', margin + 6, yPosition);
    yPosition += 4;

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(textGray.r, textGray.g, textGray.b);
    const splitComments = doc.splitTextToSize(userInfo.comments, contentWidth - 16);
    doc.text(splitComments, margin + 6, yPosition);
    yPosition += splitComments.length * 3.5 + 2;
  } else {
    yPosition += 4;
  }

  yPosition += 12;

  // Services Section Header
  checkNewPage(20);

  doc.setFillColor(navy.r, navy.g, navy.b);
  doc.rect(margin, yPosition, contentWidth, 10, 'F');

  doc.setTextColor(white.r, white.g, white.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SELECTED SERVICES', margin + 4, yPosition + 6.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${selectedServices.length} service${selectedServices.length !== 1 ? 's' : ''} included`, pageWidth - margin - 4, yPosition + 6.5, { align: 'right' });

  yPosition += 16;

  // List each service
  selectedServices.forEach((service, index) => {
    checkNewPage(35);

    // Service number
    doc.setFillColor(navy.r, navy.g, navy.b);
    doc.circle(margin + 4, yPosition + 2, 3, 'F');
    doc.setTextColor(white.r, white.g, white.b);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text((index + 1).toString(), margin + 4, yPosition + 3, { align: 'center' });

    // Service title
    doc.setTextColor(navy.r, navy.g, navy.b);
    doc.setFontSize(11);
    doc.text(service.title, margin + 10, yPosition + 3);
    yPosition += 8;

    // Service description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textGray.r, textGray.g, textGray.b);
    const descLines = doc.splitTextToSize(service.detailedDescription, contentWidth - 10);
    doc.text(descLines, margin + 10, yPosition);
    yPosition += descLines.length * 4 + 4;

    // Deliverables
    if (service.deliverables && service.deliverables.length > 0) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(navy.r, navy.g, navy.b);
      doc.text('KEY DELIVERABLES', margin + 10, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textGray.r, textGray.g, textGray.b);
      doc.setFontSize(8);

      service.deliverables.forEach((deliverable) => {
        checkNewPage(6);

        // Simple bullet
        doc.setFillColor(cyan.r, cyan.g, cyan.b);
        doc.circle(margin + 12, yPosition - 1, 0.6, 'F');

        const deliverableLines = doc.splitTextToSize(deliverable, contentWidth - 20);
        doc.text(deliverableLines, margin + 16, yPosition);
        yPosition += deliverableLines.length * 3.5 + 1;
      });
    }

    yPosition += 8;

    // Separator line between services
    if (index < selectedServices.length - 1) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4);
    }
  });

  // Limited Time Offer Section
  checkNewPage(45);
  yPosition += 6;

  // Simple offer box
  doc.setFillColor(cyan.r, cyan.g, cyan.b);
  doc.setGState(doc.GState({ opacity: 0.12 }));
  doc.roundedRect(margin, yPosition, contentWidth, 22, 2, 2, 'F');
  doc.setGState(doc.GState({ opacity: 1 }));

  // Border
  doc.setDrawColor(cyan.r, cyan.g, cyan.b);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, contentWidth, 22, 2, 2, 'S');

  yPosition += 7;

  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('LIMITED TIME OFFER', margin + 4, yPosition);

  yPosition += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Schedule a consultation within 10 days and receive', margin + 4, yPosition);

  doc.setFont('helvetica', 'bold');
  doc.text('10% off', margin + 95, yPosition);

  doc.setFont('helvetica', 'normal');
  doc.text('your first contract', margin + 110, yPosition);

  yPosition += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(textGray.r, textGray.g, textGray.b);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 10);
  doc.text(
    `Offer expires: ${expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    margin + 4,
    yPosition
  );

  yPosition += 10;

  // Next Steps
  checkNewPage(35);
  yPosition += 4;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('NEXT STEPS', margin, yPosition);
  yPosition += 7;

  const nextSteps = [
    'Review your selected services and deliverables',
    'Book a free 30-minute consultation',
    'Receive a detailed project timeline and pricing proposal',
    'Begin your Salesforce transformation',
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textGray.r, textGray.g, textGray.b);

  nextSteps.forEach((step, index) => {
    // Number circle
    doc.setFillColor(cyan.r, cyan.g, cyan.b);
    doc.setGState(doc.GState({ opacity: 0.15 }));
    doc.circle(margin + 2.5, yPosition - 1, 2.5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setFillColor(navy.r, navy.g, navy.b);
    doc.circle(margin + 2.5, yPosition - 1, 1.8, 'F');

    doc.setTextColor(white.r, white.g, white.b);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text((index + 1).toString(), margin + 2.5, yPosition, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textGray.r, textGray.g, textGray.b);
    const stepLines = doc.splitTextToSize(step, contentWidth - 10);
    doc.text(stepLines, margin + 7, yPosition);
    yPosition += stepLines.length * 4 + 2;
  });

  yPosition += 5;

  // Contact box
  doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
  doc.roundedRect(margin, yPosition, contentWidth, 10, 1, 1, 'F');

  doc.setFillColor(cyan.r, cyan.g, cyan.b);
  doc.rect(margin, yPosition, 2, 10, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy.r, navy.g, navy.b);
  doc.text('Ready to get started?', margin + 4, yPosition + 4);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textGray.r, textGray.g, textGray.b);
  doc.text('Visit revelateops.com/book to schedule your free assessment', margin + 4, yPosition + 7.5);

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(navy.r, navy.g, navy.b);
    doc.setGState(doc.GState({ opacity: 0.1 }));
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setGState(doc.GState({ opacity: 1 }));

    // Page number
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    // Copyright and website
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${new Date().getFullYear()} Revelate Operations`,
      margin,
      pageHeight - 8
    );

    doc.setTextColor(cyan.r, cyan.g, cyan.b);
    doc.text(
      'revelateops.com',
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Revelate_Custom_Package_${userInfo.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
}
